/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Wow = ({
  className,
  classIn,
  show,
  children,
  delay,
  duration,
}) => {
  const [animate, setShow] = useState('');
  useEffect(() => {
    if (show) {
      setTimeout(() => {
        setShow(`animated ${classIn}`);
      }, 50);
    } else {
      setShow('');
    }
  }, [show]);
  return (
    <div
      className={`${className} ${animate}`}
      role="dialog"
      tabIndex={-1}
      style={{
        animationName: show ? classIn : 'none',
        animationDuration: duration,
        animationDelay: delay,
        visibility: show ? 'visible' : 'hidden',
        // opacity: show ? 1 : 0,
        transition: `opacity ease ${duration}`,
      }}
    >
      {children}
    </div>
  );
};

Wow.defaultProps = {
  show: false,
  className: '',
  classIn: 'fadeIn',
  delay: '0.6s',
  duration: '1s',
};

Wow.propTypes = {
  show: PropTypes.bool,
  className: PropTypes.string,
  classIn: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.any),
  ]).isRequired,
  delay: PropTypes.string,
  duration: PropTypes.string,
};

export default Wow;
