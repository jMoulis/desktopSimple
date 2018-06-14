/*
 * Npm import
 */
import { connect } from 'react-redux';


/*
 * Local import
 */
import Project from '../components/index';
import { fetchProjectsAction } from '../store/reducers/projectReducer';
import { fetchTeamsAction } from '../store/reducers/teamReducer';
/*
 * Code
 */
const getLoggedUser = () => {
  if (localStorage.getItem('user')) {
    const loggedUser = JSON.parse(localStorage.getItem('user'));
    return loggedUser;
  }
  return null;
};
// State
const mapStateToProps =  state => ({
  loggedUserId: getLoggedUser(),
});

// Actions
const mapDispatchToProps = dispatch => ({
  fetchProjectsAction: (values) => {
    dispatch(fetchProjectsAction(values));
  },
  fetchTeamsAction: () => {
    dispatch(fetchTeamsAction());
  },
});


/*
 * Export default
 */
const createContainer = connect(mapStateToProps, mapDispatchToProps);
const ProjectContainer = createContainer(Project);
export default ProjectContainer;
