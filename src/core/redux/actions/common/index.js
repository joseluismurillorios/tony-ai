import {
  TOGGLE_SIDEBAR,
  TOGGLE_THEME,
  AUTH_CHANGED,
  SET_LOADER,
  SET_OPINIONES,
  HIDE_INSTALL_MESSAGE,
  SET_ADMIN,
} from './constants';

export const toggleSideBar = payload => ({
  type: TOGGLE_SIDEBAR,
  payload,
});

export const toggleTheme = payload => ({
  type: TOGGLE_THEME,
  payload,
});

export const userLogged = payload => ({
  type: AUTH_CHANGED,
  payload,
});

export const setLoader = payload => ({
  type: SET_LOADER,
  payload,
});

export const setOpiniones = payload => ({
  type: SET_OPINIONES,
  payload,
});

export const hideInstallMessage = payload => ({
  type: HIDE_INSTALL_MESSAGE,
  payload,
});

export const setAdmin = payload => ({
  type: SET_ADMIN,
  payload,
});
