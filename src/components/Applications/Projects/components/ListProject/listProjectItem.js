import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import UserIconContainer from '../../../../../Modules/UserIcon';
import './listProject.css';

const ListProjectItem = ({ project, showDetailModal }) => {


  return (
    <ul
      className="project-list"
      key={project._id}
    >
      <li
        className="project-list-item"
      >
        <div className="company">
          <img className="company-logo" src={project.author.company.picture || '/img/anonymous.png'} alt="logo company" />
          <div className="company-info">
            <p className="company-info-name">{project.author.company.companyName}</p>
            <div className="company-author">
              <UserIconContainer
                user={{ user: project.author }}
                classCss="middle"
              />
              <p>{project.author.fullName}</p>
            </div>
          </div>
        </div>
        <h2>{project.title}</h2>
        <div className="content">
          <ul>
            <li><p><span className="title">Due Date:</span> {project.dueDate && <Moment format="DD/MM/YYYY">{project.dueDate}</Moment>}</p></li>
            <li><p><span className="title">Teams registered:</span> {project.teams.length > 0 ? project.teams.length : <span>No Teams yet</span>}</p></li>
            <li><p><span className="title">Description:</span> {project.description}</p></li>
            <li>
              <ul className="tags-list">
                {project.tags.map((tag, index) => <li className="tags-list-item" key={index}>{tag}</li>)}
              </ul>
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
    </ul>
  )
};

ListProjectItem.propTypes = {
  project: PropTypes.object.isRequired,
  showDetailModal: PropTypes.func.isRequired,
};

export default ListProjectItem;
