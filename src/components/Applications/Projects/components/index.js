import React from 'react';
import PropTypes from 'prop-types';
import './project.css';
import NewProject from '../containers/Projects/NewProject/newProject';

class Settings extends React.Component {
  static propTypes = {
    fetchProjectsAction: PropTypes.func.isRequired,
  }
  state = {
    tab: 'profile',
  }
  componentDidMount() {
    const { fetchProjectsAction } = this.props;
    fetchProjectsAction();
  }
  handleTabSelect = (evt) => {
    // Save the input field
    const { name } = evt.target;
    this.setState(() => ({
      tab: name,
    }));
  }
  render() {
    return (
      <div className="project-container">
        <div className="app-toolbar" key="app-toolbar">
          <ul>
            <li>
              <button className="btn-form btn-app-toolbar" name="newProject" onClick={this.handleTabSelect}>New Project</button>
            </li>
            <li>
              <button className="btn-form btn-app-toolbar" name="account" onClick={this.handleTabSelect}>Touchy Info</button>
            </li>
          </ul>
        </div>
        {this.state.tab === 'newProject' && <NewProject key="profile" /> }
      </div>
    );
  }
}

export default Settings;
