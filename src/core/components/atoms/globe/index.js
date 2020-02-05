import React from 'react';
import PropTypes from 'prop-types';

const Globe = ({
  size,
  phase,
  id,
  type,
}) => {
  const lf = Math.min(3 - 4 * phase, 1);
  const lc = Math.abs(lf * 50);
  const lb = (lf < 0) ? '0' : '1';

  const rf = Math.min(3 + 4 * (phase - 1), 1);
  const rc = Math.abs(rf * 50);
  const rb = (rf < 0) ? '0' : '1';

  const d = `M 60 10 a ${lc} 50, 0, 0 ${lb}, 0 100 a ${rc} 50, 0, 0 ${rb}, 0 -100z`;
  return (
    <div className={type}>
      <svg width={size} height={size} viewBox="0 0 120 120">
        <defs>
          <filter id={`blur-${id}`} x="-10%" width="120%" y="-10%" height="120%">
            <feGaussianBlur in="SourceGraphic" stdDeviation={3} />
          </filter>
          <clipPath id={`phase-path-${id}`}>
            <path
              id={`phase-${id}`}
              fill="#000000"
              d={d}
              clipRule="evenodd"
              // opacity="0.5"
              // filter={`url(#blur-${id})`}
              // transform='rotate(45)'
            />
          </clipPath>
          <mask id={`moon-mask-${id}`}>
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="#FFFFFF"
              opacity="0.8"
            />
            <path
              fill="#000000"
              d={d}
              filter={`url(#blur-${id})`}
            />
          </mask>
        </defs>
        <circle
          cx="60"
          cy="60"
          r="50"
          fill="#000000"
          opacity="0.8"
          mask={`url(#moon-mask-${id})`}
        />
        {/* <circle
          cx="60"
          cy="60"
          r="50"
          fill="#FFFFFF"
          opacity="0.1"
          clipPath={`url(#phase-path-${id})`}
          filter={`url(#blur-${id})`}
        /> */}
      </svg>

    </div>
  );
};

Globe.defaultProps = {
  size: '120px',
  type: 'earth',
  phase: 0.5,
};

Globe.propTypes = {
  id: PropTypes.string.isRequired,
  phase: PropTypes.number,
  type: PropTypes.string,
  size: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

export default Globe;
