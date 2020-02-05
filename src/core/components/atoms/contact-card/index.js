import React from 'react';
import PropTypes from 'prop-types';

import Linked from '../linked';
import GmapIframe from '../gmap-iframe';

const ContactCard = ({
  className,
  img,
  gmap,
  name,
  director,
  link,
  phone,
  email,
  color,
}) => (
  <div className={className}>
    <div className={`pricing-table wow fadeInUp bg-${color}`} data-wow-duration="1s" data-wow-delay="0.1s">
      <div className="pricing-title">
        <h3>{name}</h3>
      </div>
      <div className="pricing-price">
        <img src={img} alt="" />
      </div>
      <div className="pricing-features">
        <ul>
          <li>{`Presidente, ${director}`}</li>
          <li>{email}</li>
          <li>
            <Linked
              newTab
              url={link}
            >
              Página
            </Linked>
          </li>
          {
            !!(phone) && (
              <li>{phone}</li>
            )
          }
        </ul>
      </div>
      {
        !!(gmap) && (
          <div className="pricing-button">
            <GmapIframe url={gmap} />
          </div>
        )
      }
    </div>
  </div>
);

ContactCard.defaultProps = {
  className: 'light',
  img: '',
  gmap: '',
  name: '',
  director: '',
  link: '',
  phone: '',
  email: '',
  color: 'lighter',
};

ContactCard.propTypes = {
  className: PropTypes.string,
  img: PropTypes.string,
  gmap: PropTypes.string,
  name: PropTypes.string,
  director: PropTypes.string,
  link: PropTypes.string,
  phone: PropTypes.string,
  email: PropTypes.string,
  color: PropTypes.string,
};

export default ContactCard;
