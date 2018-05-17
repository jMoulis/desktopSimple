import React from 'react';
import PropTypes from 'prop-types';

import './index.css';
import Header from './header';
import Dashboard from '../../containers/MyTeams/dashboard';
import LeftPanel from '../../containers/MyTeams/leftPanel';

class MyProject extends React.Component {
  static propTypes = {

  }
  state = {
    teamid: null,
  }
  handleDetailTeam = (evt) => {
    const { teamid } = evt.currentTarget.dataset;
    this.setState(prevState => ({
      ...prevState,
      teamid,
    }));
  }
  render() {
    return (
      <div className="my-project">
        <Header />
        <div className="my-project-content">
          <LeftPanel showDetail={this.handleDetailTeam} />
          {this.state.teamid ?
            <Dashboard teamId={this.state.teamid} /> :
            <div>No Team Selected yet</div>
          }
        </div>
      </div>
    );
  }
}

export default MyProject;
