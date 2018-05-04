import React from 'react';
import './teamWidget.css';

const TeamWidget = ({ name }) => (
  <div className="team-widget">
    <i className="fas fa-users fa-2x" />
    <h2>{name}</h2>
    <div>Notation</div>
  </div>
);

export default TeamWidget;
