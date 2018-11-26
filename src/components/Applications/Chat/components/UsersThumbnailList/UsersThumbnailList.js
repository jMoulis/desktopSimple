import React from 'react';
import PropTypes from 'prop-types';
import UserIconContainer from '../../../../../Modules/UserIcon';
import './index.css';

const UsersThumbnailList = ({ users }) => {
  if (!users || !Array.isArray(users)) return <span />;
  const maxUsersDisplayed = users.slice(0, 5);
  const maxUsersLength = maxUsersDisplayed.length;
  const usersLength = users.length;

  return (
    <div className="users-thumbnail-list">
      {usersLength > maxUsersLength ? (
        <div className="d-flex relative">
          {maxUsersDisplayed.map(user => (
            <UserIconContainer
              key={user._id}
              containerCss={{ padding: 0 }}
              user={{ user }}
              classCss="small"
              isSmall
              hideNotificationBadge
            />
          ))}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              top: 0,
              right: 0,
              width: '24px',
              height: '26px',
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1rem',
            }}
            className="absolute"
          >
            {usersLength - maxUsersLength}+
          </div>
        </div>
      ) : (
        <div className="d-flex relative">
          {maxUsersDisplayed.map(user => (
            <UserIconContainer
              key={user._id}
              containerCss={{ padding: 0 }}
              user={{ user }}
              classCss="small"
              isSmall
              hideNotificationBadge
            />
          ))}
        </div>
      )}
    </div>
  );
};

UsersThumbnailList.propTypes = {
  users: PropTypes.array,
};

UsersThumbnailList.defaultProps = {
  users: [],
};

export default UsersThumbnailList;
