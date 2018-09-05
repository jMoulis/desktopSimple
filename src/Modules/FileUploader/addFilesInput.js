import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PdfJs from 'pdfjs-dist';

import './addFilesInput.css';
import ViewerPdf from './viewerPdf';
import Utils from '../../Utils/utils';
import { showOverflowAction } from '../../store/reducers/appReducer';
import FileInfo from './FileInfo';

const mapStateToProps = ({ projectReducer, userReducer }) => ({
  project: projectReducer.activeProjectProcess.project,
  userList: userReducer.userList,
});

const mapDispatchToProps = dispatch => ({
  showOverflow: () => {
    dispatch(showOverflowAction());
  },
});

class FileUploader extends React.Component {
  static propTypes = {
    docs: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
    showOverflow: PropTypes.func.isRequired,
    onFileChange: PropTypes.func,
    readOnly: PropTypes.bool,
  };

  static defaultProps = {
    readOnly: false,
    onFileChange: null,
  };

  constructor(props) {
    super(props);
    this.utils = new Utils();
    this.state = {
      docs: this.props.docs,
      viewer: {
        doc: '',
        corrupted: false,
        message: null,
      },
      error: null,
      isFocused: false,
    };
  }

  componentDidMount() {
    this.displayThumbnail(this.state.docs);
    PdfJs.GlobalWorkerOptions.workerSrc =
      '/node_modules/pdfjs-dist/build/pdf.worker.js';
  }

  static getDerivedStateFromProps(props, state) {
    if (props.docs.length !== state.docs.length) {
      return {
        ...state,
        docs: props.docs,
      };
    }
    return {
      ...state,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.docs.length !== this.props.docs.length) {
      this.displayThumbnail(this.state.docs);
    }
  }

  handleInputFileChange = evt => {
    const { onFileChange } = this.props;
    onFileChange(evt.target.files[0]);
  };

  handleRemoveThumbnail = evt => {
    const { onFileDelete } = this.props;
    const { id } = evt.target;
    const document = this.state.docs.find(doc => doc._id === id);
    onFileDelete(document);
  };

  trimBase64 = doc =>
    new Promise(resolve => {
      resolve(doc.value.replace('data:application/pdf;base64,', ''));
    });

  displayThumbnail = docs =>
    docs.map(doc => {
      if (doc && doc.extension === 'pdf') {
        this.trimBase64(doc).then(newEncodedString => {
          const pdfData = atob(newEncodedString);
          const canvas = document.getElementById(`canvas-${doc._id}`);
          if (!canvas) {
            return false;
          }
          const context = canvas.getContext('2d');
          return PdfJs.getDocument({ data: pdfData })
            .then(pdf => {
              pdf.getPage(1).then(page => {
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
            .catch(() =>
              this.setState(() => ({
                viewer: {
                  doc,
                  [doc.name]: {
                    corrupted: true,
                    message:
                      'Pdf unreadable, the file is probably corrupted. Please delete it and try uploading it again',
                  },
                },
              })),
            );
        });
      }
    });

  handleViewer = evt => {
    const { showOverflow } = this.props;
    showOverflow();
    const doc = evt.target.dataset.b64;
    this.setState(prevState => ({
      viewer: {
        ...prevState.viewer,
        display: true,
        doc,
      },
    }));
  };

  handleCloseViewer = () => {
    const { showOverflow } = this.props;
    showOverflow();
    this.setState(prevState => ({
      viewer: {
        ...prevState.viewer,
        display: false,
      },
    }));
  };

  handleOnFocus = () => {
    this.setState(prevState => ({
      ...prevState,
      isFocused: true,
    }));
  };

  handleOnBlur = () => {
    this.setState(prevState => ({
      ...prevState,
      isFocused: false,
    }));
  };

  renderFileIcon = doc => {
    if (this.utils.isImage(doc))
      return <img className="full-width" src={doc.value} alt="Doc Thumbnail" />;
    if (this.utils.isDocFile(doc))
      return (
        <i
          className={`far fa-file-${this.utils.isDocFile(doc.extension)} fa-3x`}
        />
      );
    if (this.utils.isPresentationFile(doc))
      return (
        <i
          className={`far fa-file-${this.utils.isDocFile(doc.extension)} fa-3x`}
        />
      );
  };
  render() {
    const { error, docs, viewer } = this.state;
    const { readOnly, handleDownloadFile } = this.props;
    return (
      <Fragment>
        <div key="docs" className="addfilesinput form-group">
          <label>Documents</label>
          <div className="addfilesinput-thumbnail-wrapper">
            {!readOnly && (
              <Fragment>
                <label key="label-docs">
                  <div
                    className={`add-thumbnail ${
                      this.state.isFocused ? 'add-thumbnail--focused' : ''
                    }`}
                  >
                    <i className="fas fa-plus-circle fa-3x" />
                  </div>
                  <input
                    key="input-docs"
                    type="file"
                    name="docs"
                    className="inputfile-docs"
                    onChange={this.handleInputFileChange}
                    onFocus={this.handleOnFocus}
                    onBlur={this.handleOnBlur}
                  />
                </label>
              </Fragment>
            )}
            <div className="addfilesinput-thumbnail-container">
              {docs.map(doc => {
                return (
                  <div
                    key={doc._id}
                    className="addfilesinput-thumbnail-content"
                  >
                    {!readOnly && (
                      <button
                        id={doc._id}
                        type="button"
                        className="delete-thumbnail"
                        onClick={this.handleRemoveThumbnail}
                      >
                        X
                      </button>
                    )}
                    {viewer[doc.name] && viewer[doc.name].corrupted ? (
                      <small className="error-message">
                        {viewer[doc.name].message}
                      </small>
                    ) : (
                      <Fragment>
                        <div className="text-center">
                          {doc.extension === 'pdf' && (
                            <canvas
                              data-b64={doc.value}
                              onClick={this.handleViewer}
                              id={`canvas-${doc._id}`}
                            />
                          )}
                          {this.utils.isImage(doc.extension) && (
                            <a
                              href={doc.value}
                              download={`${doc.originalName}.${doc.extension}`}
                            >
                              <img
                                className="full-width"
                                src={doc.value}
                                alt="Doc Thumbnail"
                                onClick={handleDownloadFile}
                                onKeyDown={handleDownloadFile}
                              />
                            </a>
                          )}
                          {
                            <a
                              href={doc.value}
                              download={`${doc.originalName}.${doc.extension}`}
                            >
                              {this.utils.extension(
                                doc,
                                {
                                  image: true,
                                  pdf: true,
                                },
                                handleDownloadFile,
                              )}
                            </a>
                          }
                        </div>
                        {doc.name && <FileInfo doc={doc} />}
                      </Fragment>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {error && <small className="error-message">{error}</small>}
        </div>
        {viewer.display && (
          <ViewerPdf close={this.handleCloseViewer} doc={viewer.doc} />
        )}
      </Fragment>
    );
  }
}

const createContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const FileUploaderContainer = createContainer(FileUploader);

export default FileUploaderContainer;
