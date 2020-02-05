import React from 'react';
import PropTypes from 'prop-types';

const CloseButton = ({ className, closeToast }) => (
  <button
    className={className}
    onClick={closeToast}
    type="button"
  />
);

CloseButton.defaultProps = {
  closeToast: () => {},
};

CloseButton.propTypes = {
  className: PropTypes.string.isRequired,
  closeToast: PropTypes.func,
};

export default CloseButton;
