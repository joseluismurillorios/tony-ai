import React, { Component } from 'react';
import PropTypes from 'prop-types';

const dict = {
  loading: {
    en: 'Processing',
    es: 'Procesando',
  },
  default: {
    en: 'Select files...',
    es: 'Seleccionar...',
  },
  error: {
    en: 'Error',
    es: 'Error',
  },
  success: {
    en: 'Files',
    es: 'Archivos',
  },
};

class File extends Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 0,
    };

    this.enter = this.enter.bind(this);
    this.update = this.update.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.renderLabel = this.renderLabel.bind(this);
  }

  enter(ev) {
    if (ev.key === 'Enter') {
      const { onTap } = this.props;
      onTap();
    }
  }

  update(e) {
    const { onChange, name } = this.props;
    onChange({
      value: e.target.value,
      name,
    });
  }

  handleChange(e) {
    const { onChange } = this.props;
    this.setState({ count: e.target.files.length });
    onChange(e);
  }

  renderLabel(text) {
    const { status, className } = this.props;
    const { count } = this.state;
    switch (status) {
      case 'default': {
        return (
          <label htmlFor="file" className={`btn btn-md ${className}`}>
            {text}
          </label>
        );
      }
      case 'loading': {
        return (
          <label htmlFor="file" className={`btn btn-md btn-color ${className}`}>
            <div className="loading">
              <div className="double-pulse" />
              <div className="double-pulse" />
            </div>
            {text}
          </label>
        );
      }
      case 'success': {
        return (
          <label htmlFor="file" className={`btn btn-md btn-success ${className}`}>
            <span>
              {`${count} ${text}`}
            </span>
          </label>
        );
      }
      case 'error': {
        return (
          <label htmlFor="file" className={`btn btn-md btn-red ${className}`}>
            {text}
          </label>
        );
      }
      default: {
        return (
          <span>
            {text}
          </span>
        );
      }
    }
  }

  render() {
    const { lang, status, id } = this.props;
    const text = dict[status][lang];
    return (
      <div>
        {
          this.renderLabel(text)
        }
        <input
          id={id}
          type="file"
          className="file-select"
          accept="image/*"
          multiple
          onChange={this.handleChange}
          style={{ display: 'none' }}
        />
      </div>
    );
  }
}

File.defaultProps = {
  onChange: (v) => { console.log(v.target.files); },
  onTap: () => {},
  id: '',
  className: '',
  lang: 'es',
  status: 'default',
  name: 'file',
};

File.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  lang: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  onTap: PropTypes.func,
  status: PropTypes.string,
};

export default File;
