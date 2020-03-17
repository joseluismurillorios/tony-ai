import {
  SET_FORECAST_METRIC,
  SET_WEATHER_METRIC,
  SET_EARTH_PHASES,
  SET_FORECAST_LIST,
} from './constants';

export const setForecastMetric = payload => ({
  type: SET_FORECAST_METRIC,
  payload,
});

export const setForecastList = payload => ({
  type: SET_FORECAST_LIST,
  payload,
});

export const setWeatherMetric = payload => ({
  type: SET_WEATHER_METRIC,
  payload,
});

export const setEarthPhases = payload => ({
  type: SET_EARTH_PHASES,
  payload,
});
