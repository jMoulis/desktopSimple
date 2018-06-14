/*
 * Npm import
 */
import { connect } from 'react-redux';


/*
 * Local import
 */
import CompanyProfile from '../../../components/Profile/Company';
import { editUserAction } from '../../../store/reducers/profileReducer';
/*
 * Code
 */
// State
const mapStateToProps = ({ profileReducer }) => ({
  userActive: profileReducer.userActive,
});

// Actions
const mapDispatchToProps = dispatch => ({
  editUserAction: (id, formData) => {
    dispatch(editUserAction(id, formData));
  },
});


/*
 * Export default
 */
const createContainer = connect(mapStateToProps, mapDispatchToProps);
const CompanyProfileContainer = createContainer(CompanyProfile);
export default CompanyProfileContainer;
