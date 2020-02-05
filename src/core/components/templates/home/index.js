/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Container from '../../atoms/container';
import Section from '../../atoms/section';
import Linked from '../../atoms/linked';
import Scrollable from '../../atoms/scrollable';

import LightBox from '../../molecules/light-box';

import Hero from '../../organisms/hero';
import Footer from '../../organisms/footer';
import IconBox from '../../organisms/icon-box';
import WidgetSite from '../../organisms/widgets';

import { ROUTES } from '..';

import { setLoader } from '../../../redux/actions/common';

import dict from '../../../dict';
import assets from '../../../assets';
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
          <Section id="HomePress" className="icon-boxes style-5">
            <div className="container-fluid">
              <IconBox />
            </div>
          </Section>
          <Section className="promo-section bg-dark style-2">
            <Container className="flex-center">
              <div className="col-md-7 mb-mdm-40">
                <h3 className="color-white">TonyAI TonyAI WEB</h3>
                <p className="color-white">
                  {dict.es['presentation.one']}
                  <br />
                  <br />
                  {dict.es['presentation.two']}
                  <br />
                  <br />
                  {dict.es['presentation.three']}
                </p>
                <Linked url="/reportes" className="btn btn-md btn-light mt-20">Explorar</Linked>
              </div>
              <div className="col-md-5 text-center">
                <img
                  src={assets.device}
                  alt=""
                  className="wow fadeInRight"
                  data-wow-duration="1s"
                  data-wow-delay=".2s"
                  style={{
                    maxHeight: '480px',
                  }}
                />
              </div>
            </Container>
          </Section>
          <Section className="pt-50">
            <Container>
              <div className="col-md-9">
                <h2 className="heading relative heading-small uppercase bottom-line style-2 left-align mb-0">
                  Video Institucional
                </h2>
                <LightBox video="y1SJsPg947E" />
              </div>
              <aside className="col-md-3 sidebar">
                <WidgetSite routes={ROUTES} />
              </aside>
            </Container>
          </Section>
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
