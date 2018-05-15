/*
 * Npm import
 */
import { connect } from 'react-redux';

/*
 * Local import
 */
import Subscribers from '../../components/Team/subscribers';
/*
 * Code
 */
// State
const mapStateToProps = ({ projectReducer }) => ({
  project: projectReducer.activeProjectProcess.project,
});

// Actions
const mapDispatchToProps = dispatch => ({});


/*
 * Export default
 */
const createContainer = connect(mapStateToProps, mapDispatchToProps);
const SubscribersContainer = createContainer(Subscribers);
export default SubscribersContainer;
