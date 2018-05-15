/*
 * Npm import
 */
import { connect } from 'react-redux';


/*
 * Local import
 */
import LeftPanel from '../../components/MyProject/leftPanel';

/*
 * Code
 */
// State
const mapStateToProps = ({ teamReducer }) => ({
  teamListProcess: teamReducer.teamListProcess,
});

// Actions
const mapDispatchToProps = dispatch => ({
});


/*
 * Export default
 */
const createContainer = connect(mapStateToProps, mapDispatchToProps);
const LeftPanelContainer = createContainer(LeftPanel);
export default LeftPanelContainer;
