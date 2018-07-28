/*
 * Npm import
 */
import { connect } from 'react-redux';

/*
 * Local import
 */
import Task from '../components';

/*
 * Code
 */
// State
const mapStateToProps = state => ({});

// Actions
const mapDispatchToProps = dispatch => ({});

/*
 * Export default
 */
const createContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const TaskContainer = createContainer(Task);
export default TaskContainer;
