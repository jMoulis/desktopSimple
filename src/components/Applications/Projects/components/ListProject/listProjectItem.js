import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import UserIconContainer from '../../../../../Modules/UserIcon';
import './listProject.css';
import TagList from '../../../../../Modules/Tag/tagList';
import CompanyHeader from '../../../../../Modules/CompanyHeader';

const truncateDescription = text => {
  const maxWord = 25;
  const newText = text
    .split(' ')
    .splice(0, maxWord)
    .join(' ');
  return `${newText} ...`;
};

const ListProjectItem = ({ project, showDetailModal }) => (
  <li className="project-list-item">
    <span
      className={`online ${project.isOnline ? 'online--green' : 'online--red'}`}
      title={project.isOnline ? 'online' : 'offline'}
    >
      {project.isOnline ? 'online' : 'offline'}
    </span>
    <CompanyHeader user={project.author} />
    <div className="content">
      <h2>{project.title}</h2>
      <ul>
        <li>
          <div>
            <span className="title">Due Date:</span>{' '}
            {project.dueDate && (
              <Moment format="DD/MM/YYYY">{project.dueDate}</Moment>
            )}
          </div>
        </li>
        <li>
          <div>
            <span className="title">Teams registered:</span>{' '}
            {project.teams.length > 0 ? (
              project.teams.length
            ) : (
              <span>No Teams yet</span>
            )}
          </div>
        </li>
        <li>
          <div>
            <span className="title">Description:</span>
            <p>{truncateDescription(project.description)}</p>
          </div>
        </li>
        <li>
          <TagList tags={project.tags} />
        </li>
      </ul>
      <div>
        <button
          type="button"
          data-projectid={project._id}
          data-tab="project-detail"
          onClick={showDetailModal}
          className="btn btn-primary"
          style={{
            width: '100%',
            marginTop: '.5rem',
          }}
        >
          Check me out
        </button>
      </div>
    </div>
  </li>
);

ListProjectItem.propTypes = {
  project: PropTypes.object.isRequired,
  showDetailModal: PropTypes.func.isRequired,
};

export default ListProjectItem;
