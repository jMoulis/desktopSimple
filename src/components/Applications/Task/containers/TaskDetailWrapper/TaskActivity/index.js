import { connect } from 'react-redux';
import TaskActivity from '../../../components/TaskDetailWrapper/TaskActivity';
import {
  deleteCommentTaskAction,
  editCommentTaskAction,
} from '../../../../../../store/reducers/taskReducer';

const mapsDispatchToProps = dispatch => ({
  deleteCommentTaskAction: (taskId, commentId) => {
    dispatch(deleteCommentTaskAction(taskId, commentId));
  },
  editCommentTaskAction: (taskId, commentId) => {
    dispatch(editCommentTaskAction(taskId, commentId));
  },
});

const createContainer = connect(
  null,
  mapsDispatchToProps,
);

export default createContainer(TaskActivity);
