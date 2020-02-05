import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';

import './style.scss';

import Loader from '../loader';

class Background extends Component {
  constructor(props) {
    super(props);
    this.height = window.innerHeight;
    this.state = {
      imageStatus: false,
    };
    this.handleImageLoaded = this.handleImageLoaded.bind(this);
  }

  handleImageLoaded() {
    const { onLoad } = this.props;
    onLoad(false);
    this.setState({ imageStatus: true });
  }

  render() {
    const {
      img,
      width,
      height,
      background,
    } = this.props;
    const { imageStatus } = this.state;
    // Must add reducer for viewport resize
    return (
      img
        ? (
          <div className="app__background">
            <img
              src={img}
              alt=""
              style={{ width, height }}
              onLoad={this.handleImageLoaded}
              onError={() => {
                console.log('failed to load');
                this.handleImageLoaded();
              }}
            />
            <CSSTransition
              in={!imageStatus}
              timeout={200}
              classNames="fast"
              unmountOnExit
            >
              <Loader />
            </CSSTransition>
          </div>
        )
        : (<div className="app__background" style={{ backgroundImage: `url(${background})` }} alt="" />)
    );
  }
}

Background.defaultProps = {
  img: false,
  background: '#1b1b1b',
  width: window.innerWidth,
  height: window.innerHeight,
  onLoad: () => {},
};

Background.propTypes = {
  img: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  background: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  onLoad: PropTypes.func,
};

export default Background;
