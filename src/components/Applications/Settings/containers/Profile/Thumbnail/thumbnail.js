/*
 * Npm import
 */
import { connect } from 'react-redux';


/*
 * Local import
 */
import Thumbnail from '../../../components/Profile/Thumbnail/thumbnail';

/*
 * Code
 */
// State
const mapStateToProps = ({ authReducer }) => ({
  picture: authReducer.loginProcess.loggedUser.picture,
});

// Actions
const mapDispatchToProps = dispatch => ({});


/*
 * Export default
 */
const createContainer = connect(mapStateToProps, mapDispatchToProps);
const ThumbnailContainer = createContainer(Thumbnail);
export default ThumbnailContainer;
