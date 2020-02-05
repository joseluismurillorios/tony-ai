import React from 'react';
import PropTypes from 'prop-types';


import { getDate, getDateHour } from '../../../helpers/helper-date';

class Clock extends React.Component {
  componentDidMount() {
    const { noseconds } = this.props;
    this.intervalID = setInterval(
      () => {
        const time = noseconds ? getDateHour() : getDate();
        this.clock.innerHTML = time;
      },
      1000,
    );
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  render() {
    return (
      <span className="clock capitalize" ref={(el) => { this.clock = el; }} />
    );
  }
}

Clock.defaultProps = {
  noseconds: false,
};

Clock.propTypes = {
  noseconds: PropTypes.bool,
};

export default Clock;
