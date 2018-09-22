import { connect } from 'react-redux';

import Teams from '../../../components/Profile/Teams';

const mapStateToProps = ({ authReducer }) => ({
  loggedUser: authReducer.loginProcess.loggedUser,
});

const createContainer = connect(
  mapStateToProps,
  null,
);

const TeamsContainer = createContainer(Teams);

export default TeamsContainer;
