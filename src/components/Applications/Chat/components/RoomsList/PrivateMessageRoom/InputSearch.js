import React from 'react';
import PropTypes from 'prop-types';
import SelectUserPanel from '../SelectUserPanel';

class InputSearch extends React.Component {
  static propTypes = {
    fetchUsersFromPMAction: PropTypes.func.isRequired,
    selectUser: PropTypes.func.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      users: [],
      showSelectPanel: false,
    };
    this.selectUserListRef = React.createRef();
  }

  static getDerivedStateFromProps(props, state) {
    if (state.search.length === 0) {
      return {
        ...state,
        users: [],
      };
    }
    return {
      ...state,
      users: [...props.usersPMProcess.users],
    };
  }
  handleSearchSubmit = () => {
    const { fetchUsersFromPMAction } = this.props;
    const { search } = this.state;
    fetchUsersFromPMAction(search);
  };

  handleSearch = evt => {
    const { value } = evt.target;
    this.setState(
      () => ({
        search: value,
        showSelectPanel: true,
      }),
      () => {
        this.handleSearchSubmit();
      },
    );
  };

  hideListAction = () => {
    this.setState(() => ({
      showSelectPanel: false,
    }));
  };

  render() {
    const { search, users, showSelectPanel } = this.state;
    const { selectUser, openModalAction } = this.props;
    return (
      <div className="private-message-room-search-form">
        <input
          value={search}
          onChange={this.handleSearch}
          placeholder="Search private message"
        />
        <button onClick={openModalAction}>
          <i className="fas fa-edit" />
        </button>
        {showSelectPanel && (
          <SelectUserPanel
            users={users}
            callback={user => {
              this.hideListAction();
              selectUser(user);
            }}
            hideListAction={this.hideListAction}
          />
        )}
      </div>
    );
  }
}

export default InputSearch;
