import React from 'react';
import { Player, BigPlayButton, ControlBar } from 'video-react';
import 'video-react/dist/video-react.css';
import './index.css';

const Video = ({ close }) => (
  <div className="video">
    <div className="video-content">
      <Player src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4">
        <BigPlayButton position="center" />
        <ControlBar autoHide />
      </Player>
      <button type="button" onClick={() => close()} className="helper-close">
        <i className="fas fa-times-circle fa-2x" />
      </button>
    </div>
  </div>
);

export default Video;
