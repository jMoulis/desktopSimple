/*
 * Npm import
 */
import { connect } from 'react-redux';


/*
 * Local import
 */
import Helper from '../../../components/Dashboard/Helper';

/*
 * Code
 */
// State
const mapStateToProps = state => ({});

// Actions
const mapDispatchToProps = dispatch => ({});


/*
 * Export default
 */
const createContainer = connect(mapStateToProps, mapDispatchToProps);
const HelperContainer = createContainer(Helper);
export default HelperContainer;
