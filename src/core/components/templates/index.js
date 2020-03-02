import Home from './home';
// import News from './news';

export const ROUTES = [
  {
    url: '#/',
    component: Home,
    name: 'Inicio',
    items: [
    ],
  },
  {
    url: '#/?display=hora',
    component: Home,
    name: 'Hora',
    items: [
    ],
  },
  {
    url: '#/?display=clima',
    component: Home,
    name: 'Clima',
    items: [
    ],
  },
  {
    url: '#/?display=fase',
    component: Home,
    name: 'Fase',
    items: [
    ],
  },
];

export default ROUTES;
