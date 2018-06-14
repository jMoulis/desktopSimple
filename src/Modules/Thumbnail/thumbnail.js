import React from 'react';
import PropTypes from 'prop-types';

import UserIcon from '../UserIcon';
import './thumbnail.css';

const hasSelectedTag = (selectedTags, tag) => {
  const selectedTagFound = selectedTags.find(selectedTag => selectedTag.value === tag);
  if (selectedTagFound) {
    return selectedTagFound.value;
  }
  return false;
};
const hisSelected = (users, me) => {
  const amISelected = Object.values(users).find(user => user._id === me._id);
  if (amISelected) {
    return amISelected;
  }
  return false;
};
const Thumbnail = ({ user, configForThumbnail }) => {
  let amISelected;
  if (configForThumbnail) {
    amISelected = hisSelected(configForThumbnail.selectedUsers, user);
  }
  return (
    <div
      className={`thumbnail-container ${amISelected && 'thumbnail-container--selected'}`}
    >
      <UserIcon user={{ user }} />
      <div>
        <span>{user.fullName}</span>
        <ul className="ul-nav tag-list">
          {user.tags && user.tags.map((tag, index) => {
            const selectedTag = hasSelectedTag(configForThumbnail.selectedTags, tag);
            return (
              <li
                key={index}
              >
                <button
                  type="button"
                  className={`tag-item
                  ${selectedTag &&
                    selectedTag === tag &&
                    'tag-item--selected'}
                  `}
                  onClick={configForThumbnail.onClick}
                  onKeyPress={configForThumbnail.onClick}
                  disabled={selectedTag === false || amISelected}
                  data-user={
                    JSON.stringify({
                      spec: tag,
                      user: {
                        picture: user.picture,
                        fullName: user.fullName,
                        _id: user._id,
                      },
                    })}
                >{tag}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

Thumbnail.propTypes = {
  user: PropTypes.object.isRequired,
  configForThumbnail: PropTypes.object,
};

Thumbnail.defaultProps = {
  configForThumbnail: null,
};

export default Thumbnail;
