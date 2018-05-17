import React from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';
import './index.css';
import Video from '../Video';

const duration = 100;

class Helper extends React.Component {
  static propTypes = {
    close: PropTypes.func.isRequired,
  }
  static duration = 100
  state = {
    show: true,
    video: false,
  }
  handleShowVideo = (evt) => {
    const { name } = evt.target;
    console.log('load video', name);
    this.setState(() => ({
      video: true,
    }));
  }
  handleCloseVideo = () => {
    this.setState(() => ({
      video: false,
    }));
  }
  render() {
    const { close } = this.props;
    const transitionStyles = {
      entering: { opacity: 0 },
      entered: { opacity: 1 },
      exiting: { opacity: 1 },
      exited: { opacity: 0 },
    };
    const defaultStyle = {
      transition: `opacity ${duration}ms ease-in-out`,
    };
    return (
      <Transition
        in={this.state.show}
        timeout={{
          enter: 200,
          exit: 200,
        }}
        appear
        onExited={() => {
          setTimeout(() => close(), 500);
        }}
      >
        {state => (
          <div className="helper" style={{ ...defaultStyle, ...transitionStyles[state] }}>
            <button type="button" onClick={() => this.setState({ show: false })} className="helper-close">
              <i className="fas fa-times-circle fa-2x" />
            </button>
            <h1>Helper</h1>
            <div className="helper-content">
              <p>It seems that you don't have a team yet?</p>
              <h2>You have few solutions:</h2>
              <ul>
                <li>
                  <div>
                    Create your own team as a project manager and select your teammates -
                    <button name="create-team" type="button" onClick={this.handleShowVideo}>show me</button>
                  </div>
                </li>
                <li>
                  <div>
                    Subscribe to a project and then wait until a project manager selects you -
                    <button name="subscribe-project" type="button" onClick={this.handleShowVideo}>show me</button>
                  </div>
                </li>
                <li>
                  <div>
                    Contact a project manager to ask him to be added to the team
                    <button name="contact-pm" type="button" onClick={this.handleShowVideo}>show me</button>
                  </div>
                </li>
              </ul>
              <h2>What's next?</h2>
              <p>As soon as you have a team, an icon will magically appear on your desktop</p>
              <p>Icon</p>
              <p>Then by clicking this icon you'll find you team's dashboard</p>
            </div>
            {this.state.video && <Video close={this.handleCloseVideo} />}
          </div>
          )}
      </Transition>
    );
  }
}

export default Helper;
