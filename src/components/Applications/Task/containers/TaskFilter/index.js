import { connect } from 'react-redux';

import TaskFilter from '../../components/TaskFilter';

const mapStateToProps = ({ authReducer }) => ({
  loggedUser: authReducer.loginProcess.loggedUser,
});

const mapDispatchToProps = dispatch => ({});

const createContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const TaskFilterContainer = createContainer(TaskFilter);
export default TaskFilterContainer;
