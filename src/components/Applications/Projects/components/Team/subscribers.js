import React from 'react';
import PropTypes from 'prop-types';
import Thumbnail from '../../../../../Modules/Thumbnail/thumbnail';
import './subscribers.css';

const Subscribers = ({ project, onClick, config }) => {
  if (!project.subscribers) {
    return <span>No Subscribers</span>;
  }
  return (
    <div className="subscribers-container">
      <h1>Subscribers</h1>
      <ul>
        {project.subscribers.length > 0
          ? project.subscribers.map(subscriber => {
              if (config.loggedUser._id === subscriber._id) {
                return false;
              }
              return (
                <li key={subscriber._id}>
                  <Thumbnail
                    user={subscriber}
                    onClick={onClick}
                    configForThumbnail={config}
                  />
                </li>
              );
            })
          : 'No subscribers'}
      </ul>
    </div>
  );
};

Subscribers.propTypes = {
  project: PropTypes.object,
  onClick: PropTypes.func,
  config: PropTypes.object,
};

Subscribers.defaultProps = {
  project: null,
  onClick: null,
  config: null,
};

export default Subscribers;
