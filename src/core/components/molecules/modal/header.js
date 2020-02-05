import React from 'react';
import PropTypes from 'prop-types';


const ModalHeader = ({ text }) => (
  <div className="modal-header">
    <span className="modal-title uppercase" id="LoginTitle">{text}</span>
    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
);

ModalHeader.defaultProps = {
  text: 'no text',
};

ModalHeader.propTypes = {
  text: PropTypes.string,
};

export default ModalHeader;
