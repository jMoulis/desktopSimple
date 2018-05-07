import React from 'react';
import PropTypes from 'prop-types';

const ProjectInfo = ({ project }) => (
  <ul className="ul-unstyled">
    <li>Title: {project.title}</li>
  </ul>
);

ProjectInfo.propTypes = {
  project: PropTypes.object.isRequired,
};

export default ProjectInfo;
