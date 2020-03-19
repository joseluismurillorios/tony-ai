import React from 'react';
import {
  Settings,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Video,
  VideoOff,
} from 'react-feather';
import PropTypes from 'prop-types';

import './style.scss';

const CircularMenu = ({
  className,
  opened,
  mic,
  visual,
  voice,
  camera,
  onToggleOpened,
  onVoiceToggle,
  onVisualToggle,
}) => (
  <div className={`circular-menu ${opened ? 'active' : ''}`}>
    <div className="circular-wrapper">
      <button type="button" className={`floating-btn ${className}`} onClick={onToggleOpened}>
        <Settings />
      </button>
      <menu className="items-wrapper">
        <button type="button" className="menu-item" onClick={onVoiceToggle}>
          {
            voice
              ? (
                <Volume2 />
              )
              : (
                <VolumeX />
              )
          }
        </button>
        <button type="button" className="menu-item" onClick={onVoiceToggle}>
          {
            mic
              ? (
                <Mic />
              )
              : (
                <MicOff />
              )
          }
        </button>
        <button type="button" className="menu-item" onClick={onVisualToggle}>
          {
            visual
              ? (
                <Eye />
              )
              : (
                <EyeOff />
              )
          }
        </button>
        <button type="button" className="menu-item" onClick={onVoiceToggle}>
          {
            camera
              ? (
                <Video />
              )
              : (
                <VideoOff />
              )
          }
        </button>
      </menu>
    </div>
  </div>
);

CircularMenu.defaultProps = {
  className: '',
  opened: false,
  mic: false,
  visual: false,
  voice: false,
  camera: false,
  onToggleOpened: () => {},
  onVoiceToggle: () => {},
  onVisualToggle: () => {},
};

CircularMenu.propTypes = {
  className: PropTypes.string,
  opened: PropTypes.bool,
  mic: PropTypes.bool,
  visual: PropTypes.bool,
  voice: PropTypes.bool,
  camera: PropTypes.bool,
  onToggleOpened: PropTypes.func,
  onVoiceToggle: PropTypes.func,
  onVisualToggle: PropTypes.func,
};

export default CircularMenu;
