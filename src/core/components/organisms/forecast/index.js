import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Slider from '../../molecules/glide';
import { getWeatherIcon, getWeatherDateObj } from '../../../helpers/helper-weather';

const config = {
  perView: 3,
  bullets: false,
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
    this.getValue = this.getValues.bind(this);
  }

  getValues() {
    const { forecast } = this.props;
    if (forecast.weatherMetric) {
      const { weatherMetric, forecastMetric } = forecast;
      if (weatherMetric.main) {
        const {
          weather,
          main,
          wind,
        } = weatherMetric;
        const { id, description, icon } = weather[0];
        const icn = getWeatherIcon(id, icon.indexOf('n') > -1);
        const { temp, humidity } = main;
        return {
          icon: icn,
          description,
          wind: wind.speed,
          temp,
          humidity,
          forecastMetric,
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
    } = this.props;
    const {
      humidity,
      icon,
      temp,
      wind,
      description,
      forecastMetric,
    } = this.getValues();
    const gC = (<small> C</small>);
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
            forecastMetric && forecastMetric.list && !hidden && (
              <Slider
                className="week-days owl-theme mt-40"
                slideBy="page"
                config={config}
              >
                {
                  forecastMetric.list.map((obj) => {
                    const { dt, main, weather } = obj;
                    const { id: idn, icon: ic } = weather[0];
                    const date = getWeatherDateObj(dt);
                    const icn = getWeatherIcon(idn, ic.indexOf('n') > -1);
                    return (
                      <li key={dt} className="week-day capitalize">
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
  forecast: {},
  hidden: false,
};

Forecast.propTypes = {
  forecast: PropTypes.objectOf(
    PropTypes.any,
  ),
  hidden: PropTypes.bool,
};

export default Forecast;
