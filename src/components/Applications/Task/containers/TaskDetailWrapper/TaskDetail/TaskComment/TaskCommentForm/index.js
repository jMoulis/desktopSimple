import { connect } from 'react-redux';

import { editTaskAction } from '../../../../../../../../store/reducers/taskReducer';
import TaskCommentForm from '../../../../../components/TaskDetailWrapper/TaskDetail/TaskComment/TaskCommentForm';

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
const TaskCommentFormContainer = createContainer(TaskCommentForm);
export default TaskCommentFormContainer;
