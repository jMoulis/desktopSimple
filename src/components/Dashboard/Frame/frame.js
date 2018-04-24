import React from 'react';
import classNames from 'classnames';

import PropTypes from 'prop-types';
import Draggable from './Helpers/draggable';

import './frame.css';
import Toolbar from '../../../containers/Dashboard/Toolbar/toolbar';

class Frame extends React.Component {
  static propTypes = {
    applications: PropTypes.object.isRequired,
    setActiveAppAction: PropTypes.func.isRequired,
    // Given by the parent
    appName: PropTypes.string.isRequired,
    title: PropTypes.string,
    activeApp: PropTypes.string,
  }
  static defaultProps = {
    title: 'Application',
    activeApp: '',
  }
  componentDidMount() {
    const { activeApp } = this.props;
    const element = document.querySelector(`#${activeApp}`);
    const drag = new Draggable(element, activeApp);
    const evt = window.event;
    drag.elementDrag(evt);
  }
  componentDidUpdate() {
    const { activeApp } = this.props;
    const element = document.querySelector(`#${activeApp}`);
    const drag = new Draggable(element, activeApp);
    const evt = window.event;
    drag.elementDrag(evt);
  }
  handleSelectApp = (event) => {
    const { setActiveAppAction } = this.props;
    const activeApp = event.currentTarget.id;
    setActiveAppAction(activeApp);
  }
  render() {
    const {
      applications,
      title,
      appName,
    } = this.props;
    const frameClass = classNames({
      frame: true,
      'frame-full': applications[appName].fullSize,
      'frame-reset': applications[appName].fullSize,
    });
    return (
      <aside
        className={frameClass}
        id={appName}
        onClick={this.handleSelectApp}
        onKeyPress={this.handleSelectApp}
        style={{ zIndex: applications[appName].zIndex }}
      >
        <Toolbar title={title} appName={appName} />
      </aside>
    );
  }
}

export default Frame;
