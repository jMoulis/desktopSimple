import React from 'react';
import PropTypes from 'prop-types';
import './index.css';
import Loader from '../../../Modules/Loader';

class DetailUser extends React.Component {
  static propTypes = {
    userId: PropTypes.string.isRequired,
    fetchUserAction: PropTypes.func.isRequired,
    userActive: PropTypes.object.isRequired,
  }
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
        <img className="user-picture" src={user.picture} alt="User" />
        <h1>{user.fullName}</h1>
        <ul className="user-detail-list">
          <li>{user.description}</li>
          <li>{user.email}</li>
          <li>{user.school}</li>
          <li>{user.diploma}</li>
          <li>{user.location}</li>
          <li>
            <ul className="tag-list">
              {user.tags.map((tag, index) => (
                <li key={index} className="tag-item">{tag}</li>
              ))}
            </ul>
          </li>
          <li><a target="_blank" href={`https://${user.linkedIn}`}>{user.linkedIn}</a></li>
          <li><a target="_blank" href={`https://${user.gitHub}`}>{user.gitHub}</a></li>
        </ul>
      </div>
    );
  }
}

export default DetailUser;
