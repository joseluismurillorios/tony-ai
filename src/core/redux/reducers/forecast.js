import {
  SET_FORECAST_METRIC,
  SET_WEATHER_METRIC,
  SET_EARTH_PHASES,
} from '../actions/forecast/constants';

import { getSunTimes } from '../../helpers/helper-weather';

const phases = getSunTimes();

const defaultState = {
  curTime: (new Date()).getTime(),
  ...phases,
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case SET_FORECAST_METRIC: {
      const newPhases = getSunTimes();
      return {
        ...state,
        forecastMetric: action.payload,
        curTime: (new Date()).getTime(),
        ...newPhases,
      };
    }

    case SET_WEATHER_METRIC: {
      return {
        ...state,
        weatherMetric: action.payload,
        curTime: (new Date()).getTime(),
      };
    }

    case SET_EARTH_PHASES: {
      const newPhases = getSunTimes();
      return {
        ...state,
        ...newPhases,
      };
    }

    default: {
      return state;
    }
  }
};

export default reducer;
