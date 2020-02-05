import React, { Component } from 'react';
import PropTypes from 'prop-types';

import $ from '../../../helpers/helper-jquery';
import { throttle } from '../../../helpers/helper-util';
import { FADEIN } from '../../../helpers/helper-constants';

class Appear extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHide: true,
      appeared: false,
    };
    this.throttledScroll = throttle(this.throttledScroll.bind(this), 200);
    this.prev = 0;
  }

  componentDidMount() {
    this.scroll = document.getElementById('MainScroll');
    this.scroll.addEventListener('scroll', this.throttledScroll);
    setTimeout(() => { this.scroll.dispatchEvent(new Event('scroll')); }, 500);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { isHide } = this.state;
    // console.log('shouldComponentUpdate', isHide !== nextState.isHide);
    return isHide !== nextState.isHide;
  }

  componentWillUnmount() {
    this.scroll.removeEventListener('scroll', this.throttledScroll);
  }

  throttledScroll() {
    const { onAppear } = this.props;
    const { isHide, appeared } = this.state;
    const top = $('#MainScroll').height();
    if ($(this.appearEl).offset().top < top && isHide && !appeared) {
      onAppear();
      this.setState({ isHide: false, appeared: true });
    }

    this.prev = $(this.appearEl).offset().top;
  }

  render() {
    const { children, className, fade } = this.props;
    const { isHide } = this.state;
    const classHide = isHide ? '' : '';
    const active = isHide ? FADEIN.inactive : FADEIN.active;
    const style = fade ? active : {};
    return (
      <div
        ref={(el) => { this.appearEl = el; }}
        className={`${classHide} ${className}`}
        style={style}
      >
        {children}
      </div>
    );
  }
}

Appear.defaultProps = {
  className: '',
  onAppear: () => {},
  fade: true,
};

Appear.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.any),
  ]).isRequired,
  className: PropTypes.string,
  onAppear: PropTypes.func,
  fade: PropTypes.bool,
};

export default Appear;
