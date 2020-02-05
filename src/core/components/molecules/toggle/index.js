import React, { Component } from 'react';
import PropTypes from 'prop-types';

import jQuery from '../../../helpers/helper-jquery';

class Toggle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
    };
    this.handleToggle = this.handleToggle.bind(this);
  }

  componentDidMount() {
    jQuery(this.panel).hide();
  }

  handleToggle() {
    const { active } = this.state;
    if (!active) {
      jQuery(this.panel).slideDown('easeOutExpo');
    } else {
      jQuery(this.panel).slideUp('easeOutExpo');
    }
    this.setState({
      active: !active,
    });
  }

  render() {
    const { className, children, title } = this.props;
    const { active } = this.state;
    return (
      <div className={`toggle ${className}`}>
        <div ref={(el) => { this.toggle = el; }} className="acc-panel">
          <button className={active ? 'active' : ''} type="button" onClick={this.handleToggle}>{title}</button>
        </div>
        <div ref={(el) => { this.panel = el; }} className="panel-content">
          {children}
        </div>
      </div>
    );
  }
}

Toggle.defaultProps = {
  className: '',
  title: '',
};

Toggle.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.any),
  ]).isRequired,
  className: PropTypes.string,
  title: PropTypes.string,
};

export default Toggle;
