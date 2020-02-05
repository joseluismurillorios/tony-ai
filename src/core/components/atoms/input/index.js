import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Input extends Component {
  constructor(props) {
    super(props);
    const { type } = this.props;
    this.parseNum = num => (type === 'number' ? parseInt((num.replace(/,/g, '')), 10) : num);
    this.enter = this.enter.bind(this);
    this.focus = this.focus.bind(this);
    this.update = this.update.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    const { focus } = this.props;
    if (focus) {
      this.focus();
    }
  }

  enter(ev) {
    const { onTap, id } = this.props;
    if (ev.key === 'Enter') {
      onTap();
      console.log('enter', id);
    }
  }

  focus() {
    const { id } = this.props;
    this.input = document.getElementById(id);
    try {
      this.input.select();
    } catch (err) {
      this.input.selectionStart = 0;
      this.input.selectionEnd = this.input.value.length + 1;
    }
  }

  update(e) {
    const { onChange, id } = this.props;
    onChange({
      value: e.target.value,
      name: id,
    });
  }

  handleClick() {
    const { leftClick } = this.props;
    if (leftClick) {
      leftClick();
    } else {
      this.focus();
    }
  }

  render() {
    const {
      id,
      className,
      placeholder,
      setRef,
      type,
      tabIndex,
      disabled,
      value,
    } = this.props;
    return (
      <input
        id={id}
        className={className}
        placeholder={placeholder}
        ref={setRef}
        onFocus={this.focus}
        type={type}
        onChange={this.update}
        onKeyPress={this.enter}
        value={value}
        tabIndex={tabIndex}
        disabled={disabled}
      />
    );
  }
}

Input.defaultProps = {
  onChange: (v) => { console.log(v.name, v.value); },
  setRef: () => {},
  onTap: () => {},
  leftClick: () => {},
  className: '',
  placeholder: '',
  type: 'text',
  disabled: false,
  focus: false,
  tabIndex: '-100',
  value: '',
};

Input.propTypes = {
  id: PropTypes.string.isRequired,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  leftClick: PropTypes.func,
  onChange: PropTypes.func,
  setRef: PropTypes.func,
  onTap: PropTypes.func,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  tabIndex: PropTypes.string,
  focus: PropTypes.bool,
};

export default Input;
