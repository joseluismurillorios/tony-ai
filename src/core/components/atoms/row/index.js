import React from 'react';
import PropTypes from 'prop-types';


const Row = ({ className, children }) => (
  <section
    className={`row ${className}`}
  >
    {children}
  </section>
);

Row.defaultProps = {
  className: '',
};

Row.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.any),
  ]).isRequired,
  className: PropTypes.string,
};

export default Row;
