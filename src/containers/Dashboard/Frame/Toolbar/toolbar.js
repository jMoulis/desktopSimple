/*
 * Npm import
 */
import { connect } from 'react-redux';


/*
 * Local import
 */
import Toolbar from '../../../../components/Dashboard/Frame/Toolbar/toolbar';
import { fullSizeAction, closeAppAction, reduceAppAction } from '../../../../store/reducers/frameReducer';

/*
 * Code
 */
// State
const mapStateToProps = state => ({});

// Actions
const mapDispatchToProps = dispatch => ({
  fullSizeAction: (appId) => {
    dispatch(fullSizeAction(appId));
  },
  closeAppAction: (appId) => {
    dispatch(closeAppAction(appId));
  },
  reduceAppAction: (appId) => {
    dispatch(reduceAppAction(appId));
  },
});


/*
 * Export default
 */
const createContainer = connect(mapStateToProps, mapDispatchToProps);
const ToolbarContainer = createContainer(Toolbar);
export default ToolbarContainer;
