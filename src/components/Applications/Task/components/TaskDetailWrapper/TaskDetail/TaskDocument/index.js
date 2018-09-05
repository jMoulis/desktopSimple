import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Utils from '../../../../../../../Utils/utils';
import TaskDocumentItem from './taskDocumentItem';
import './index.css';
import InputFile from '../../../../../../Form/inputFile';

class TaskDisplayDocument extends React.Component {
  static propTypes = {
    fetchFileAction: PropTypes.func.isRequired,
    fileProcess: PropTypes.object.isRequired,
    documents: PropTypes.array,
  };
  static defaultProps = {
    documents: [],
  };

  state = {
    fileName: '',
    dragState: '',
  };

  componentDidUpdate(prevProps) {
    const { fileProcess } = this.props;
    const { fileName } = this.state;
    if (prevProps.fileProcess.file.fileName !== fileProcess.file.fileName) {
      const utils = new Utils();
      utils.simulateClickEvent({
        href: fileProcess.file.fileContent,
        fileName,
      });
    }
  }

  handleDownloadFile = evt => {
    const { fetchFileAction } = this.props;
    const { url, filename } = evt.currentTarget.dataset;
    fetchFileAction(url);
    this.setState(() => ({
      fileName: filename,
    }));
  };

  handleInputFileChange = evt => {
    const { update } = this.props;
    const file = evt.target.files[0];
    if (file) {
      update({
        documents: {
          value: file,
          changed: true,
        },
      });
    }
  };

  handleDrag = (evt, type) => {
    console.log(type);
    evt.stopPropagation();
    evt.preventDefault();
    this.setState(() => ({
      dragState: type,
    }));
  };

  handleDrop = evt => {
    evt.stopPropagation();
    evt.preventDefault();
    const { update } = this.props;
    const { dataTransfer } = evt;
    const file = dataTransfer.files[0];
    if (file) {
      update({
        documents: {
          value: file,
          changed: true,
        },
      });
    }
  };
  render() {
    const { documents } = this.props;
    const { dragState } = this.state;
    return (
      <Fragment>
        <label>Documents:</label>
        <div className="d-flex flex-column">
          <div
            className={`drag-drop drag-drop-${dragState}`}
            onDragEnter={evt => {
              this.handleDrag(evt, 'enter');
            }}
            onDragOver={evt => {
              this.handleDrag(evt, 'over');
            }}
            onDragLeave={evt => {
              this.handleDrag(evt, 'leave');
            }}
            onDrop={this.handleDrop}
          >
            <i className="fas fa-file-upload" />
          </div>
          <InputFile
            config={{
              styleContainer: {
                padding: 0,
              },
              field: {
                label: 'Add File',
              },
              onChange: this.handleInputFileChange,
              typeFileAccepted: 'image/*',
            }}
          />
        </div>
        <ul className="d-flex document">
          {documents && documents.length > 0 ? (
            documents.map(document => (
              <li key={document.name}>
                <TaskDocumentItem
                  onClick={this.handleDownloadFile}
                  document={document}
                />
              </li>
            ))
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

export default TaskDisplayDocument;
