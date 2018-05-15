import React from 'react';
import PropTypes from 'prop-types';

import './index.css';
import Header from './header';
import Dashboard from '../../containers/MyProject/dashboard';
import LeftPanel from '../../containers/MyProject/leftPanel';

class MyProject extends React.Component {
  static propTypes = {

  }
  state = {}
  render() {
    return (
      <div className="my-project">
        <Header />
        <div className="my-project-content">
          <LeftPanel />
          <Dashboard />
        </div>
      </div>
    );
  }
}

export default MyProject;
