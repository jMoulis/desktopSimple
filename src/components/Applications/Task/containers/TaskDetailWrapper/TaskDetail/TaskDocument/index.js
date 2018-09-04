import { connect } from 'react-redux';

import TaskDisplayDocument from '../../../../components/TaskDetailWrapper/TaskDetail/TaskDocument';
import { fetchFileAction } from '../../../../../../../store/reducers/fileReducer';

const mapStateToProps = ({ fileReducer }) => ({
  fileProcess: fileReducer.fileProcess,
});

const mapDispatchToProps = dispatch => ({
  fetchFileAction: values => {
    dispatch(fetchFileAction(values));
  },
});

const createContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const TaskDisplayDocumentContainer = createContainer(TaskDisplayDocument);
export default TaskDisplayDocumentContainer;
