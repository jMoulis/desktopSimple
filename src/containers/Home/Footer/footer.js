/*
 * Npm import
 */
import { connect } from 'react-redux';


/*
 * Local import
 */
import Footer from '../../../components/Home/Footer/footer';

/*
 * Code
 */
// State
const mapStateToProps = ({ frameReducer }) => ({});

// Actions
const mapDispatchToProps = dispatch => ({});


/*
 * Export default
 */
const createContainer = connect(mapStateToProps, mapDispatchToProps);
const FooterContainer = createContainer(Footer);
export default FooterContainer;
