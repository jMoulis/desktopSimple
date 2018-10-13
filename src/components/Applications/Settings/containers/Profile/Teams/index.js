import { connect } from 'react-redux';

import Teams from '../../../components/Profile/Teams';
import { fetchTeamsAction } from '../../../../../../store/reducers/teamReducer';

const mapStateToProps = ({ mainTeamReducer }) => ({
  teamListProcess: mainTeamReducer.teamListProcess,
});

const mapDispatchToProps = dispatch => ({
  fetchTeamsAction: id => {
    dispatch(fetchTeamsAction(id));
  },
});

const createContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const TeamsContainer = createContainer(Teams);

export default TeamsContainer;
