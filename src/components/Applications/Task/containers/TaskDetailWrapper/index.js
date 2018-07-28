/*
 * Npm import
 */
import { connect } from 'react-redux';

/*
 * Local import
 */
import TaskDetailWrapper from '../../components/TaskDetailWrapper';

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
const TaskDetailWrapperContainer = createContainer(TaskDetailWrapper);
export default TaskDetailWrapperContainer;
