/*
 * Npm import
 */
import { connect } from 'react-redux';


/*
 * Local import
 */
import FooterThumbnail from '../../../components/Dashboard/Footer/footerThumbnail';

/*
 * Code
 */
// State
const mapStateToProps = ({ authReducer }) => {
  if (localStorage.getItem('user')) {
    const user = JSON.parse(localStorage.getItem('user'));
    return {
      user,
    };
  }
  return {
    user: authReducer.loginProcess.loggedUser,
  };
};

// Actions
const mapDispatchToProps = dispatch => ({});


/*
 * Export default
 */
const createContainer = connect(mapStateToProps, mapDispatchToProps);
const FooterThumbnailContainer = createContainer(FooterThumbnail);
export default FooterThumbnailContainer;
