import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import UserIconContainer from '../../../../../../Modules/UserIcon';
import Button from '../../../../../Form/button';
import Utils from '../../../../../../Utils/utils';
import { fetchUsersAction } from '../../../../../../store/reducers/userReducer';
import './addUserForm.css';

const ROOT_URL = process.env.REACT_APP_API;

const mapStateToProps = ({ userReducer }) => ({
  userList: userReducer.userList,
});

const mapDispatchToProps = dispatch => ({
  fetchUsers: filter => {
    dispatch(fetchUsersAction(filter));
  },
});

class AddUserForm extends Component {
  static propTypes = {
    closeFromParent: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
  };

  static defaultProps = {
    closeFromParent: null,
  };

  constructor(props) {
    super(props);
    this.utils = new Utils();
    this.state = {
      users: [],
      search: '',
      roomReceivedRequest: [],
      reload: true,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (state.reload) {
      return {
        ...state,
        users: props.userList.users,
      };
    }
    return {
      ...state,
    };
  }

  componentDidMount() {
    const { fetchUsers } = this.props;
    fetchUsers({});
  }

  handleSubmit = evt => {
    const { closeFromParent, onSubmit } = this.props;
    evt.preventDefault();
    onSubmit(this.state, closeFromParent);
  };

  handleUserSelect = userToAdd => {
    const { fetchUsers } = this.props;
    if (
      this.state.roomReceivedRequest.some(user => user._id === userToAdd._id)
    ) {
      return false;
    }
    fetchUsers({});
    return this.setState(prevState => ({
      roomReceivedRequest: [...prevState.roomReceivedRequest, userToAdd],
      search: '',
      reload: true,
    }));
  };

  handleSearchSubmit = async () => {
    try {
      const { data } = await axios({
        method: 'get',
        url: `${ROOT_URL}/api/users/friends/?search=${this.state.search}`,
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });

      if (data.users.length === 0) {
        return this.setState(() => ({
          users: [],
          reload: false,
        }));
      }

      return this.setState(() => ({
        users: data.users,
        reload: false,
      }));
    } catch (error) {
      this.setState(() => ({
        users: [],
      }));
    }
  };

  handleSearchUser = ({ target }) => {
    this.setState(
      () => ({
        search: target.value,
      }),
      this.handleSearchSubmit,
    );
  };

  handleRemoveUser = userToRemove => {
    const { roomReceivedRequest } = this.state;
    this.setState(() => ({
      roomReceivedRequest: roomReceivedRequest.filter(
        user => user._id !== userToRemove._id,
      ),
    }));
  };

  render() {
    const { roomReceivedRequest, users, search } = this.state;
    return (
      <div className="add-user">
        <h2>Select friends</h2>
        <div className="add-user-header">
          <div className="container-input">
            {roomReceivedRequest.map(user => (
              <div
                className="users-tag"
                key={user._id}
                onClick={() => this.handleRemoveUser(user)}
                onKeyDown={() => this.handleRemoveUser(user)}
              >
                <span>{`${user.fullName} `}</span>
                <button>X</button>
              </div>
            ))}
            <input
              onChange={this.handleSearchUser}
              value={search}
              placeholder="Enter name of a user"
            />
          </div>
          <Button
            type="submit"
            label="Add"
            disabled={roomReceivedRequest.length === 0}
            onClick={this.handleSubmit}
          />
        </div>
        {users.map(user => (
          <div key={user._id} className="users-wrapper">
            <UserIconContainer
              user={{ user }}
              name
              callback={this.handleUserSelect}
            />
          </div>
        ))}
      </div>
    );
  }
}

const createContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const AddUserFormContainer = createContainer(AddUserForm);

export default AddUserFormContainer;
