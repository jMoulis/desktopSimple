/*
 * Npm import
 */
import { connect } from 'react-redux';


/*
 * Local import
 */
import InfoPanel from '../../../../components/DetailProject/InfoPanel';

/*
 * Code
 */
// State
const mapStateToProps = ({ projectReducer }) => ({
  activeProjectProcess: projectReducer.activeProjectProcess,
});

// Actions
const mapDispatchToProps = dispatch => ({
});


/*
 * Export default
 */
const createContainer = connect(mapStateToProps, mapDispatchToProps);
const InfoPanelContainer = createContainer(InfoPanel);
export default InfoPanelContainer;
