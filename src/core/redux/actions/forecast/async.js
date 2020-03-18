import axios from 'axios';
import { toast } from 'react-toastify';

import {
  setWeatherMetric,
  setEarthPhases,
  setForecastList,
} from './index';
import {
  getForecastList, getWeatherValues,
} from '../../../helpers/helper-weather';

export const onWeatherChange = () => (
  dispatch => (
    setInterval(() => {
      console.log('onWeatherChange');
      axios.get('https://api.openweathermap.org/data/2.5/weather?q=Tijuana,mx&units=metric&lang=es&APPID=e55ac5454485f43016d78b600a54208c')
        .then((response) => {
          const weather = getWeatherValues(response.data);
          console.log(weather);
          dispatch(setWeatherMetric(weather));
        })
        .catch((error) => {
          toast.error(error.message, { autoclose: 2000 });
        });
    }, 3 * 60 * 1000)
  )
);

export const onForecastChange = () => (
  dispatch => (
    setInterval(() => {
      console.log('onForecastChange');
      axios.get('https://api.openweathermap.org/data/2.5/forecast?q=Tijuana,mx&units=metric&lang=es&APPID=e55ac5454485f43016d78b600a54208c')
        .then((response) => {
          // dispatch(setForecastMetric(response.data));
          const list = getForecastList(response.data);
          dispatch(setForecastList(list));
        })
        .catch((error) => {
          toast.error(error.message, { autoclose: 2000 });
        });
    }, 3 * 60 * 1000)
  )
);

export const onPhaseChange = () => (
  dispatch => (
    setInterval(() => {
      dispatch(setEarthPhases());
    }, 3 * 60 * 1000)
  )
);

export const getWeatherMetric = () => (
  dispatch => axios.get('https://api.openweathermap.org/data/2.5/weather?q=Tijuana,mx&units=metric&lang=es&APPID=e55ac5454485f43016d78b600a54208c')
    .then((response) => {
      const weather = getWeatherValues(response.data);
      console.log(weather);
      dispatch(setWeatherMetric(weather));
    })
    .catch((error) => {
      toast.error(error.message, { autoclose: 2000 });
    })
);

export const getForecastMetric = () => (
  (dispatch, getState) => axios.get('https://api.openweathermap.org/data/2.5/forecast?q=Tijuana,mx&units=metric&lang=es&APPID=e55ac5454485f43016d78b600a54208c')
    .then((response) => {
      // dispatch(setForecastMetric(response.data));
      const state = getState();
      const { forecast } = state;
      const { forecastList } = forecast;
      const list = getForecastList(response.data, forecastList);
      dispatch(setForecastList(list));
    })
    .catch((error) => {
      toast.error(error.message, { autoclose: 2000 });
    })
);
