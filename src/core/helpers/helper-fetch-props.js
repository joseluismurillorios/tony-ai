/* eslint-disable no-unused-vars */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
export default (payload, sk = [], ex = []) => {
  const attr = {};
  const exceptions = ['className', 'src', 'alt', 'style', 'id', 'crossOrigin'].concat(...ex);
  for (const key in payload) {
    const newkey = key.replace(/([A-Z])/g, (x, y) => `_${y.toLowerCase()}`).replace(/^_/, '');
    if (newkey === 'class_name') {
      attr[key] = payload[key];
    } else if (exceptions.indexOf(newkey) !== -1) {
      attr[newkey] = payload[key];
    } else if (newkey.indexOf('data-') === 0) {
      attr[newkey] = payload[key];
    } else {
      attr[`data-${newkey}`] = payload[key];
    }
  }
  return attr;
};
