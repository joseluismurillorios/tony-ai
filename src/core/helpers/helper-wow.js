/* eslint-disable */

export default () => {
  (function () {
    let MutationObserver;
    let Util;
    let WeakMap;
    let getComputedStyle;
    let getComputedStyleRX;
    const bind = (fn, me) => function () { return fn.apply(me, arguments); };
    const indexOf = [].indexOf || function (item) { for (let i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

    Util = ((() => {
      class Util {
        extend(custom, defaults) {
          let key;
          let value;
          for (key in defaults) {
            value = defaults[key];
            if (custom[key] == null) {
              custom[key] = value;
            }
          }
          return custom;
        }

        isMobile(agent) {
          return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(agent);
        }

        createEvent(event, bubble, cancel, detail) {
          let customEvent;
          if (bubble == null) {
            bubble = false;
          }
          if (cancel == null) {
            cancel = false;
          }
          if (detail == null) {
            detail = null;
          }
          if (document.createEvent != null) {
            customEvent = document.createEvent('CustomEvent');
            customEvent.initCustomEvent(event, bubble, cancel, detail);
          } else if (document.createEventObject != null) {
            customEvent = document.createEventObject();
            customEvent.eventType = event;
          } else {
            customEvent.eventName = event;
          }
          return customEvent;
        }

        emitEvent(elem, event) {
          if (elem.dispatchEvent != null) {
            return elem.dispatchEvent(event);
          } else if (event in (elem != null)) {
            return elem[event]();
          } else if ((`on${event}`) in (elem != null)) {
            return elem[`on${event}`]();
          }
        }

        addEvent(elem, event, fn) {
          if (elem.addEventListener != null) {
            return elem.addEventListener(event, fn, false);
          } else if (elem.attachEvent != null) {
            return elem.attachEvent(`on${event}`, fn);
          } else {
            return elem[event] = fn;
          }
        }

        removeEvent(elem, event, fn) {
          if (elem.removeEventListener != null) {
            return elem.removeEventListener(event, fn, false);
          } else if (elem.detachEvent != null) {
            return elem.detachEvent(`on${event}`, fn);
          } else {
            return delete elem[event];
          }
        }

        innerHeight() {
          if ('innerHeight' in window) {
            return window.innerHeight;
          } else {
            return document.documentElement.clientHeight;
          }
        }
      }

      return Util;
    }))();

    WeakMap = this.WeakMap || this.MozWeakMap || (WeakMap = ((() => {
      class WeakMap {
        constructor() {
          this.keys = [];
          this.values = [];
        }

        get(key) {
          let i;
          let item;
          let j;
          let len;
          let ref;
          ref = this.keys;
          for (i = j = 0, len = ref.length; j < len; i = ++j) {
            item = ref[i];
            if (item === key) {
              return this.values[i];
            }
          }
        }

        set(key, value) {
          let i;
          let item;
          let j;
          let len;
          let ref;
          ref = this.keys;
          for (i = j = 0, len = ref.length; j < len; i = ++j) {
            item = ref[i];
            if (item === key) {
              this.values[i] = value;
              return;
            }
          }
          this.keys.push(key);
          return this.values.push(value);
        }
      }

      return WeakMap;
    }))());

    MutationObserver = this.MutationObserver || this.WebkitMutationObserver || this.MozMutationObserver || (MutationObserver = ((() => {
      class MutationObserver {
        constructor() {
          if (typeof console !== "undefined" && console !== null) {
            console.warn('MutationObserver is not supported by your browser.');
          }
          if (typeof console !== "undefined" && console !== null) {
            console.warn('WOW.js cannot detect dom mutations, please call .sync() after loading new content.');
          }
        }

        observe() { }
      }

      MutationObserver.notSupported = true;

      return MutationObserver;
    }))());

    getComputedStyle = this.getComputedStyle || function (el, pseudo) {
      this.getPropertyValue = prop => {
        let ref;
        if (prop === 'float') {
          prop = 'styleFloat';
        }
        if (getComputedStyleRX.test(prop)) {
          prop.replace(getComputedStyleRX, (_, _char) => _char.toUpperCase());
        }
        return ((ref = el.currentStyle) != null ? ref[prop] : void 0) || null;
      };
      return this;
    };

    getComputedStyleRX = /(\-([a-z]){1})/g;

    this.WOW = (() => {
      class WOW {
        constructor(options) {
          if (options == null) {
            options = {};
          }
          this.scrollCallback = bind(this.scrollCallback, this);
          this.scrollHandler = bind(this.scrollHandler, this);
          this.resetAnimation = bind(this.resetAnimation, this);
          this.start = bind(this.start, this);
          this.scrolled = true;
          this.config = this.util().extend(options, this.defaults);
          this.animationNameCache = new WeakMap();
          this.wowEvent = this.util().createEvent(this.config.boxClass);
        }

        init() {
          let ref;
          this.element = window.document.documentElement;
          if ((ref = document.readyState) === "interactive" || ref === "complete") {
            this.start();
          } else {
            this.util().addEvent(document, 'DOMContentLoaded', this.start);
          }
          return this.finished = [];
        }

        start() {
          let box;
          let j;
          let len;
          let ref;
          this.stopped = false;
          this.boxes = (function () {
            let j;
            let len;
            let ref;
            let results;
            ref = this.element.querySelectorAll(`.${this.config.boxClass}`);
            results = [];
            for (j = 0, len = ref.length; j < len; j++) {
              box = ref[j];
              results.push(box);
            }
            return results;
          }).call(this);
          this.all = (function () {
            let j;
            let len;
            let ref;
            let results;
            ref = this.boxes;
            results = [];
            for (j = 0, len = ref.length; j < len; j++) {
              box = ref[j];
              results.push(box);
            }
            return results;
          }).call(this);
          if (this.boxes.length) {
            if (this.disabled()) {
              this.resetStyle();
            } else {
              ref = this.boxes;
              for (j = 0, len = ref.length; j < len; j++) {
                box = ref[j];
                this.applyStyle(box, true);
              }
            }
          }
          if (!this.disabled()) {
            this.util().addEvent(document.getElementById('Router'), 'scroll', this.scrollHandler);
            this.util().addEvent(document.getElementById('Router'), 'resize', this.scrollHandler);
            this.interval = setInterval(this.scrollCallback, 50);
          }
          if (this.config.live) {
            return new MutationObserver(((_this => records => {
              let k;
              let len1;
              let node;
              let record;
              let results;
              results = [];
              for (k = 0, len1 = records.length; k < len1; k++) {
                record = records[k];
                results.push((function () {
                  let l;
                  let len2;
                  let ref1;
                  let results1;
                  ref1 = record.addedNodes || [];
                  results1 = [];
                  for (l = 0, len2 = ref1.length; l < len2; l++) {
                    node = ref1[l];
                    results1.push(this.doSync(node));
                  }
                  return results1;
                }).call(_this));
              }
              return results;
            }))(this)).observe(document.body, {
              childList: true,
              subtree: true
            });
          }
        }

        stop() {
          this.stopped = true;
          this.util().removeEvent(window, 'scroll', this.scrollHandler);
          this.util().removeEvent(window, 'resize', this.scrollHandler);
          if (this.interval != null) {
            return clearInterval(this.interval);
          }
        }

        sync(element) {
          if (MutationObserver.notSupported) {
            return this.doSync(this.element);
          }
        }

        doSync(element) {
          let box;
          let j;
          let len;
          let ref;
          let results;
          if (element == null) {
            element = this.element;
          }
          if (element.nodeType !== 1) {
            return;
          }
          element = element.parentNode || element;
          ref = element.querySelectorAll(`.${this.config.boxClass}`);
          results = [];
          for (j = 0, len = ref.length; j < len; j++) {
            box = ref[j];
            if (indexOf.call(this.all, box) < 0) {
              this.boxes.push(box);
              this.all.push(box);
              if (this.stopped || this.disabled()) {
                this.resetStyle();
              } else {
                this.applyStyle(box, true);
              }
              results.push(this.scrolled = true);
            } else {
              results.push(void 0);
            }
          }
          return results;
        }

        show(box) {
          this.applyStyle(box);
          box.className = `${box.className} ${this.config.animateClass}`;
          if (this.config.callback != null) {
            this.config.callback(box);
          }
          this.util().emitEvent(box, this.wowEvent);
          this.util().addEvent(box, 'animationend', this.resetAnimation);
          this.util().addEvent(box, 'oanimationend', this.resetAnimation);
          this.util().addEvent(box, 'webkitAnimationEnd', this.resetAnimation);
          this.util().addEvent(box, 'MSAnimationEnd', this.resetAnimation);
          return box;
        }

        applyStyle(box, hidden) {
          let delay;
          let duration;
          let iteration;
          duration = box.getAttribute('data-wow-duration');
          delay = box.getAttribute('data-wow-delay');
          iteration = box.getAttribute('data-wow-iteration');
          return this.animate(((_this => () => _this.customStyle(box, hidden, duration, delay, iteration)))(this));
        }

        resetStyle() {
          let box;
          let j;
          let len;
          let ref;
          let results;
          ref = this.boxes;
          results = [];
          for (j = 0, len = ref.length; j < len; j++) {
            box = ref[j];
            results.push(box.style.visibility = 'visible');
          }
          return results;
        }

        resetAnimation(event) {
          let target;
          if (event.type.toLowerCase().includes('animationend')) {
            target = event.target || event.srcElement;
            return target.className = target.className.replace(this.config.animateClass, '').trim();
          }
        }

        customStyle(box, hidden, duration, delay, iteration) {
          if (hidden) {
            this.cacheAnimationName(box);
          }
          box.style.visibility = hidden ? 'hidden' : 'visible';
          if (duration) {
            this.vendorSet(box.style, {
              animationDuration: duration
            });
          }
          if (delay) {
            this.vendorSet(box.style, {
              animationDelay: delay
            });
          }
          if (iteration) {
            this.vendorSet(box.style, {
              animationIterationCount: iteration
            });
          }
          this.vendorSet(box.style, {
            animationName: hidden ? 'none' : this.cachedAnimationName(box)
          });
          return box;
        }

        vendorSet(elem, properties) {
          let name;
          let results;
          let value;
          let vendor;
          results = [];
          for (name in properties) {
            value = properties[name];
            elem[`${name}`] = value;
            results.push((function () {
              let j;
              let len;
              let ref;
              let results1;
              ref = this.vendors;
              results1 = [];
              for (j = 0, len = ref.length; j < len; j++) {
                vendor = ref[j];
                results1.push(elem[`${vendor}${name.charAt(0).toUpperCase()}${name.substr(1)}`] = value);
              }
              return results1;
            }).call(this));
          }
          return results;
        }

        vendorCSS(elem, property) {
          let j;
          let len;
          let ref;
          let result;
          let style;
          let vendor;
          style = getComputedStyle(elem);
          result = style.getPropertyCSSValue(property);
          ref = this.vendors;
          for (j = 0, len = ref.length; j < len; j++) {
            vendor = ref[j];
            result = result || style.getPropertyCSSValue(`-${vendor}-${property}`);
          }
          return result;
        }

        animationName(box) {
          let animationName;
          try {
            animationName = this.vendorCSS(box, 'animation-name').cssText;
          } catch (_error) {
            animationName = getComputedStyle(box).getPropertyValue('animation-name');
          }
          if (animationName === 'none') {
            return '';
          } else {
            return animationName;
          }
        }

        cacheAnimationName(box) {
          return this.animationNameCache.set(box, this.animationName(box));
        }

        cachedAnimationName(box) {
          return this.animationNameCache.get(box);
        }

        scrollHandler() {
          return this.scrolled = true;
        }

        scrollCallback() {
          let box;
          if (this.scrolled) {
            this.scrolled = false;
            this.boxes = (function () {
              let j;
              let len;
              let ref;
              let results;
              ref = this.boxes;
              results = [];
              for (j = 0, len = ref.length; j < len; j++) {
                box = ref[j];
                if (!(box)) {
                  continue;
                }
                if (this.isVisible(box)) {
                  this.show(box);
                  continue;
                }
                results.push(box);
              }
              return results;
            }).call(this);
            if (!(this.boxes.length || this.config.live)) {
              return this.stop();
            }
          }
        }

        offsetTop(element) {
          let top;
          while (element.offsetTop === void 0) {
            element = element.parentNode;
          }
          top = element.offsetTop;
          while (element = element.offsetParent) {
            top += element.offsetTop;
          }
          return top;
        }

        isVisible(box) {
          let bottom;
          let offset;
          let top;
          let viewBottom;
          let viewTop;
          offset = box.getAttribute('data-wow-offset') || this.config.offset;
          viewTop = document.getElementById('Router').scrollTop;

          viewBottom = viewTop + Math.min(this.element.clientHeight, this.util().innerHeight()) - offset;
          top = this.offsetTop(box);
          bottom = top + box.clientHeight;
          return top <= viewBottom && bottom >= viewTop;
        }

        util() {
          return this._util != null ? this._util : this._util = new Util();
        }

        disabled() {
          return !this.config.mobile && this.util().isMobile(navigator.userAgent);
        }
      }

      WOW.prototype.defaults = {
        boxClass: 'wow',
        animateClass: 'animated',
        offset: 0,
        mobile: true,
        live: true,
        callback: null
      };

      WOW.prototype.animate = ((() => {
        if ('requestAnimationFrame' in window) {
          return callback => window.requestAnimationFrame(callback);
        } else {
          return callback => callback();
        }
      }))();

      WOW.prototype.vendors = ["moz", "webkit"];

      return WOW;
    })();
  }).call(window);
}