import { connect } from 'react-redux';

import TaskFilter from '../../components/TaskFilter';
import { fetchTasksAction } from '../../../../../store/reducers/taskReducer';

const mapStateToProps = ({ authReducer }) => ({
  loggedUser: authReducer.loginProcess.loggedUser,
});

const mapDispatchToProps = dispatch => ({
  fetchTasksAction: filter => {
    dispatch(fetchTasksAction(filter));
  },
});

const createContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const TaskFilterContainer = createContainer(TaskFilter);
export default TaskFilterContainer;
