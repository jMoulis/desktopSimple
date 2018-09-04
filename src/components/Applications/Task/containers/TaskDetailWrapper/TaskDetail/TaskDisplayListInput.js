import { connect } from 'react-redux';

import TaskDisplayListInput from '../../../components/TaskDetailWrapper/TaskDetail/TaskDisplayListInput';
import { editTaskAction } from '../../../../../../store/reducers/taskReducer';

const mapStateToProps = ({ taskReducer }) => ({
  activeTaskProcess: taskReducer.activeTaskProcess,
});

const mapDispatchProps = dispatch => ({
  editTaskAction: values => {
    dispatch(editTaskAction(values));
  },
});

const createContainer = connect(
  mapStateToProps,
  mapDispatchProps,
);
const TaskDisplayListInputContainer = createContainer(TaskDisplayListInput);
export default TaskDisplayListInputContainer;
