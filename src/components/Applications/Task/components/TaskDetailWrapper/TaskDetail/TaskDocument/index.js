import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Utils from '../../../../../../../Utils/utils';
import TaskDocumentItem from './taskDocumentItem';
import './index.css';

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

  render() {
    const { documents } = this.props;
    return (
      <Fragment>
        <label>Documents:</label>
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
              <input type="file" multiple placeholder="Select a file" />
            </div>
          )}
        </ul>
      </Fragment>
    );
  }
}

export default TaskDisplayDocument;
