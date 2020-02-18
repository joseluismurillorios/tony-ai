import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import dayjs from '../../../helpers/helper-date';

const Clock = ({
  format,
}) => {
  const clock = useRef(null);
  let intervalID = null;
  useEffect(() => {
    intervalID = setInterval(
      () => {
        const time = dayjs().format(format);
        clock.current.innerHTML = time;
      },
      1000,
    );
    return () => {
      clearInterval(intervalID);
    };
  });
  return (
    <span className="clock" ref={clock} />
  );
};

Clock.defaultProps = {
  format: 'MMM DD hh:mm A',
};

Clock.propTypes = {
  format: PropTypes.string,
};

export default Clock;
