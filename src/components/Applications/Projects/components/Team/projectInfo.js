import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import './project-info.css';
import CompanyHeader from '../../../../../Modules/CompanyHeader';
import DisplayDocument from '../../../../../Modules/DisplayDocument';

const ProjectInfo = ({ project }) => (
  <div className="project-info">
    <h1>Project Detail</h1>
    <ul className="ul-unstyled project-info-list">
      <li>
        <CompanyHeader user={project.author} />
      </li>
      <li>
        <label>Title:</label> {project.title}
      </li>
      <li>
        <label>Description:</label> {project.description}
      </li>
      <li>
        <label>Due Date:</label>{' '}
        {project.dueDate && (
          <Moment format="DD/MM/YYYY">{project.dueDate}</Moment>
        )}
      </li>
      <li>
        <label>Price:</label> {project.price ? project.price : 'None'}
      </li>
      <li>
        <label>Contest:</label>{' '}
        {project.isContest ? `${project.maxTeam} teams` : 'No contest'}
      </li>
      <li>
        <label>Tags:</label>
        <div className="input-tag">
          {project.tags.map((tag, index) => (
            <div key={index} className="input-tag-values">
              <span className="input-tag-value">{tag}</span>
            </div>
          ))}
        </div>
      </li>
      <li>
        <DisplayDocument files={project.files} />
      </li>
    </ul>
  </div>
);

ProjectInfo.propTypes = {
  project: PropTypes.object.isRequired,
};

export default ProjectInfo;
