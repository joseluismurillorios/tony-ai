import React from 'react';
import PropTypes from 'prop-types';


const ModalFooter = props => (
  <div className="modal-footer">
    {props.children}
  </div>
);

ModalFooter.defaultProps = {
  children: 'no children',
};

ModalFooter.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.any),
  ]),
};

export default ModalFooter;
