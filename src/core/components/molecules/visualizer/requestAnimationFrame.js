export default () => {
  /**
 * Provides requestAnimationFrame in a cross browser way.
 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 */

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (() => {
      const animFrame = (callback) => {
        window.setTimeout(callback, 1000 / 60);
      };

      return window.webkitRequestAnimationFrame
        || window.mozRequestAnimationFrame
        || window.oRequestAnimationFrame
        || window.msRequestAnimationFrame
        || animFrame;
    })();
  }
  return window.requestAnimationFrame;
};
