import React from 'react';
import PropTypes from 'prop-types';
import './index.css';
import Loader from '../../../Modules/Loader';
import TagList from '../../../Modules/Tag/tagList';
import FriendRequestButtonsContainer from '../../../Modules/FriendRequestButtons';

class DetailUser extends React.Component {
  static propTypes = {
    userId: PropTypes.string.isRequired,
    fetchUserAction: PropTypes.func.isRequired,
    userActive: PropTypes.object.isRequired,
  };
  componentDidMount() {
    const { fetchUserAction, userId } = this.props;
    fetchUserAction(userId);
  }
  render() {
    const { userActive } = this.props;
    const { user, loading } = userActive;
    if (loading) {
      return <Loader />;
    }
    return (
      <div className="user">
        <img
          className="user-picture"
          src={`${user.picture || '/img/avatar.png'}`}
          alt="User"
        />
        <h1>{user.fullName}</h1>
        <ul className="user-detail-list">
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
          <FriendRequestButtonsContainer user={user} />
        </ul>
      </div>
    );
  }
}

export default DetailUser;
