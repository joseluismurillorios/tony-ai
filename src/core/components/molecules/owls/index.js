import React from 'react';
import PropTypes from 'prop-types';
import OwlCarousel from 'react-owl-carousel';

import Globe from '../../atoms/globe';

const moonConfig = {
  0: {
    items: 3,
  },
  768: {
    items: 3,
  },
  979: {
    items: 5,
  },
};
const earthConfig = {
  0: {
    items: 2,
  },
  768: {
    items: 2,
  },
  979: {
    items: 4,
  },
};

const navText = ['<i class=\'implanf-chevron-left\'></i>', '<i class=\'implanf-chevron-right\'></i>'];

const OwlPhase = ({ phaseObj, type }) => {
  const responsive = type === 'earth' ? earthConfig : moonConfig;
  return (
    <OwlCarousel
      className="week-days owl-theme"
      responsive={responsive}
      navText={navText}
      nav
    >
      {
        Object.keys(phaseObj).map(el => (
          <li key={phaseObj[el].id} className="capitalize">
            <span><small>{phaseObj[el].name}</small></span>
            <Globe id={phaseObj[el].id} type={type} phase={phaseObj[el].phase} size="60px" />
            <span>{phaseObj[el].day}</span>
            <span><small>{phaseObj[el].hour}</small></span>
          </li>
        ))
      }
    </OwlCarousel>
  );
};

OwlPhase.defaultProps = {
  phaseObj: {},
  type: 'earth',
};

OwlPhase.propTypes = {
  phaseObj: PropTypes.objectOf(
    PropTypes.any,
  ),
  type: PropTypes.string,
};

export default OwlPhase;
