import React from 'react';
import PropTypes from 'prop-types';


const ModalContainer = ({ className, id, children }) => (
  <div
    className={`modal fade ${className}`}
    id={id}
    role="dialog"
    aria-labelledby={`${id}Title`}
    aria-hidden="true"
    tabIndex="-1"
  >
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        {children}
      </div>
    </div>
  </div>
);

ModalContainer.defaultProps = {
  className: '',
};

ModalContainer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.any),
  ]).isRequired,
  id: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default ModalContainer;
