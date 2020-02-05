
export const debounce = (func, wait, immediate, ...args) => {
  let timeout;
  return () => {
    const context = this;
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

export const throttle = (callback, delay, ...args) => {
  let isThrottled = false;
  let arg;
  let context;

  function wrapper() {
    if (isThrottled) {
      arg = args;
      context = this;
      return;
    }

    isThrottled = true;
    callback.apply(this, args);

    setTimeout(() => {
      isThrottled = false;
      if (arg) {
        wrapper.apply(context, arg);
        arg = null;
        context = null;
      }
    }, delay);
  }

  return wrapper;
};

export const transformProperty = (() => {
  const transform = typeof window !== 'undefined' && window.document.documentElement.style.transform;
  if (typeof transform === 'string') {
    return 'transform';
  }
  return 'WebkitTransform';
})();


// const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

const { userAgent } = window.navigator;

export const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
export const isChrome = /Chrome/.test(userAgent) && /Google Inc/.test(navigator.vendor);
export const isIOSChrome = /CriOS/.test(userAgent);
export const isMac = (navigator.platform.toUpperCase().indexOf('MAC') >= 0);
export const isIOS = /iphone|ipad|ipod/.test(userAgent.toLowerCase());

export const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

export const isCordova = () => !!(window.cordova);
