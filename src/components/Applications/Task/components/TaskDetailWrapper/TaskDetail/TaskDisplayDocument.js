import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import UserIconContainer from '../../../../../../Modules/UserIcon';
import Utils from '../../../../../../Utils/utils';

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
      <ul className="d-flex">
        {documents &&
          documents.map(document => (
            <li key={document.name}>
              <div className="d-flex flex-column">
                <button
                  type="button"
                  className="btn-toolbar"
                  onClick={this.handleDownloadFile}
                  data-url={document.url}
                  data-filename={document.originalName || document.name}
                >
                  <i className="fas fa-file-pdf fa-3x" />
                </button>
                <small className="small">
                  {document.originalName || document.name}
                </small>
                <small className="small">
                  Uploaded the:{' '}
                  {moment(document.createdAt).format('DD/MM/YYYY')}
                </small>
                <small className="small">Uploaded by:</small>
                <UserIconContainer user={{ user: document.author }} name />
              </div>
            </li>
          ))}
      </ul>
    );
  }
}

export default TaskDisplayDocument;
