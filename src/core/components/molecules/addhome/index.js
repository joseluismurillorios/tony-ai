import React from 'react';
import PropTypes from 'prop-types';

import Clickable from '../../atoms/clickable';

import SVGHome from './svgHome';
import SVGShare from './svgShare';

import './style.scss';

const AddHome = ({ id, onClick }) => (
  <Clickable id={id} onClick={onClick} className="addhome">
    <div className="addhome__close-icon">&times;</div>
    <h4 className="mb-10">Instalar Web App</h4>
    <p>
      Presiona
      <SVGShare />
      seguido de
      <SVGHome />
    </p>
    <span className="implanf-expand_more mt-10" style={{ display: 'block' }} />
  </Clickable>
);

AddHome.defaultProps = {
  id: '',
};

AddHome.propTypes = {
  onClick: PropTypes.func.isRequired,
  id: PropTypes.string,
};

export default AddHome;
