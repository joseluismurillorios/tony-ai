// export const setCache = (key, state) => {
//   try {
//     const serializedState = JSON.stringify(state);
//     localStorage.setItem(key, serializedState);
//   } catch (e) {
//     console.warn('Error setting storage', e);
//   }
// };

// export const getCache = (key) => {
//   try {
//     const serializedState = localStorage.getItem(key);
//     if (serializedState === null) {
//       return undefined;
//     }
//     return JSON.parse(serializedState);
//   } catch (err) {
//     return undefined;
//   }
// };

export const setCache = (key, data) => {
  const expiration = new Date(Date.now() + 600000).getTime();
  const cacheWrapper = {
    expiration,
    data,
  };
  localStorage.setItem(key, JSON.stringify(cacheWrapper));
  return true;
};

export const getCache = (key) => {
  const rawCache = localStorage.getItem(key);
  let cache = null;
  if (rawCache) {
    const cacheWrapper = JSON.parse(rawCache);
    const currentTime = +Date.now();

    // check if cache is still within the expiration time
    if (cacheWrapper.expiration > currentTime) {
      cache = cacheWrapper.data;
    }
  }
  return cache;
};
