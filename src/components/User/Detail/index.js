import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import './index.css';
import Loader from '../../../Modules/Loader';
import TagList from '../../../Modules/Tag/tagList';
import FriendRequestButtonsContainer from '../../../Modules/FriendRequestButtons';
import Button from '../../Form/button';
import ChatBoxForm from '../../Dashboard/Chat/ChatBox/ChatBoxForm';

const ROOT_URL = process.env.REACT_APP_API;
class DetailUser extends React.Component {
  static propTypes = {
    userId: PropTypes.string.isRequired,
    fetchUserAction: PropTypes.func.isRequired,
    userActive: PropTypes.object.isRequired,
    socket: PropTypes.object.isRequired,
    loggedUser: PropTypes.object.isRequired,
  };
  state = {
    showMessageForm: false,
  };

  componentDidMount() {
    const { fetchUserAction, userId } = this.props;
    fetchUserAction(userId);
  }

  _handleShowMessageForm = () => {
    this.setState(prevState => ({
      showMessageForm: !prevState.showMessageForm,
    }));
  };

  render() {
    const { userActive, socket, loggedUser } = this.props;
    const { user, loading } = userActive;
    const { showMessageForm } = this.state;
    if (loading) {
      return <Loader />;
    }
    return (
      <div className="user">
        <img
          className="user-picture"
          src={`${ROOT_URL}${user.picture || '/img/avatar.png'}`}
          alt="User"
        />
        <h1>{user.fullName}</h1>
        <ul className="user-detail-list">
          <li>
            <span>Available: </span>
            <span>
              {user.available === 'false' ? 'Non available' : 'Available'}
            </span>
          </li>
          <li>
            <span>Description: </span>
            <p>{user.description || ''}</p>
          </li>
          <li>
            <span>Email: </span>
            <a href={`mailto:${user.email || ''}`}>{user.email}</a>
          </li>
          <li>
            <span>School: </span>
            {user.school || ''}
          </li>
          <li>
            <span>Diploma: </span>
            {user.diploma || ''}
          </li>
          <li>
            <span>Location: </span>
            {user.location || ''}
          </li>
          <li>
            <span>Tags:</span>
            <TagList tags={user.tags} />
          </li>
          <li>
            <span>LinkedIn: </span>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://${user.linkedIn}` || ''}
            >
              {user.linkedIn}
            </a>
          </li>
          <li>
            <span>GitHub: </span>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://${user.gitHub}` || ''}
            >
              {user.gitHub}
            </a>
          </li>
          {user.company && (
            <Fragment>
              <li>
                <span>Company Name: </span>
                {user.company.companyName}
              </li>
              <li>
                <span>Description: </span>
                {user.company.companyName}
              </li>
              <li>
                <span>Tags: </span>
                <TagList tags={user.company.tags} />
              </li>
            </Fragment>
          )}
          {loggedUser.user._id !== user._id && (
            <div>
              <FriendRequestButtonsContainer user={user} />
              <Button
                category="primary"
                onClick={this._handleShowMessageForm}
                data-type="draft"
                label="Send Message"
                loading={false}
                style={{
                  margin: 0,
                }}
              />
            </div>
          )}
        </ul>
        {showMessageForm && (
          <ChatBoxForm
            socket={socket}
            loggedUser={loggedUser.user}
            receiver={user}
            callback={this._handleShowMessageForm}
          />
        )}
      </div>
    );
  }
}

export default DetailUser;
