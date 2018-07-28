import { connect } from 'react-redux';

import TaskList from '../../components/TaskList';

const mapStateToProps = ({ authReducer }) => ({
  loggedUser: authReducer.loginProcess.loggedUser,
});

const mapDispatchToProps = dispatch => ({});

const createContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const TaskListContainer = createContainer(TaskList);
export default TaskListContainer;
