import React from 'react';
import PropTypes from 'prop-types';

import Globe from '../../atoms/globe';

import Glides from '../../molecules/glide';


const moonConfig = {
  perView: 5,
  bullets: false,
  type: 'carousel',
  breakpoints: {
    541: {
      perView: 3,
    },
    768: {
      perView: 3,
    },
    979: {
      perView: 5,
    },
  },
};

const earthConfig = {
  perView: 4,
  bullets: false,
  type: 'carousel',
  breakpoints: {
    541: {
      perView: 2,
    },
    768: {
      perView: 2,
    },
    979: {
      perView: 4,
    },
  },
};

const Phase = ({
  type,
  title,
  subtitle,
  desc,
  phases,
  current,
}) => {
  const id = `${type}Current`;
  const config = type === 'earth' ? earthConfig : moonConfig;
  return (
    <div className="widget weather">
      <h3 className="widget-title heading relative heading-small uppercase style-2 text-center bottom-line pt-10 hidden-xs">
        {title}
      </h3>
      <div className="weather-box">
        <div className="weather-wrap clearfix">
          <div className="weather-main left">
            <ul className="capitalize">
              <h5>{subtitle}</h5>
              <li>{desc[0]}</li>
              <li>{desc[1]}</li>
              <li>{desc[2]}</li>
            </ul>
          </div>
          <div className="weather-temp right text-center">
            <Globe id={id} type={type} age={0} phase={current} />
          </div>
        </div>
        <Glides className="week-days" config={config}>
          {
            Object.keys(phases).map(el => (
              <li key={phases[el].id} className="week-day capitalize">
                <span><small>{phases[el].name}</small></span>
                <Globe id={phases[el].id} type={type} phase={phases[el].phase} size="60px" />
                <span>{phases[el].day}</span>
                <span><small>{phases[el].hour}</small></span>
              </li>
            ))
          }
        </Glides>
      </div>
    </div>
  );
};

Phase.defaultProps = {
  type: 'earth',
  title: 'Fase Solar',
  desc: ['Gracias', 'Por', 'Esperar'],
  phases: {},
  subtitle: (<span>Cargando</span>),
  current: 0,
};

Phase.propTypes = {
  type: PropTypes.string,
  title: PropTypes.string,
  desc: PropTypes.arrayOf(PropTypes.any),
  phases: PropTypes.objectOf(
    PropTypes.any,
  ),
  subtitle: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
  ]),
  current: PropTypes.number,
};

export default Phase;
