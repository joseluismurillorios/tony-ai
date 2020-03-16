/* eslint-disable react/jsx-no-target-blank */
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Glide from '@glidejs/glide';

const defaultConfig = {
  type: 'carousel',
  startAt: 0,
  perView: 5,
  autoplay: false,
  hoverpause: true,
  gap: 0,
  bullets: true,
  arrows: true,
  breakpoints: {
    541: {
      perView: 2,
    },
    768: {
      perView: 3,
    },
    979: {
      perView: 5,
    },
  },
};

const Glides = ({
  children,
  id,
  className,
  config,
  // onMove,
  startAt,
}) => {
  const options = {
    ...defaultConfig,
    ...config,
  };
  const {
    perView,
    bullets,
    arrows,
  } = options;
  const contEl = useRef(null);
  let glide = null;
  useEffect(() => {
    if (children.length > 0) {
      if (glide) {
        glide.destroy();
      }
      glide = new Glide(contEl.current, {
        ...options,
        startAt,
      });
      // glide.on('move', () => {
      //   onMove(glide.index);
      // });
      glide.mount();
    }
    return () => {
      if (glide) {
        glide.destroy();
      }
    };
  }, [children]);
  return (
    <div
      id={id}
      className={`glide ${className}`}
      ref={contEl}
    >
      <div data-glide-el="track" className="glide__track">
        <div className="glide__slides">
          {
            React.Children.map(children, child => <div className="glide__slide">{child}</div>)
          }
        </div>
        {
          arrows && (
            <div className="glide__arrows" data-glide-el="controls">
              <button type="button" className="glide__arrow glide__arrow--left" data-glide-dir="<"><i className="implanf-chevron-left" /></button>
              <button type="button" className="glide__arrow glide__arrow--right" data-glide-dir=">"><i className="implanf-chevron-right" /></button>
            </div>
          )
        }
        {
          bullets && (
            <div className="glide__bullets" data-glide-el="controls[nav]">
              {
                React.Children.map(children, (_, i) => (
                  <button type="button" className={`glide__bullet ${i % perView === 0 ? '' : 'hidden'}`} data-glide-dir={`=${i}`} />
                ))
              }
            </div>
          )
        }
      </div>
    </div>
  );
};


Glides.defaultProps = {
  id: '',
  className: '',
  config: {},
  // onMove: () => {},
  startAt: 0,
};

Glides.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.any),
  ]).isRequired,
  id: PropTypes.string,
  className: PropTypes.string,
  config: PropTypes.objectOf(PropTypes.any),
  // onMove: PropTypes.func,
  startAt: PropTypes.number,
};

export default Glides;
