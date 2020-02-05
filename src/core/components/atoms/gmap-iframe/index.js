/* eslint-disable react/jsx-no-target-blank */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Loader from '../loader';
import Linked from '../linked';

import $ from '../../../helpers/helper-jquery';

class GmapIframe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHide: true,
      loaded: false,
    };
    this.onLoad = this.onLoad.bind(this);
    this.toggleMap = this.toggleMap.bind(this);
  }

  componentDidMount() {
    $('.mfp-pop').magnificPopup({
      type: 'iframe',
      disableOn: () => {
        if ($(window).width() < 0) {
          return false;
        }
        return true;
      },
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { url, visible } = this.props;
    const { isHide, loaded } = this.state;

    const should = !!(
      url !== nextProps.url
      || visible !== nextProps.visible
      || isHide !== nextState.isHide
      || loaded !== nextState.loaded
    );

    return should;
  }

  onLoad() {
    this.setState({
      loaded: true,
    });
  }

  toggleMap() {
    const { isHide } = this.state;
    this.setState({
      isHide: !isHide,
    });
  }

  render() {
    const { url, visible, title } = this.props;
    const { isHide, loaded } = this.state;
    const isVisible = (!isHide || visible);
    const opened = isVisible ? 'opened' : '';
    const text = isHide ? 'Ver Mapa' : 'Ocultar Mapa';
    return (
      <div style={{ overflow: 'hidden', flexDirection: 'column' }}>
        {
          !visible && (
            <div className={`gmap-btns flex-center ${opened}`}>
              <button type="button" className="flex-center" onClick={this.toggleMap}>
                {title || text}
                <i className={`esricon-${!isHide ? 'non-' : ''}visible ml-10`} />
              </button>
              <Linked newTab url={url} className="mfp-pop flex-center">
                <i className="esricon-zoom-out-fixed" />
              </Linked>
              <Linked newTab url={url.replace(/[/]embed[/]/, '/search/')} className="flex-center">
                <i className="esricon-launch-link-external" />
              </Linked>
            </div>
          )
        }
        <div className={`gmap gmap-hidden ${opened}`}>
          {
            (!loaded) && (
              <Loader className="gmap bg-light" />
            )
          }
          {
            (isVisible || loaded) && (
              <iframe
                title="implan"
                width="100%"
                height={400}
                src={url}
                frameBorder={0}
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                onLoad={this.onLoad}
              />
            )
          }
        </div>
        {
          visible && (
            <div className="flex-center mt-20">
              <Linked newTab url={url} className="mfp-pop btn btn-dark flex-center ">
                <small>Expandir</small>
                <i className="esricon-zoom-out-fixed ml-10" />
              </Linked>
              <Linked newTab url={url.replace(/[/]embed[/]/, '/search/')} className="btn btn-dark flex-center ml-10">
                <small>Abrir</small>
                <i className="esricon-launch-link-external ml-10" />
              </Linked>
            </div>
          )
        }
      </div>
    );
  }
}

GmapIframe.defaultProps = {
  title: false,
  visible: false,
};

GmapIframe.propTypes = {
  url: PropTypes.string.isRequired,
  title: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  visible: PropTypes.bool,
};

export default GmapIframe;
