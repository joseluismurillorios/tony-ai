import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const Loader = ({ className, style }) => (
  <div className={className || 'preloader'} style={style}>
    <div className="ball-scale-multiple">
      <div />
      <div />
      <div />
    </div>
  </div>
);

Loader.defaultProps = {
  className: false,
  style: {},
};

Loader.propTypes = {
  className: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  style: PropTypes.objectOf(
    PropTypes.any,
  ),
};

export default Loader;
