/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Modal = ({
  className,
  opened,
  onCancel,
  title,
  children,
}) => {
  const [show, setShow] = useState('');
  useEffect(() => {
    if (opened) {
      setTimeout(() => {
        setShow('show in');
      }, 50);
    } else {
      setShow('');
    }
  }, [opened]);
  return (
    <div
      className={`modal fade ${show} ${className}`}
      role="dialog"
      tabIndex={-1}
      style={opened ? { display: 'block' } : { display: 'none' }}
      aria-modal="true"
    >
      <div
        className="modal-backdrop fade in show"
        onClick={onCancel}
      />
      <div className="modal-dialog modal-centered" role="document">
        <div className="modal-content text-center">
          <div className="modal-header">
            <button type="button" className="close" onClick={onCancel} data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">×</span>
            </button>
            <h4 className="modal-title">{title}</h4>
          </div>
          <div className="modal-body">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

Modal.defaultProps = {
  onCancel: () => {},
  opened: false,
  title: '',
  className: '',
};

Modal.propTypes = {
  onCancel: PropTypes.func,
  opened: PropTypes.bool,
  title: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.any),
  ]).isRequired,
};

export default Modal;
