import React from 'react';
import PropTypes from 'prop-types';
import PdfJs from 'pdfjs-dist';
import './addFilesInput.css';

class AddFilesInput extends React.Component {
  state = {
    docs: this.props.docs,
  }
  componentDidMount() {
    this.displayPdfThumbnail();
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.docs.length !== this.state.docs.length) {
      this.displayPdfThumbnail();
      this.props.onFileChange(this.state.docs);
    }
  }
  handleInputFileChange = (evt) => {
    this.readUrl(evt.target);
  }
  readUrl = (input) => {
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        this.setState(prevState => ({
          ...prevState,
          docs: [
            ...prevState.docs,
            {
              value: evt.target.result,
              changed: true,
            },
          ],
        }));
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
  handleRemoveThumbnail = (evt) => {
    const { id } = evt.target;
    const { state } = this;
    const newDocs = state.docs.filter((value, index) => (
      index !== Number(id)
    ));
    this.setState(prevState => ({
      ...prevState,
      docs: newDocs,
    }));
  }
  displayPdfThumbnail = () => {
    const trimBase64 = doc => (
      new Promise((resolve) => {
        resolve(doc.value.replace('data:application/pdf;base64,', ''));
      }));
    this.state.docs.map((doc, index) => (
      trimBase64(doc)
        .then((newEncodedString) => {
          const pdfData = atob(newEncodedString);
          const canvas = document.getElementById(`canvas-${index}`);
          const context = canvas.getContext('2d');
          PdfJs.getDocument({ data: pdfData }).then((pdf) => {
            pdf.getPage(1)
              .then((page) => {
                const scale = 1.5;
                const viewport = page.getViewport(scale);
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                const renderContext = {
                  canvasContext: context,
                  viewport,
                };
                page.render(renderContext);
              });
          });
        })
    ));
  }
  render() {
    const {
      error,
      blur,
    } = this.props;
    return (
      <div className="form-group">
        <label>Documents</label>
        <div className="thumbnail-wrapper">
          <label htmlFor="docs">
            <div className="add-thumbnail">
              <i className="fas fa-plus-circle fa-3x" />
            </div>
          </label>
          <input
            type="file"
            name="docs"
            id="docs"
            accept=".pdf"
            onChange={this.handleInputFileChange}
          />
          {this.state.docs.map((doc, index) => (
            <div key={index} className="thumbnail">
              <button
                id={index}
                type="button"
                className="delete-thumbnail"
                onClick={this.handleRemoveThumbnail}
              >X
              </button>
              <canvas id={`canvas-${index}`} />
            </div>
          ))}
        </div>
        {error && <small>{error}</small>}
      </div>
    );
  }
}

AddFilesInput.propTypes = {
  docs: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]).isRequired,
  onFileChange: PropTypes.func.isRequired,
  error: PropTypes.object,
};

AddFilesInput.defaultProps = {
  error: null,
};

export default AddFilesInput;
