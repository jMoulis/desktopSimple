import { connect } from 'react-redux';
import InputSearch from '../../../components/RoomsList/PrivateMessageRoom/InputSearch';
import { fetchUsersFromPM } from '../../../../../../store/reducers/chatReducer';

const mapStateToProps = ({ chatReducer }) => ({
  usersPMProcess: chatReducer.usersPMProcess,
});

const mapDispatchToProps = dispatch => ({
  fetchUsersFromPMAction: search => {
    dispatch(fetchUsersFromPM(search));
  },
});

const createContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const InputSearchContainer = createContainer(InputSearch);

export default InputSearchContainer;
