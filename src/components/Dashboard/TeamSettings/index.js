import React from 'react';
import PropTypes from 'prop-types';
import EditTeam from '../../../containers/Dashboard/TeamSettings/editTeam';
import './teamSettings.css';
import TeamProject from '../../../containers/Dashboard/TeamSettings/TeamProject';

const TeamSettings = ({ closeFromParent, globalActions }) => (
  <div className="team-settings">
    <EditTeam closeFromParent={closeFromParent} />
    <TeamProject globalActions={globalActions} closeFromParent={closeFromParent} />
  </div>
);

TeamSettings.propTypes = {
  closeFromParent: PropTypes.func.isRequired,
  globalActions: PropTypes.object.isRequired,
};

export default TeamSettings;
