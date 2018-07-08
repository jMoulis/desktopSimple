import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import AddFilesInput from '../../../../../Modules/filesHandler/addFilesInput';
import './project-info.css';
import UserIcon from '../../../../../Modules/UserIcon';

const ProjectInfo = ({ project }) => (
  <div className="project-info">
    <h1>Project Detail</h1>
    <ul className="ul-unstyled project-info-list">
      <li>
        <div className="company">
          <img className="company-logo" src={`${project.author.company.picture || '/img/company-generic.png'}`} alt="logo company" />
          <div className="company-info">
            <p className="company-info-name">{project.author.company.companyName}</p>
            <div className="company-author">
              <UserIcon
                user={{ user: project.author }}
                classCss="middle"
              />
              <p>{project.author.fullName}</p>
            </div>
          </div>
        </div>
      </li>
      <li><label>Title:</label> {project.title}</li>
      <li><label>Description:</label> {project.description}</li>
      <li><label>Due Date:</label> {project.dueDate && <Moment format="DD/MM/YYYY">{project.dueDate}</Moment>}</li>
      <li><label>Price:</label> {project.price ? project.price : 'None'}</li>
      <li><label>Contest:</label> {project.isContest ? `${project.maxTeam} teams` : 'No contest'}</li>
      <li><label>Tags:</label>
        <div className="input-tag">
          {project.tags.map((tag, index) => (
            <div key={index} className="input-tag-values">
              <span className="input-tag-value">{tag}</span>
            </div>
          ))}
        </div>
      </li>
      <li>
        <AddFilesInput docs={project.docs} readOnly />
      </li>
    </ul>
  </div>
);

ProjectInfo.propTypes = {
  project: PropTypes.object.isRequired,
};

export default ProjectInfo;
