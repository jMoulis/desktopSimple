import React from 'react';
import PropTypes from 'prop-types';
import './tableProject.css';

const Table = ({ projects }) => (
  <table className="table">
    <thead>
      <tr>
        <th>Actions</th>
        <th>Title</th>
        <th>Due Date</th>
        <th>Tags</th>
        <th>Teams</th>
      </tr>
    </thead>
    <tbody>
      {projects.map(project => (
        <tr key={project._id}>
          <td>
            <div className="btn-container">
              <button type="button">See</button>
              <button type="button">Delete</button>
            </div>
          </td>
          <td>{project.title}</td>
          <td>{project.dueDate}</td>
          <td>{project.tags}</td>
          <td>{project.teams.length}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

Table.propTypes = {
  projects: PropTypes.array,
};

Table.defaultProps = {
  projects: [],
};


export default Table;
