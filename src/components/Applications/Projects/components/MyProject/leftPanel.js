import React from 'react';
import PropTypes from 'prop-types';
import './leftPanel.css';
import TeamWidget from '../DetailProject/InfoPanel/teamWidget';

const LeftPanel = ({ teamListProcess }) => (
  <aside className="my-project-leftpanel">
    <h1>My Teams</h1>
    <ul>
      {teamListProcess.teams.map((team, index) => (
        <li key={index}>
          <div className="">
            {team.users.map(user => (
              <img
                key={user._id}
                className="mini-thumbnail"
                src={user.picture || '/img/avatar.png'}
                alt="Student"
              />))}
          </div>
          <h2>{team.name}</h2>
        </li>
      ))}
    </ul>
  </aside>
);

LeftPanel.propTypes = {
  teamListProcess: PropTypes.object.isRequired,
};

export default LeftPanel;
