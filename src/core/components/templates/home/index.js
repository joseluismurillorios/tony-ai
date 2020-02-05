/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Container from '../../atoms/container';
import Section from '../../atoms/section';
import Linked from '../../atoms/linked';
import Scrollable from '../../atoms/scrollable';

import Hero from '../../organisms/hero';
import Footer from '../../organisms/footer';

import { setLoader } from '../../../redux/actions/common';
import Row from '../../atoms/row';

class Home extends Component {
  componentDidMount() {
    const { mapLoading } = this.props;
    mapLoading(true);
    setTimeout(() => {
      mapLoading(false);
    }, 500);
  }

  render() {
    const { mapLoading } = this.props;
    // mapLoading(false);
    return (
      <div
        id="Home"
        className="app__page"
        ref={(el) => { this.container = el; }}
        disabled
      >
        <Scrollable
          className="fs-home open"
          id="MainScroll"
          style={{ backgroundColor: 'transparent' }}
          toTop
        >
          <Hero goTo="HomePress" onLoad={mapLoading} />
          <Section className="call-to-action style-2 bg-light">
            <Container>
              <Row>
                <div className="col-xs-12 text-center">
                  <h2>¿Necesitas más información? ¡Envíanos tu mensaje!</h2>
                  <div className="cta-button">
                    <Linked url="/contacto" className="btn btn-md btn-color rounded">
                      Contacto
                    </Linked>
                  </div>
                </div>
              </Row>
            </Container>
          </Section>
          <Footer id="Footer" />
        </Scrollable>
      </div>
    );
  }
}

Home.defaultProps = {
  mapLoading: () => { },
};

Home.propTypes = {
  mapLoading: PropTypes.func,
};

const mapStateToProps = state => ({
  common: state.common,
  esri: state.esri,
  info: state.info,
});

const mapDispatchToProps = {
  mapLoading: setLoader,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
