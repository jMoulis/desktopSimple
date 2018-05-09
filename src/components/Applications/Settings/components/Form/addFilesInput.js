import React from 'react';
import PropTypes from 'prop-types';
import PdfJs from 'pdfjs-dist';
import './addFilesInput.css';

class AddFilesInput extends React.Component {
  state = {
    docs: this.props.docs,
    viewer: {
      display: false,
      pdfRaw: '',
      zoom: 1.5,
    },
  }
  componentDidMount() {
    this.displayPdfThumbnail(this.state.docs);
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.docs.length !== this.state.docs.length) {
      this.displayPdfThumbnail(this.state.docs);
      this.props.onFileChange(this.state.docs);
    }
    if (this.state.viewer.display) {
      const { viewer } = this.state;
      this.trimBase64({ value: viewer.pdfRaw })
        .then((newEncodedString) => {
          const pdfData = atob(newEncodedString);
          const canvas = document.getElementById('canvas-viewer');
          const context = canvas.getContext('2d');
          PdfJs.getDocument({ data: pdfData }).then((pdf) => {
            pdf.getPage(1)
              .then((page) => {
                const scale = viewer.zoom;
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
        });
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
  handleViewer = (evt) => {
    // Show modal with huge canvas
    const pdfRaw = evt.target.dataset.b64;
    this.setState(prevState => ({
      viewer: {
        ...prevState.viewer,
        display: true,
        pdfRaw,
      },
    }));
  }
  handleZoom = (evt) => {
    const { id } = evt.target;
    let value;
    if (id === 'minus') {
      value = -0.1;
    }
    else {
      value = 0.1;
    }
    this.setState(prevState => ({
      viewer: {
        ...prevState.viewer,
        zoom: prevState.viewer.zoom + value,
      },
    }));
  }
  trimBase64 = doc => new Promise((resolve) => {
    resolve(doc.value.replace('data:application/pdf;base64,', ''));
  });
  displayPdfThumbnail = (docs) => {
    docs.map((doc, index) => (
      this.trimBase64(doc)
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
    } = this.props;
    return ([
      <div key="docs" className="form-group">
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
              <canvas data-b64={doc.value} onClick={this.handleViewer} id={`canvas-${index}`} />
            </div>
          ))}
        </div>
        {error && <small>{error}</small>}
      </div>,
      <div key="viewer" className="viewer-overlay" style={{ display: this.state.viewer.display && 'flex' }}>
        <div id="viewer">
          <div className="btn-container">
            <button type="button" id="plus" onClick={this.handleZoom}>plus</button>
            <button type="button" id="minus" onClick={this.handleZoom}>minus</button>
          </div>
          <div className="canvas-container">
            <canvas id="canvas-viewer" />
          </div>
        </div>
      </div>,
    ]);
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
