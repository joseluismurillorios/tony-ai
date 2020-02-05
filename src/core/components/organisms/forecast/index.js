import React, { Component } from 'react';
import PropTypes from 'prop-types';
import OwlCarousel from 'react-owl-carousel';

import Clock from '../../atoms/clock';
import { getWeatherIcon, getWeatherDateObj } from '../../../helpers/helper-weather';

const forecastConfig = {
  responsive: {
    0: {
      items: 3,
    },
    768: {
      items: 3,
    },
    979: {
      items: 5,
    },
  },
  responsiveDay: {
    0: {
      items: 2,
    },
    768: {
      items: 2,
    },
    979: {
      items: 4,
    },
  },
  navigationText: ['<i class=\'implanf-chevron-left\'></i>', '<i class=\'implanf-chevron-right\'></i>'],
  slideBy: 'page',
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
          <h5 className="mt-0">
            Tijuana
            <small>
              <span>    |    </span>
              <Clock />
            </small>
          </h5>
          <div className="weather-info clearfix pt-10">
            <div className="weather-main">
              <ul className="week-days day-info">
                <li>
                  {humidity}
                  <small> %</small>
                  <span><small>Humedad</small></span>
                </li>
              </ul>
            </div>
            <div className="weather-main weather-temp">
              <div className="weather-icon text-center">
                <i className={icon} />
                <span className="temp-main pt-10">
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
          <div className="text-center mb-20">
            <span className="btn btn-color btn-sm rounded uppercase">{description}</span>
          </div>
          {
            forecastMetric && forecastMetric.list && (
              <OwlCarousel
                className="week-days owl-theme"
                responsive={forecastConfig.responsive}
                navText={forecastConfig.navigationText}
                slideBy={forecastConfig.slideBy}
                nav
              >
                {
                  forecastMetric.list.map((obj) => {
                    const { dt, main, weather } = obj;
                    const { id: idn, icon: ic } = weather[0];
                    const date = getWeatherDateObj(dt);
                    const icn = getWeatherIcon(idn, ic.indexOf('n') > -1);
                    return (
                      <li key={dt} className="capitalize">
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
              </OwlCarousel>
            )
          }
        </div>
      </div>
    );
  }
}

Forecast.defaultProps = {
  forecast: {},
};

Forecast.propTypes = {
  forecast: PropTypes.objectOf(
    PropTypes.any,
  ),
};

export default Forecast;
