import React from 'react';
import PropTypes from 'prop-types';
import UserIconContainer from '../../../../../Modules/UserIcon';
import './userListItem.css';
import TagList from '../../../../../Modules/Tag/tagList';
import Button from '../../../../../components/Form/button';
import CompanyHeader from '../../../../../Modules/CompanyHeader';

const UserListItem = ({ user }) => (
  <li className="user-item">
    <div>
      {user.company ? (
        <CompanyHeader user={user} classNameContainer="company-header-reset" />
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
