import React, { Component } from 'react';
import PropTypes from 'prop-types';

import $ from '../../../helpers/helper-jquery';
import { isMac } from '../../../helpers/helper-util';

class Scrollable extends Component {
  constructor(props) {
    super(props);
    this.wheel = this.wheel.bind(this);
    this.handle = this.handle.bind(this);
    this.scroll = this.scroll.bind(this);
    this.goTop = this.goTop.bind(this);
    this.goUp = true;
    this.end = null;
    this.interval = null;
    this.animationInterval = 15;
    this.scrollSpeed = 15;
  }

  componentDidMount() {
    const {
      toTop,
    } = this.props;
    if (isMac) {
      this.scrollable.addEventListener('wheel', this.wheel, false);
    }
    if (toTop) {
      this.scrollable.addEventListener('scroll', this.scroll, false);
      this.top.addEventListener('click', this.goTop, false);
    }
  }

  componentWillUnmount() {
    const {
      toTop,
    } = this.props;
    if (this.interval) {
      clearInterval(this.interval);
    }
    if (isMac) {
      this.scrollable.removeEventListener('wheel', this.wheel, false);
    }
    if (toTop) {
      this.scrollable.removeEventListener('scroll', this.scroll, false);
      this.top.removeEventListener('click', this.goTop, false);
    }
  }

  wheel(event) {
    let delta = 0;
    if (event.wheelDelta) {
      delta = event.wheelDelta / 120;
    } else if (event.detail) {
      delta = -event.detail / 3;
    }
    this.handle(delta);
    if (event.preventDefault) {
      event.preventDefault();
    }
    // eslint-disable-next-line no-param-reassign
    event.returnValue = false;
  }

  handle(delta) {
    if (this.end == null) {
      this.end = this.scrollable.scrollTop;
    }
    this.end -= 20 * delta;
    this.goUp = delta > 0;

    if (this.interval == null) {
      this.interval = setInterval(() => {
        const { scrollTop } = this.scrollable;
        const step = Math.round((this.end - scrollTop) / this.scrollSpeed);
        const innerRect = this.inner.getBoundingClientRect();

        if ((scrollTop <= 0)
          || (scrollTop >= innerRect.height - this.scrollable.clientHeight)
          || (this.goUp && step > -1)
          || (!this.goUp && step < 1)) {
          clearInterval(this.interval);
          this.interval = null;
          this.end = null;
        }
        this.scrollable.scrollTop = scrollTop + step;
      }, this.animationInterval);
    }
  }

  scroll() {
    const { scrollTop } = this.scrollable;
    if (scrollTop >= 50) {
      this.top.classList.add('show');
    } else {
      this.top.classList.remove('show');
    }
  }

  goTop() {
    $(this.scrollable).animate({ scrollTop: 0 }, 800, 'easeInOutQuart');
  }

  render() {
    const {
      children,
      className,
      id,
      setRef,
      disabled,
      toTop,
    } = this.props;
    return (
      <div
        id={id}
        className={disabled ? 'nonscrollable' : 'scrollable'}
        ref={(el) => {
          this.scrollable = el;
          setRef(el);
        }}
      >
        <div
          className={className}
          ref={(el) => { this.inner = el; }}
        >
          {children}
        </div>
        {
          toTop && (
            <div ref={(el) => { this.top = el; }} className="back-to-top">
              <i className="implanf-expand_less" />
            </div>
          )
        }
      </div>
    );
  }
}

Scrollable.defaultProps = {
  className: '',
  id: '',
  setRef: () => {},
  disabled: false,
  toTop: false,
};

Scrollable.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.any),
  ]).isRequired,
  className: PropTypes.string,
  id: PropTypes.string,
  setRef: PropTypes.func,
  disabled: PropTypes.bool,
  toTop: PropTypes.bool,
};

export default Scrollable;
