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
const mapStateToProps = ({ userReducer }) => ({
  user: userReducer.userActive.user,
});

// Actions
const mapDispatchToProps = dispatch => ({});


/*
 * Export default
 */
const createContainer = connect(mapStateToProps, mapDispatchToProps);
const FooterThumbnailContainer = createContainer(FooterThumbnail);
export default FooterThumbnailContainer;
