import ReactDOM from 'react-dom';
import Root from './root';

// import helperSwipe from './core/helpers/helper-swipe';

import './core/assets/favicon.ico';
import './core/assets/images/icon-57-2x.png';
import './core/assets/images/icon-57.png';
import './core/assets/images/icon-60-2x.png';
import './core/assets/images/icon-60.png';
import './core/assets/images/icon-72-2x.png';
import './core/assets/images/icon-72.png';
import './core/assets/images/icon-76-2x.png';
import './core/assets/images/icon-76.png';
import './core/assets/images/favicon-16x16.png';
import './core/assets/images/favicon-32x32.png';
import './core/assets/images/favicon-96x96.png';
import './core/assets/images/android-icon-192x192.png';
import './core/assets/images/preview.png';
import './core/assets/images/apple_splash_1242.png';
import './core/assets/images/apple_splash_2048.png';
import './core/assets/images/apple_splash_640.png';
import './core/assets/images/apple_splash_750.png';

import './core/assets/styles/main.scss';

// const DEVELOMPENT = (process.env.NODE_ENV === 'development');
// console.log(DEVELOMPENT);

// if (('serviceWorker' in navigator) && !(window.cordova) && !DEVELOMPENT) {
//   navigator.serviceWorker.register('service-worker.js');
// }

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  document.body.classList.add('isMobile');
}

if ('navigator' in window && window.navigator.standalone) {
  document.body.classList.add('isStandalone');
}

// Add swipe capabillities
// helperSwipe(document);

// if (module.hot) {
//   console.clear();
//   module.hot.accept();
// }

function runApp() {
  ReactDOM.render(
    Root(),
    document.getElementById('Root'),
  );
}

function onPause() {
  // TODO: This application has been suspended. Save application state here.
}

function onResume() {
  // TODO: This application has been reactivated. Restore application state here.
}

function onDeviceReady() {
  // Handle the Cordova pause and resume events
  document.addEventListener('pause', onPause.bind(this), false);
  document.addEventListener('resume', onResume.bind(this), false);
  window.screen.orientation.lock('portrait-primary');
  runApp();
}

if (window.cordova) {
  document.addEventListener('deviceready', onDeviceReady.bind(this), false);
} else {
  runApp();
}

// runApp();
