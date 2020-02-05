import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    const {
      onChange,
      id,
      items,
      data,
    } = this.props;
    const value = data ? items[e.target.value] : e.target.value;
    onChange({
      value,
      name: id,
    });
  }


  render() {
    const {
      id,
      className,
      value,
      tabIndex,
      items,
      placeholder,
    } = this.props;
    return (
      <select
        id={id}
        className={`drop ${className}`}
        value={value}
        onChange={this.onChange}
        tabIndex={tabIndex}
        onFocus={this.onFocus}
      >
        <option value="">{placeholder}</option>
        {
          items
            && items.map(el => <option value={el.id} key={el.name}>{el.name}</option>)
        }
      </select>
    );
  }
}

Dropdown.defaultProps = {
  onChange: v => console.log('no onChange', v),
  id: '',
  items: [],
  value: '',
  className: '',
  tabIndex: '-100',
  placeholder: '--Seleccionar--',
  data: false,
};

Dropdown.propTypes = {
  id: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.any),
  onChange: PropTypes.func,
  tabIndex: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  className: PropTypes.string,
  placeholder: PropTypes.string,
  data: PropTypes.bool,
};

export default Dropdown;
