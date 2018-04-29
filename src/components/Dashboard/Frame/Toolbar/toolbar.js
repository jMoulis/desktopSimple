import React from 'react';
import PropTypes from 'prop-types';

import './toolbar.css';
import ToolBarButton from './toolbar-btn';

class Toolbar extends React.Component {
  static propTypes = {
    fullSizeAction: PropTypes.func.isRequired,
    closeAppAction: PropTypes.func.isRequired,
    reduceAppAction: PropTypes.func.isRequired,
    appName: PropTypes.string,
    title: PropTypes.string,
  }
  static defaultProps = {
    appName: null,
    title: null,
  }
  handleFullSize = () => {
    const { appName, fullSizeAction } = this.props;
    fullSizeAction(appName);
  }
  handleClose = () => {
    const { appName, closeAppAction } = this.props;
    closeAppAction(appName);
  }
  handleReduce = () => {
    const { appName, reduceAppAction } = this.props;
    reduceAppAction(appName);
  }
  render() {
    const { title, appName } = this.props;
    return (
      <div className="toolbar" onDoubleClick={this.handleFullSize}>
        <header className={`toolbar-header-${appName}`}>
          <span className="toolbar-title unselectable">{title}</span>
        </header>
        <div className="toolbar-button-container">
          <ToolBarButton type="reduce" onClick={this.handleReduce} />
          <ToolBarButton type="full-size" onClick={this.handleFullSize} />
          <ToolBarButton type="close" onClick={this.handleClose} />
        </div>
      </div>
    );
  }
}

export default Toolbar;
