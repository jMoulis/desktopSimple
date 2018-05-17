/*
 * Npm import
 */
import { connect } from 'react-redux';


/*
 * Local import
 */
import MyTeams from '../../components/MyTeams';

/*
 * Code
 */
// State
const mapStateToProps = ({ projectReducer }) => ({
  projectListProcess: projectReducer.projectListProcess,
});

// Actions
const mapDispatchToProps = dispatch => ({
});


/*
 * Export default
 */
const createContainer = connect(mapStateToProps, mapDispatchToProps);
const MyTeamsContainer = createContainer(MyTeams);
export default MyTeamsContainer;
