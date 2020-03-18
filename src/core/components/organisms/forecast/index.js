import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Slider from '../../molecules/glide';

const config = {
  perView: 3,
  // bullets: false,
  type: 'carousel',
  breakpoints: {
    541: {
      perView: 2,
    },
    768: {
      perView: 2,
    },
    979: {
      perView: 3,
    },
  },
};

class Forecast extends Component {
  constructor(props) {
    super(props);
    this.getValues = this.getValues.bind(this);
    this.onMove = this.onMove.bind(this);

    this.state = {
      index: 0,
    };
  }

  onMove(newIndex) {
    const {
      index,
    } = this.state;
    if (newIndex !== index) {
      this.setState({ index: newIndex });
    }
  }

  getValues() {
    const { weatherMetric } = this.props;
    if (weatherMetric) {
      if (weatherMetric.main) {
        const {
          icon,
          description,
          wind,
          main,
        } = weatherMetric;
        const { temp, humidity } = main;
        return {
          icon,
          description,
          wind: wind.speed,
          temp,
          humidity,
        };
      }
    }

    return {
      icon: 'implanf-delete',
      description: 'n/a',
      wind: '0',
      temp: '0',
      humidity: '0',
    };
  }


  render() {
    const {
      hidden,
      forecastList,
    } = this.props;
    const {
      index,
    } = this.state;
    const {
      humidity,
      icon,
      temp,
      wind,
      description,
    } = this.getValues();
    const gC = (<small> C</small>);
    // console.log(forecastList);
    return (
      <div className="widget weather">
        <div className="weather-box">
          <div className="weather-info clearfix pt-10">
            <div className="weather-main">
              <ul className="week-days day-info">
                <li>
                  <span>
                    {humidity}
                    <small> %</small>
                  </span>
                  <span><small>Humedad</small></span>
                </li>
              </ul>
            </div>
            <div className="weather-main weather-temp">
              <div className="weather-icon text-center">
                <i className={icon} />
                <span className="temp-main mt-10">
                  {temp}
                  °
                  {gC}
                </span>
              </div>
            </div>
            <div className="weather-main">
              <ul className="week-days day-info">
                <li>
                  {wind}
                  <small> km/h</small>
                  <span><small>Viento</small></span>
                </li>
              </ul>
            </div>
          </div>
          <div className="weather-desc text-center">
            <span className="btn btn-gradient btn-sm rounded uppercase">{description}</span>
          </div>
          {
            forecastList && !hidden && (
              <Slider
                className="week-days owl-theme mt-40"
                slideBy="page"
                config={config}
                id="ForecastModal"
                startAt={index}
                onMove={this.onMove}
              >
                {
                  Object.keys(forecastList).map((key) => {
                    const obj = forecastList[key];
                    const {
                      // dt,
                      main,
                      date,
                      icn,
                    } = obj;
                    return (
                      <li key={date.date} className="week-day capitalize">
                        <span>{date.day.replace('.', '')}</span>
                        <span><small>{date.hour}</small></span>
                        <span className={icn} />
                        {main.temp}
                        °
                        {gC}
                      </li>
                    );
                  })
                }
              </Slider>
            )
          }
        </div>
      </div>
    );
  }
}

Forecast.defaultProps = {
  hidden: false,
  weatherMetric: {},
  forecastList: {},
};

Forecast.propTypes = {
  hidden: PropTypes.bool,
  weatherMetric: PropTypes.objectOf(PropTypes.any),
  forecastList: PropTypes.objectOf(PropTypes.any),
};

export default Forecast;
