import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DocumentItem from './DocumentItem';
import './index.css';
import InputFile from '../../components/Form/inputFile';
import DropZone from '../DropZone';
import { fetchFileAction } from '../../store/reducers/fileReducer';
import Utils from '../../Utils/utils';

const mapStateToProps = ({ fileReducer, authReducer }) => ({
  fileProcess: fileReducer.fileProcess,
  loggedUser: authReducer.loginProcess.loggedUser,
});

const mapDispatchToProps = dispatch => ({
  fetchFile: file => {
    dispatch(fetchFileAction(file));
  },
});

class DisplayDocument extends React.Component {
  static propTypes = {
    documents: PropTypes.array,
    keyToUpdate: PropTypes.string.isRequired,
    fetchFile: PropTypes.func.isRequired,
    fileProcess: PropTypes.object.isRequired,
    update: PropTypes.func.isRequired,
  };
  static defaultProps = {
    documents: [],
  };
  constructor(props) {
    super(props);
    this.state = {
      dragState: '',
      inputFile: '',
    };
  }

  componentDidUpdate(prevProps) {
    const { fileProcess } = this.props;
    if (prevProps.fileProcess.file.name !== fileProcess.file.name) {
      const utils = new Utils();
      utils.simulateClickEvent(fileProcess.file);
    }
  }

  handleDownloadFile = file => {
    const { fetchFile } = this.props;
    fetchFile(file);
    this.setState(() => ({
      fileName: file.name,
    }));
  };

  handleInputFileChange = evt => {
    const { update, keyToUpdate } = this.props;
    const file = evt.target.files[0];
    if (file) {
      update({
        [keyToUpdate]: {
          value: file,
          changed: true,
        },
      });
    }
  };

  handleDrag = (evt, type) => {
    evt.stopPropagation();
    evt.preventDefault();
    this.setState(() => ({
      dragState: type,
    }));
  };

  handleDrop = evt => {
    evt.stopPropagation();
    evt.preventDefault();
    const { update, keyToUpdate } = this.props;
    const { dataTransfer } = evt;
    const file = dataTransfer.files[0];
    if (file) {
      update({
        [keyToUpdate]: {
          value: file,
          changed: true,
        },
      });
      this.setState(() => ({
        dragState: '',
      }));
    }
  };

  render() {
    const { documents, onDelete, loggedUser } = this.props;
    const { dragState, inputFile } = this.state;
    return (
      <Fragment>
        <label>Documents:</label>
        <div className="d-flex flex-column">
          <DropZone
            dragAction={this.handleDrag}
            dropAction={this.handleDrop}
            dragState={dragState}
          >
            <p>Drop your file</p>
          </DropZone>
          <InputFile
            ref={this.inputFileRef}
            config={{
              styleContainer: {
                padding: 0,
              },
              field: {
                label: 'Add File',
                name: 'uploadFile',
                value: inputFile,
              },
              onChange: this.handleInputFileChange,
            }}
          />
        </div>
        <ul className="d-flex document">
          {documents && documents.length > 0 ? (
            documents.map(document => {
              if (document) {
                return (
                  <li key={document.name}>
                    <DocumentItem
                      document={document}
                      onClick={this.handleDownloadFile}
                      readOnly={
                        document.author &&
                        loggedUser._id !== document.author._id
                      }
                      onDelete={onDelete}
                    />
                  </li>
                );
              }
            })
          ) : (
            <div className="d-flex flex-column">
              <span>No Documents available</span>
            </div>
          )}
        </ul>
      </Fragment>
    );
  }
}
const createContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const DisplayDocumentContainer = createContainer(DisplayDocument);

export default DisplayDocumentContainer;
