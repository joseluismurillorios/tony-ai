/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import PageTitle from '../../atoms/page-title';
import Container from '../../atoms/container';
import Section from '../../atoms/section';
import Row from '../../atoms/row';

import Footer from '../../organisms/footer';
import Linked from '../../atoms/linked';

import { setLoader } from '../../../redux/actions/common';

import Scrollable from '../../atoms/scrollable';

class NotFound extends Component {
  componentDidMount() {
    const { mapLoading } = this.props;
    mapLoading(false);
  }

  render() {
    const { match } = this.props;
    const path = match.path.substring(1, match.path.length);
    const paths = path.split('/');
    paths.pop();
    return (
      <div
        id="NotFound"
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
          <PageTitle
            text={<span>404</span>}
            paths={paths}
          />
          <Section className="page-404">
            <Container>
              <Row className="text-center">
                <div className="col-md-6 col-md-offset-3">
                  <h1>Ups!</h1>
                  <h2 className="mb-50">Página No Encontrada</h2>
                  <p className="mb-20">
                    Regresar a
                    <Linked url="/" className="ml-10">Inicio</Linked>
                  </p>
                </div>
              </Row>
            </Container>
          </Section>
          <Footer />
        </Scrollable>
      </div>
    );
  }
}

NotFound.defaultProps = {
  mapLoading: () => {},
  match: false,
};

NotFound.propTypes = {
  mapLoading: PropTypes.func,
  match: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]),
};

const mapStateToProps = state => ({
  common: state.common,
  esri: state.esri,
  info: state.info,
});

const mapDispatchToProps = {
  mapLoading: setLoader,
};

export default connect(mapStateToProps, mapDispatchToProps)(NotFound);
