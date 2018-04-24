/*
 * Npm import
 */
import { connect } from 'react-redux';


/*
 * Local import
 */
import Frame from '../../../components/Dashboard/Frame/frame';
import { setActiveAppAction } from '../../../store/reducers/frameReducer';

/*
 * Code
 */
// State
const mapStateToProps = ({ frameReducer }) => ({
  activeApp: frameReducer.activeApp,
  applications: frameReducer.applications,
});

// Actions
const mapDispatchToProps = dispatch => ({
  setActiveAppAction: (appId) => {
    dispatch(setActiveAppAction(appId));
  },
});


/*
 * Export default
 */
const createContainer = connect(mapStateToProps, mapDispatchToProps);
const FrameContainer = createContainer(Frame);
export default FrameContainer;
