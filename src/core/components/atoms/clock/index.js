import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import dayjs from '../../../helpers/helper-date';

const Clock = ({
  className,
  format,
  interval,
}) => {
  const clock = useRef(null);
  let intervalID = null;
  useEffect(() => {
    intervalID = setInterval(
      () => {
        const time = dayjs().format(format);
        clock.current.innerHTML = time;
      },
      interval,
    );
    return () => {
      clearInterval(intervalID);
    };
  });
  return (
    <span className={`clock ${className}`} ref={clock} />
  );
};

Clock.defaultProps = {
  className: '',
  format: 'MMM DD hh:mm A',
  interval: 1000,
};

Clock.propTypes = {
  className: PropTypes.string,
  format: PropTypes.string,
  interval: PropTypes.number,
};

export default Clock;
