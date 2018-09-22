import { connect } from 'react-redux';

import TaskCommentEditForm from '../../../../../components/TaskDetailWrapper/TaskDetail/TaskComment/TaskCommentEditForm';
import {
  deleteCommentTaskAction,
  editCommentTaskAction,
} from '../../../../../../../../store/reducers/taskReducer';

const mapDispatchProps = dispatch => ({
  deleteCommentTaskAction: (taskId, commentId) => {
    dispatch(deleteCommentTaskAction(taskId, commentId));
  },
  editCommentTaskAction: (taskId, commentId, message) => {
    dispatch(editCommentTaskAction(taskId, commentId, message));
  },
});

const createContainer = connect(
  null,
  mapDispatchProps,
);
const TaskCommentEditFormContainer = createContainer(TaskCommentEditForm);
export default TaskCommentEditFormContainer;
