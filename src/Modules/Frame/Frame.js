import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import './frame.css';
import Toolbar from './containers/Toolbar';
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
  };
  static defaultProps = {
    title: 'Application',
    activeApp: null,
    children: null,
  };
  constructor(props) {
    super(props);
    const { innerHeight, innerWidth } = window;
    let footerHeight = 65;
    if (document.getElementById('footer')) {
      footerHeight = document.getElementById('footer').clientHeight;
    }
    const topBottomPosition = innerHeight * 0.1;
    const leftRightPosition = innerWidth * 0.1;
    const width = innerWidth - leftRightPosition * 2;
    const height = innerHeight - topBottomPosition * 2 - footerHeight;
    this.state = {
      right: leftRightPosition,
      left: leftRightPosition,
      top: topBottomPosition,
      bottom: topBottomPosition,
      width,
      height,
      display: true,
      enterTimeout: 150,
      exitTimeout: 150,
    };
  }
  componentDidUpdate() {
    const { activeApp } = this.props;
    const element = document.querySelector(`#${activeApp.appName}`);
    const drag = new Draggable(element, activeApp.appName);
    drag.dragElement();
  }
  handleSelectApp = event => {
    const { setActiveAppAction, activeApp } = this.props;
    const appName = event.currentTarget.id;
    if (activeApp.appName !== appName) {
      setActiveAppAction({ appName, appComponent: null });
    }
  };

  handleTransition = () => {
    this.setState(() => ({
      display: false,
    }));
    return true;
  };

  render() {
    const { applications, title, appName, children, activeApp } = this.props;
    const frameFullSizeClass = classNames({
      frame: true,
      'frame-full': applications[appName].fullSize,
      'frame-reset': applications[appName].fullSize,
    });
    if (activeApp.appName.length === 0) {
      return false;
    }
    return (
      <CSSTransition
        in={this.state.display}
        timeout={{
          enter: this.state.enterTimeout,
          exit: this.state.exitTimeout,
        }}
        classNames="frame"
        appear
      >
        <div
          className={`${frameFullSizeClass} ${applications[appName].reduce &&
            'frame-reduce'}`}
          id={appName}
          onClick={this.handleSelectApp}
          onKeyPress={this.handleSelectApp}
          style={{
            zIndex: applications[appName].zIndex,
            top: `${this.state.top}px`,
            bottom: `${this.state.bottom}px`,
            left: `${this.state.left}px`,
            right: `${this.state.right}px`,
            width: `${this.state.width}px`,
            height: `${this.state.height}px`,
          }}
        >
          <Toolbar
            title={title}
            appName={appName}
            handleTransition={this.handleTransition}
            exitTimeOut={this.state.exitTimeout}
          />
          <section className="child-app">{children}</section>
        </div>
      </CSSTransition>
    );
  }
}

export default Frame;
