import React from 'react';
import PropTypes from 'prop-types';

const Container = ({ className, children }) => (
  <section className={`container ${className}`}>
    {children}
  </section>
);

Container.defaultProps = {
  className: '',
};

Container.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
  className: PropTypes.string,
};

export default Container;
