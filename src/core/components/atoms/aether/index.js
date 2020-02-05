import React from 'react';
import PropTypes from 'prop-types';

const rand = () => `${Math.floor(Math.random() * 20) + 16}s`;

const Aether = React.memo(({
  className,
}) => (
  <div className={`aether ${className}`}>
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <rect x={0} y={0} width="100%" height="100%" fill="url(#Gradient1)">
        <animate attributeName="x" dur="20s" values="25%;0%;25%" repeatCount="indefinite" />
        <animate attributeName="y" dur="21s" values="0%;25%;0%" repeatCount="indefinite" />
        <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur={rand(17)} repeatCount="indefinite" />
      </rect>
      <rect x={0} y={0} width="100%" height="100%" fill="url(#Gradient2)">
        <animate attributeName="x" dur="23s" values="-25%;0%;-25%" repeatCount="indefinite" />
        <animate attributeName="y" dur="24s" values="0%;50%;0%" repeatCount="indefinite" />
        <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur={rand(18)} repeatCount="indefinite" />
      </rect>
      <rect x={0} y={0} width="100%" height="100%" fill="url(#Gradient3)">
        <animate attributeName="x" dur="25s" values="0%;25%;0%" repeatCount="indefinite" />
        <animate attributeName="y" dur="26s" values="0%;25%;0%" repeatCount="indefinite" />
        <animateTransform attributeName="transform" type="rotate" from="360 50 50" to="0 50 50" dur={rand(19)} repeatCount="indefinite" />
      </rect>
    </svg>
  </div>
), () => true);

Aether.defaultProps = {
  className: 'light',
};

Aether.propTypes = {
  className: PropTypes.string,
};

export default Aether;
