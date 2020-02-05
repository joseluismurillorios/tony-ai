import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';

function transitions({ duration }) {
  return {
    'fade-default': {
      transition: `opacity ${duration}ms ease-in`,
      opacity: 0,
    },

    'fade-entering': {
      opacity: 0,
    },

    'fade-entered': {
      opacity: 1,
    },

    'fade-exiting': {
      opacity: 0,
    },

    'fade-exited': {
      opacity: 0,
    },
  };
}

class TextRotator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: null,
      index: 0,
      entered: false,
    };

    this.willUnmount = false;

    this.interval = null;

    this.timeOut = null;

    this.trigger = this.trigger.bind(this);
    this.next = this.next.bind(this);
    this.setCurrent = this.setCurrent.bind(this);
  }

  componentDidMount() {
    this.trigger();
  }

  componentWillUnmount() {
    this.willUnmount = true;
    clearInterval(this.interval);
    clearTimeout(this.timeOut);
  }

  setCurrent(item) {
    if (!this.willUnmount) {
      const { time, transitionTime } = this.props;
      this.setState({ current: item, entered: true });
      setTimeout(() => {
        if (!this.willUnmount) {
          this.setState({ entered: false });
        }
      }, time - transitionTime);
    }
  }

  next() {
    if (!this.willUnmount) {
      const { content } = this.props;
      const { current, index } = this.state;
      const currentStep = index;
      const total = content.length || 0;

      let i = 0;

      if (current) {
        i = (total === currentStep + 1) ? 0 : currentStep + 1;
      }

      const curr = content[i];
      this.setState({ index: i });
      this.setCurrent(curr);
    }
  }

  trigger() {
    const { content, startDelay, time } = this.props;

    if (content.length > 0) {
      this.timeOut = setTimeout(() => {
        this.next();
        this.interval = setInterval(() => this.next(), time);
      }, startDelay);
    }
  }

  render() {
    const { transitionTime, content } = this.props;
    const { current, index, entered } = this.state;
    const { className, animation = 'fade', text } = current || (content && content[0]) || {};
    const styles = transitions({ duration: transitionTime });

    if (!text) return <span />;

    return (
      <Transition in={entered} timeout={transitionTime}>
        {state => (
          <span
            key={index}
            className={className}
            style={{ ...styles[`${animation}-default`], ...styles[`${animation}-${state}`] }}
          >
            {text}

          </span>
        )}
      </Transition>
    );
  }
}

TextRotator.defaultProps = {
  time: 2500,
  startDelay: 250,
  transitionTime: 500,
};

TextRotator.propTypes = {
  content: PropTypes.arrayOf(
    PropTypes.any,
  ).isRequired,
  time: PropTypes.number,
  startDelay: PropTypes.number,
  transitionTime: PropTypes.number,
};

export default TextRotator;
