import React from 'react';
import classNames from 'classnames';

import PropTypes from 'prop-types';
// import Draggable from './Helpers/draggable';

import './frame.css';
import Toolbar from '../../../containers/Dashboard/Toolbar/toolbar';
import Draggable from './Helpers/draggable';

class Frame extends React.Component {
  static propTypes = {
    applications: PropTypes.object.isRequired,
    setActiveAppAction: PropTypes.func.isRequired,
    // Given from the parent
    appName: PropTypes.string.isRequired,
    title: PropTypes.string,
    activeApp: PropTypes.object,
    children: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.bool,
      PropTypes.array,
    ]),
  }
  static defaultProps = {
    title: 'Application',
    activeApp: null,
    children: null,
  }
  componentDidUpdate() {
    const { activeApp } = this.props;
    const element = document.querySelector(`#${activeApp.appName}`);
    const drag = new Draggable(element, activeApp.appName);
    drag.dragElement();
  }
  handleSelectApp = (event) => {
    const { setActiveAppAction } = this.props;
    const appName = event.currentTarget.id;
    setActiveAppAction({ appName, appComponent: null });
  }
  render() {
    const {
      applications,
      title,
      appName,
      children,
      activeApp,
    } = this.props;
    const frameFullSizeClass = classNames({
      frame: true,
      'frame-full': applications[appName].fullSize,
      'frame-reset': applications[appName].fullSize,
    });
    if (activeApp.appName.length === 0) {
      return false;
    }
    return (
      <div
        className={`${frameFullSizeClass} ${applications[appName].reduce && 'frame-reduce'}`}
        id={appName}
        onClick={this.handleSelectApp}
        onKeyPress={this.handleSelectApp}
        style={{ zIndex: applications[appName].zIndex }}
      >
        <Toolbar title={title} appName={appName} />
        <section className="child-app">{children}</section>
      </div>
    );
  }
}

export default Frame;
