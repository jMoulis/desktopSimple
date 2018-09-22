import { connect } from 'react-redux';

import TaskDetailWrapper from '../../components/TaskDetailWrapper';

const mapStateToProps = ({ taskReducer }) => ({
  activeTaskProcess: taskReducer.activeTaskProcess,
});

const createContainer = connect(
  mapStateToProps,
  null,
);
const TaskDetailWrapperContainer = createContainer(TaskDetailWrapper);
export default TaskDetailWrapperContainer;
