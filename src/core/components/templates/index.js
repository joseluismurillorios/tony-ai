import Home from './home';
import News from './news';

export const ROUTES = [
  {
    url: '/inicio',
    component: Home,
    name: 'Inicio',
    items: [
    ],
  },
  {
    url: '/clima',
    component: News,
    name: 'Clima',
    items: [
    ],
  },
];

export default ROUTES;
