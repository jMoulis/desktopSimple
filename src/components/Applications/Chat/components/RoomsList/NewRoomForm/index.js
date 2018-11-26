import React, { Component } from 'react';
import PropTypes from 'prop-types';
import UsersLoaderContainer from '../../../../../../Modules/UserLoader';
import UserIconContainer from '../../../../../../Modules/UserIcon';
import Button from '../../../../../Form/button';

class NewRoomForm extends Component {
  static propTypes = {
    loggedUser: PropTypes.object.isRequired,
    closeFromParent: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
  };

  static defaultProps = {
    closeFromParent: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      form: {
        name: '',
        isPrivate: true,
        isTeamRoom: false,
        users: [
          {
            fullName: props.loggedUser.fullName,
            picture: props.loggedUser.picture,
            _id: props.loggedUser._id,
          },
        ],
      },
      roomReceivedRequest: [],
    };
  }
  handleInputChange = evt => {
    const { name, value } = evt.target;
    this.setState(prevState => ({
      form: {
        ...prevState.form,
        [name]: value,
      },
    }));
  };
  handleSubmit = evt => {
    const { closeFromParent, onSubmit } = this.props;
    evt.preventDefault();
    onSubmit(this.state, closeFromParent);
  };
  handleUserSelect = ({ user }) => {
    this.setState(prevState => ({
      form: {
        ...prevState.form,
      },
      roomReceivedRequest: [...prevState.roomReceivedRequest, user],
    }));
  };
  render() {
    const { form, roomReceivedRequest } = this.state;
    const { closeFromParent } = this.props;
    return (
      <div className="d-flex flex-justify-between">
        <div
          style={{
            padding: '1rem',
          }}
        >
          <form className="d-flex flex-column">
            <label>Room Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={this.handleInputChange}
            />
          </form>
          <h2
            style={{
              paddingTop: '1rem',
              paddingBottom: '1rem',
            }}
          >
            Users Selected
          </h2>
          {roomReceivedRequest.map(user => (
            <UserIconContainer key={user._id} user={{ user }} name />
          ))}
          <div className="d-flex flex-justify-flex-end">
            <Button
              style={{
                margin: 0,
                padding: '0 .3rem',
              }}
              onClick={this.handleSubmit}
              label="Submit"
              disabled={
                !roomReceivedRequest || roomReceivedRequest.length === 0
              }
            />
          </div>
        </div>
        <UsersLoaderContainer
          closeFromParent={closeFromParent}
          select={this.handleUserSelect}
          filter={{}}
        />
      </div>
    );
  }
}

export default NewRoomForm;
