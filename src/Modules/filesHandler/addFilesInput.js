import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import PdfJs from 'pdfjs-dist';
import './addFilesInput.css';
import ViewerPdf from './viewerPdf';

class AddFilesInput extends React.Component {
  static propTypes = {
    docs: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
    ]).isRequired,
    onFileChange: PropTypes.func,
    readOnly: PropTypes.bool,
  };
  static defaultProps = {
    readOnly: false,
    onFileChange: null,
  };
  state = {
    docs: this.props.docs,
    viewer: {
      doc: '',
      corrupted: false,
      message: null,
    },
    error: null,
    isFocused: false,
  }

  componentDidMount() {
    this.displayPdfThumbnail(this.state.docs);
    PdfJs.GlobalWorkerOptions.workerSrc = '/node_modules/pdfjs-dist/build/pdf.worker.js';
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.docs.length !== this.state.docs.length) {
      this.displayPdfThumbnail(this.state.docs);
      this.props.onFileChange(this.state.docs);
    }
  }

  handleInputFileChange = (evt) => {
    console.log('click')
    this.readUrl(evt.target);
  }
  readUrl = (input) => {
    const authorizedTypeFile = 'application/pdf';
    if (input.files && input.files[0] && input.files[0].type === authorizedTypeFile) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        this.setState(prevState => ({
          ...prevState,
          error: null,
          docs: [
            ...prevState.docs,
            {
              value: evt.target.result,
              changed: true,
              name: input.files[0].name,

            },
          ],
        }));
      };
      reader.readAsDataURL(input.files[0]);
    }
    else if (input.files.length === 0) {
      this.setState(prevState => ({
        ...prevState,
      }));
    }
    else {
      this.setState(prevState => ({
        ...prevState,
        error: 'Wrong format accepts only pdf file',
      }));
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
  trimBase64 = doc => new Promise((resolve) => {
    resolve(doc.value.replace('data:application/pdf;base64,', ''));
  });
  displayPdfThumbnail = (docs) => {
    docs.map((doc, index) => (
      this.trimBase64(doc)
        .then((newEncodedString) => {
          const pdfData = atob(newEncodedString);
          const canvas = document.getElementById(`canvas-${index}`);
          if (!canvas) {
            return false;
          }
          const context = canvas.getContext('2d');
          return PdfJs.getDocument({ data: pdfData })
            .then((pdf) => {
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
              this.setState(() => ({
                viewer: {
                  doc,
                  [doc.name]: {
                    corrupted: false,
                  },
                },
              }));
            })
            .catch(() => this.setState(() => ({
              viewer: {
                doc,
                [doc.name]: {
                  corrupted: true,
                  message: 'Pdf unreadable, the file is probably corrupted. Please delete it and try uploading it again',
                },
              },
            })));
        })
    ));
  }
  handleViewer = (evt) => {
    const doc = evt.target.dataset.b64;
    this.setState(prevState => ({
      viewer: {
        ...prevState.viewer,
        display: true,
        doc,
      },
    }));
  }
  handleCloseViewer = () => {
    this.setState(prevState => ({
      viewer: {
        ...prevState.viewer,
        display: false,
      },
    }));
  }
  handleOnFocus = () => {
    this.setState(prevState => ({
      ...prevState,
      isFocused: true,
    }));
  }
  handleOnBlur = () => {
    this.setState(prevState => ({
      ...prevState,
      isFocused: false,
    }));
  }
  render() {
    const {
      error,
    } = this.state;
    const { id } = this.props;
    return ([
      <div key="docs" className="addfilesinput form-group">
        <label>Documents</label>
        <div className="addfilesinput-thumbnail-wrapper">
          {!this.props.readOnly && [
            <label key="label-docs" htmlFor={`docs--${id}`}>
              <div className={`add-thumbnail ${this.state.isFocused ? 'add-thumbnail--focused' : ''}`}>
                <i className="fas fa-plus-circle fa-3x" />
              </div>
            </label>,
            <input
              key="input-docs"
              type="file"
              name="docs"
              className="inputfile-docs"
              id={`docs--${id}`}
              accept=".pdf"
              onChange={this.handleInputFileChange}
              onFocus={this.handleOnFocus}
              onBlur={this.handleOnBlur}
            />,
          ]}
          <div className="addfilesinput-thumbnail-container">
            {this.state.docs.map((doc, index) => {
              return (
                <div key={index} className="addfilesinput-thumbnail-content">
                  {!this.props.readOnly &&
                    <button
                      id={index}
                      type="button"
                      className="delete-thumbnail"
                      onClick={this.handleRemoveThumbnail}
                    >X
                    </button>
                  }
                  {this.state.viewer[doc.name] && this.state.viewer[doc.name].corrupted ?
                    <small className="error-message">{this.state.viewer[doc.name].message}</small> :
                    <Fragment>
                      <div>
                        <canvas
                          data-b64={doc.value}
                          onClick={this.handleViewer}
                          id={`canvas-${index}`}
                        />
                      </div>
                      {doc.name && <p>{doc.name}</p>}
                    </Fragment>
                  }
                </div>
              )
            })}
          </div>
        </div>
        {error && <small className="error-message">{error}</small>}
      </div>,
      <div key="viewer">{this.state.viewer.display &&
        <ViewerPdf close={this.handleCloseViewer} doc={this.state.viewer.doc} />}
      </div>,
    ]);
  }
}

export default AddFilesInput;
