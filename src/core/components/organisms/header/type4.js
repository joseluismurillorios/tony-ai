/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/href-no-hash */
/* eslint-disable jsx-a11y/anchor-has-content */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import $ from '../../../helpers/helper-jquery';
import { debounce } from '../../../helpers/helper-util';

import Logo from '../../atoms/logo';

// import assets from '../../../assets';

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.setRef = this.setRef.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.debouncedSearch = debounce(this.debouncedSearch.bind(this), 1000);
  }

  componentDidMount() {
    $(document).click((e) => {
      const clickover = $(e.target);
      const opened = $('.navbar-collapse').hasClass('collapse in');
      if (opened === true && !clickover.hasClass('navbar-toggle')) {
        $('button.navbar-toggle').click();
      }
    });

    $('.search-wrap, .trigger-search').on('click', (e) => {
      e.stopPropagation();
    });
  }

  onSearch(e) {
    this.searchTerm = e.target.value;
    this.debouncedSearch();
  }

  setRef(input) {
    this.childRef = input;
  }

  debouncedSearch() {
    const { searchItems } = this.props;
    searchItems({ searchTerm: this.searchTerm });
  }

  render() {
    const { setRef, isStandalone } = this.props;
    return (
      <header
        className="nav-type-4"
        ref={setRef}
      >
        {
          isStandalone && (
            <div className="app__statusbar" />
          )
        }
        <div className="top-bar hidden-xs">
          <div className="container">
            <div className="row">
              <div className="top-bar-links">

                <ul className="col-sm-6">
                  <li className="top-bar-date">
                    <span>Blvd. Cuauhtémoc #2340, Tijuana, B.C.</span>
                  </li>
                </ul>

                <ul className="col-sm-6 top-bar-acc text-right">
                  <li className="social-icons dark">
                    <a href="#"><span className="implanf-twitter" /></a>
                    <a href="#"><span className="implanf-facebook" /></a>
                  </li>
                  <li className="top-bar-link"><a href="#">Registro</a></li>
                  <li className="top-bar-link"><a href="#">Entrar</a></li>
                </ul>

              </div>
            </div>
          </div>
        </div>

        <nav className="navbar navbar-static-top">
          <div className="navigation">
            <div className="container-fluid relative">

              <div className="row">

                <div className="navbar-header container">
                  <div className="row">
                    <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navbar-collapse">
                      <span className="sr-only">Toggle navigation</span>
                      <span className="icon-bar" />
                      <span className="icon-bar" />
                      <span className="icon-bar" />
                    </button>
                  </div>
                </div>

                <div className="header-wrap">

                  <div className="container">
                    <div className="row">
                      <div className="logo-container">
                        <div className="logo-wrap text-center">
                          <a href="index.html">
                            <Logo />
                          </a>
                        </div>
                      </div>

                      {/* <div className="header-ad hidden-sm hidden-xs">
                        <a href="#">
                          <img src={banner} alt="" />
                        </a>
                      </div> */}

                    </div>
                  </div>

                </div>

                <div className="nav-wrap">
                  <div className="container">
                    <div className="row">
                      <div className="collapse navbar-collapse" id="navbar-collapse">

                        <ul className="nav navbar-nav">

                          <li id="mobile-search" className="hidden-lg hidden-md">
                            <form method="get" className="mobile-search relative">
                              <input type="search" className="form-control" placeholder="Buscar..." />
                              <button type="submit" className="search-button">
                                <i className="icon icon_search" />
                              </button>
                            </form>
                          </li>

                          <li className="nav-home hidden-sm hidden-xs">
                            <a href="#"><span className="icon_house implanf-home" /></a>
                          </li>

                          <li className="dropdown active">
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown">Inicio</a>
                            <ul className="dropdown-menu">
                              <li><a href="#">Presentación</a></li>
                              <li><a href="#">Video Institucional</a></li>
                              <li><a href="#">Mapa de Contenido</a></li>
                            </ul>
                          </li>

                          <li className="dropdown">
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown">Noticias</a>
                            <ul className="dropdown-menu">
                              <li><a href="#">Gobierno</a></li>
                              <li><a href="#">COMUNITI</a></li>
                              <li><a href="#">Tiempo</a></li>
                              <li><a href="#">Condiciones Clim.</a></li>
                              <li><a href="#">Eventos Y Congresos</a></li>
                              <li><a href="#">Árticulos</a></li>
                            </ul>
                          </li>

                          <li className="dropdown">
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown">Nosotros</a>
                            <ul className="dropdown-menu">
                              <li><a href="#">Objectivos</a></li>
                              <li><a href="#">Misión</a></li>
                              <li><a href="#">Visión</a></li>
                              <li><a href="#">Instituciones y Empresas Participantes</a></li>
                              <li><a href="#">COMUNITI Mesa de R. Y R.</a></li>
                            </ul>
                          </li>

                          <li className="dropdown">
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown" title="Mapas Temáticos">Mapas</a>
                            <ul className="dropdown-menu">
                              <li><a href="#">Tijuana 2014</a></li>
                              <li><a href="#">Rosarito 2018</a></li>
                              <li><a href="#">PMDU Y PDUCP</a></li>
                              <li><a href="#">Links a Páginas externas</a></li>
                              <li><a href="#">Estudios Expeciales</a></li>
                              <li><a href="#">Contribuciones</a></li>
                            </ul>
                          </li>

                          <li className="dropdown">
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown">Contacto</a>
                            <ul className="dropdown-menu">
                              <li><a href="#">TonyAI</a></li>
                              <li><a href="#">Colegios</a></li>
                              <li><a href="#">Correos</a></li>
                              <li><a href="#">Encuestas</a></li>
                            </ul>
                          </li>

                          <li className="dropdown">
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown">Herramientas</a>
                            <ul className="dropdown-menu">
                              <li><a href="#">Software Open Source</a></li>
                              <li><a href="#">Lineamientos</a></li>
                              <li><a href="#">Formatos</a></li>
                              <li><a href="#">Herramientas de Cálculo</a></li>
                              <li><a href="#">Área de niños</a></li>
                              <li><a href="#">Plataforma Para Solicitar Op. de Riesgo</a></li>
                              <li><a href="#">Participación Ciudadana</a></li>
                              <li><a href="#">MOOC</a></li>
                            </ul>
                          </li>

                          <li className="dropdown">
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown">Información</a>
                            <ul className="dropdown-menu">
                              <li><a href="#">Docs. de Planeación Riesgos, Vigentes</a></li>
                              <li><a href="#">Marco Normativo</a></li>
                              <li><a href="#">TR Para Estudios Y Proyectos</a></li>
                              <li><a href="#">Estudios Especiales Para Desco</a></li>
                              <li><a href="#">Contribuciones</a></li>
                            </ul>
                          </li>
                        </ul>
                      </div>

                    </div>
                  </div>

                </div>

              </div>
            </div>
          </div>
        </nav>
      </header>
    );
  }
}

NavBar.defaultProps = {
  searchItems: () => {},
  setRef: () => {},
  isStandalone: false,
};

NavBar.propTypes = {
  searchItems: PropTypes.func,
  setRef: PropTypes.func,
  isStandalone: PropTypes.bool,
};

const mapStateToProps = state => ({
  router: state.router,
  common: state.common,
});

const mapDispatchToProps = {
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavBar));
