import React from 'react';
import PropTypes from 'prop-types';


const Section = ({ id, className, children }) => (
  <section
    id={id}
    className={`section-wrap ${className}`}
  >
    {children}
  </section>
);

Section.defaultProps = {
  id: '',
  className: '',
};

Section.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.any),
  ]).isRequired,
  id: PropTypes.string,
  className: PropTypes.string,
};

export default Section;
