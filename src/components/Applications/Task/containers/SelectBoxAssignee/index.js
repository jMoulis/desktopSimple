import { connect } from 'react-redux';
import SelectBoxAssignee from '../../components/SelectBoxAssignee/SelectBoxAssignee';

const mapStateToProps = ({ mainTeamReducer }) => ({
  team: mainTeamReducer.activeTeamProcess.team,
});

const createContainer = connect(
  mapStateToProps,
  null,
);

const SelectBoxAssigneeContainer = createContainer(SelectBoxAssignee);

export default SelectBoxAssigneeContainer;
