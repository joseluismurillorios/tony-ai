import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Checkbox extends Component {
  constructor(props) {
    super(props);
    const {
      type,
    } = this.props;
    this.parseNum = num => (type === 'number' ? parseInt((num.replace(/,/g, '')), 10) : num);

    this.enter = this.enter.bind(this);
    this.focus = this.focus.bind(this);
    this.update = this.update.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    const {
      focus,
    } = this.props;
    if (focus) {
      this.focus();
    }
  }

  enter(ev) {
    const {
      id,
      onTap,
    } = this.props;
    if (ev.key === 'Enter') {
      onTap();
      console.log('enter', id);
    }
  }

  focus() {
    const {
      id,
    } = this.props;
    this.input = document.getElementById(id);
    try {
      this.input.select();
    } catch (err) {
      this.input.selectionStart = 0;
      this.input.selectionEnd = this.input.value.length + 1;
    }
  }

  update(e) {
    const {
      id,
      onChange,
    } = this.props;
    onChange({
      value: e.target.value,
      name: id,
    });
  }

  handleClick() {
    const {
      leftClick,
    } = this.props;
    if (leftClick) {
      leftClick();
    } else {
      this.focus();
    }
  }

  render() {
    const {
      id,
      value,
      checked,
      tabIndex,
      disabled,
      className,
    } = this.props;
    return (
      <div>
        <input
          type="checkbox"
          className="input-checkbox"
          name={id}
          id={id}
          value={value}
          defaultChecked={checked}
          onChange={this.update}
          tabIndex={tabIndex}
          disabled={disabled}
        />
        <label htmlFor={id} className={className}>{value}</label>
      </div>
    );
  }
}

Checkbox.defaultProps = {
  onChange: console.log,
  leftClick: console.log,
  onTap: console.log,
  type: 'text',
  disabled: false,
  checked: false,
  focus: false,
  tabIndex: '-100',
  value: '',
  className: '',
};

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.string,
  leftClick: PropTypes.func,
  onChange: PropTypes.func,
  onTap: PropTypes.func,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  checked: PropTypes.bool,
  tabIndex: PropTypes.string,
  className: PropTypes.string,
  focus: PropTypes.bool,
};

export default Checkbox;
