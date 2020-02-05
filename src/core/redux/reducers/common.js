import {
  TOGGLE_SIDEBAR,
  AUTH_CHANGED,
  SET_LOADER,
  SET_OPINIONES,
  HIDE_INSTALL_MESSAGE,
  SET_ADMIN,
} from '../actions/common/constants';

const defaultState = {
  longitude: -116.952631,
  latitude: 32.476784,
  sidebar: false,
  user: {},
  loading: true,
  curTime: (new Date()).getTime(),
  showInstallMessage: true,
  isAdmin: false,
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case TOGGLE_SIDEBAR: {
      return {
        ...state,
        sidebar: !state.sidebar,
      };
    }

    case AUTH_CHANGED: {
      return {
        ...state,
        user: action.payload || null,
      };
    }

    case SET_LOADER: {
      return {
        ...state,
        loading: action.payload,
      };
    }

    case SET_OPINIONES: {
      return {
        ...state,
        opiniones: action.payload,
      };
    }

    case HIDE_INSTALL_MESSAGE: {
      return {
        ...state,
        showInstallMessage: false,
      };
    }

    case SET_ADMIN: {
      return {
        ...state,
        isAdmin: action.payload,
      };
    }

    default: {
      return state;
    }
  }
};

export default reducer;
