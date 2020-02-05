/* eslint-disable react/jsx-no-target-blank */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import $ from '../../../helpers/helper-jquery';
import Linked from '../../atoms/linked';

class IconBox extends Component {
  componentDidMount() {
    $('.lightbox-video').magnificPopup();
  }

  render() {
    const { video } = this.props;
    return (
      <div className="work-item hover-2">
        <div className="work-container">
          <div
            className="work-img"
            style={{ backgroundImage: `url(//img.youtube.com/vi/${video}/maxresdefault.jpg)` }}
          >
            <div className="work-overlay">
              <div className="project-icons">
                <Linked
                  newTab
                  url={`https://www.youtube.com/watch?v=${video}?autoplay=1`}
                  className="lightbox-video mfp-iframe"
                >
                  <i className="esricon-play" />
                </Linked>
                <Linked
                  newTab
                  url={`https://www.youtube.com/watch?v=${video}`}
                  className="project-icon"
                >
                  <i className="esricon-link" />
                </Linked>
                <h2 className="color-white mt-10">Reproducir</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

IconBox.defaultProps = {
};

IconBox.propTypes = {
  video: PropTypes.string.isRequired,
};

export default IconBox;
