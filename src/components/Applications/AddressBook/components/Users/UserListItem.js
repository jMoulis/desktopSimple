import React from 'react';
import PropTypes from 'prop-types';
import UserIconContainer from '../../../../../Modules/UserIcon';
import './userListItem.css';
import TagList from '../../../../../Modules/Tag/tagList';
import Button from '../../../../../components/Form/button';
import CompanyHeader from '../../../../../Modules/CompanyHeader';

const isAlreadyRequest = (receivedRequest, key) => {
  let response;
  receivedRequest.map(request => {
    if (request === key) {
      response = true;
    } else {
      response = false;
    }
  });
  return response;
};
const UserListItem = ({
  user,
  sendFriendRequest,
  loggedUser,
  requestStatus,
}) => {
  return (
    <li className="user-item">
      <div>
        {user.company ? (
          <CompanyHeader
            user={user}
            classNameContainer="company-header-reset"
          />
        ) : (
          <div className="user-item-header">
            <UserIconContainer user={{ user }} classCss="middle" />
            <div className="d-flex flex-column">
              <span>{user.fullName}</span>
            </div>
          </div>
        )}
        <p>{user.school && `School: ${user.school}`}</p>
        <p>{user.location && `Location: ${user.location}`}</p>
        <div className="user-item-content">
          <TagList tags={user.company ? user.company.tags : user.tags} />
        </div>
      </div>
      <div className="user-item-footer">
        <Button
          category="primary"
          onClick={() => {
            sendFriendRequest(user._id);
          }}
          data-type="draft"
          label={
            isAlreadyRequest(user.receivedRequest, loggedUser._id) ||
            user._id === requestStatus.userId
              ? 'Request sent'
              : 'Friend request'
          }
          loading={false}
          style={{
            margin: 0,
            marginRight: '0.5rem',
            minWidth: '136px',
          }}
          disabled={
            isAlreadyRequest(user.receivedRequest, loggedUser._id) ||
            user._id === requestStatus.userId ||
            user._id === loggedUser._id
          }
        />
        <Button
          category="primary"
          onClick={this.handleSubmit}
          data-type="draft"
          label="Send Message"
          loading={false}
          style={{
            margin: 0,
          }}
        />
      </div>
    </li>
  );
};

UserListItem.propTypes = {
  user: PropTypes.object.isRequired,
  loggedUser: PropTypes.object.isRequired,
  requestStatus: PropTypes.object.isRequired,
  sendFriendRequest: PropTypes.func.isRequired,
};

export default UserListItem;
