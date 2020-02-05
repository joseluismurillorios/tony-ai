import React from 'react';
import PropTypes from 'prop-types';


const ModalHeader = props => (
  <div className="modal-body">
    {props.children}
  </div>
);

ModalHeader.defaultProps = {
  children: 'no children',
};

ModalHeader.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.any),
  ]),
};

export default ModalHeader;
