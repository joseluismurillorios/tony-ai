/* eslint-disable react/jsx-no-target-blank */
import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import OwlCarousel from 'react-owl-carousel';

import { PARTNERS } from '../../../assets';
import { isMobile } from '../../../helpers/helper-util';

import Linked from '../../atoms/linked';

const config = {
  0: {
    items: 1,
  },
  768: {
    items: 3,
  },
  979: {
    items: 4,
  },
};

const navText = ['<i class=\'implanf-chevron-left\'></i>', '<i class=\'implanf-chevron-right\'></i>'];

class OwlPartners extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialized: false,
    };

    this.onInitialized = this.onInitialized.bind(this);
  }

  shouldComponentUpdate() {
    const { initialized } = this.state;
    return !initialized;
  }

  onInitialized() {
    this.setState({ initialized: true });
  }

  render() {
    return (
      <OwlCarousel
        className="owl-carousel owl-theme"
        onInitialized={this.onInitialized}
        responsive={config}
        navText={navText}
        dots={!isMobile}
        // slideBy="page"
        nav
        autoplay
        autoplayTimeout={6000}
      >
        {
          PARTNERS.map(obj => (
            <div key={obj.link} className="item text-center ml-20 mr-20 mb-20">
              <img src={obj.url} alt="" style={{ maxWidth: '150px', margin: '0 auto' }} />
              <Linked
                newTab
                url={obj.link}
              >
                <small className="color-white">{obj.info}</small>
              </Linked>
            </div>
          ))
        }
      </OwlCarousel>
    );
  }
}

OwlPartners.defaultProps = {
};

OwlPartners.propTypes = {
};

export default OwlPartners;
