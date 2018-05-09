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
const mapStateToProps = ({ authReducer }) => {
  if (localStorage.getItem('user')) {
    const user = JSON.parse(localStorage.getItem('user'));
    return {
      picture: user.picture,
    };
  }
  return {
    picture: authReducer.loginProcess.loggedUser.picture,
  };
};

// Actions
const mapDispatchToProps = dispatch => ({});


/*
 * Export default
 */
const createContainer = connect(mapStateToProps, mapDispatchToProps);
const ThumbnailContainer = createContainer(Thumbnail);
export default ThumbnailContainer;
