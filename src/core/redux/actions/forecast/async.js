import axios from 'axios';
import { toast } from 'react-toastify';

import {
  setForecastMetric,
  setWeatherMetric,
} from './index';

export const onWeatherChange = () => (
  dispatch => (
    setInterval(() => {
      console.log('onWeatherChange');
      axios.get('http://api.openweathermap.org/data/2.5/weather?q=Tijuana,mx&units=metric&lang=es&APPID=e55ac5454485f43016d78b600a54208c')
        .then((response) => {
          dispatch(setWeatherMetric(response.data));
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
      axios.get('http://api.openweathermap.org/data/2.5/forecast?q=Tijuana,mx&units=metric&lang=es&APPID=e55ac5454485f43016d78b600a54208c')
        .then((response) => {
          dispatch(setForecastMetric(response.data));
        })
        .catch((error) => {
          toast.error(error.message, { autoclose: 2000 });
        });
    }, 3 * 60 * 1000)
  )
);

export const getWeatherMetric = () => (
  dispatch => axios.get('http://api.openweathermap.org/data/2.5/weather?q=Tijuana,mx&units=metric&lang=es&APPID=e55ac5454485f43016d78b600a54208c')
    .then((response) => {
      dispatch(setWeatherMetric(response.data));
    })
    .catch((error) => {
      toast.error(error.message, { autoclose: 2000 });
    })
);

export const getForecastMetric = () => (
  dispatch => axios.get('http://api.openweathermap.org/data/2.5/forecast?q=Tijuana,mx&units=metric&lang=es&APPID=e55ac5454485f43016d78b600a54208c')
    .then((response) => {
      dispatch(setForecastMetric(response.data));
    })
    .catch((error) => {
      toast.error(error.message, { autoclose: 2000 });
    })
);
