import React from 'react';
import PropTypes from 'prop-types';
import EditTeam from '../../../containers/Dashboard/TeamSettings/editTeam';
import './teamSettings.css';

const TeamSettings = ({ closeFromParent }) => (
  <div className="team-settings">
    <EditTeam closeFromParent={closeFromParent} />
  </div>
);

TeamSettings.propTypes = {
  closeFromParent: PropTypes.func.isRequired,
};

export default TeamSettings;
