import React from 'react';
import PropTypes from 'prop-types';
import UserIconContainer from '../../../../../Modules/UserIcon';
import './userListItem.css';
import TagList from '../../../../../Modules/Tag/tagList';
import Button from '../../../../../components/Form/button';

const UserListItem = ({ user }) => (
  <li className="user-item">
    <div className="user-item-header">
      <UserIconContainer user={{ user }} classCss="middle" />
      <div className="d-flex flex-column">
        <span
          className={`user-item-header-type ${
            user.typeUser === 'student' ? 'type--student' : 'type--other'
          }`}
        >
          {user.typeUser}
        </span>
        <span>{user.fullName}</span>
      </div>
    </div>
    <div className="user-item-content">
      <TagList tags={user.tags} />
    </div>
    <div className="user-item-footer">
      <Button
        category="primary"
        onClick={this.handleSubmit}
        data-type="draft"
        label="Friend request"
        loading={false}
        style={{
          margin: 0,
          marginRight: '0.5rem',
        }}
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

UserListItem.propTypes = {
  user: PropTypes.object.isRequired,
};

export default UserListItem;
