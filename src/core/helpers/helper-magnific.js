/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
/* eslint-disable no-continue */
/* eslint-disable consistent-return */

export default ($) => {
  /*! Magnific Popup - v1.0.0 - 2014-12-12
* http://dimsemenov.com/plugins/magnific-popup/
* Copyright (c) 2014 Dmitry Semenov; */
  /* >>core*/
  /**
   *
   * Magnific Popup Core JS file
   *
   */


  /**
   * Private static constants
   */
  const CLOSE_EVENT = 'Close';

  const BEFORE_CLOSE_EVENT = 'BeforeClose';
  const AFTER_CLOSE_EVENT = 'AfterClose';
  const BEFORE_APPEND_EVENT = 'BeforeAppend';
  const MARKUP_PARSE_EVENT = 'MarkupParse';
  const OPEN_EVENT = 'Open';
  const CHANGE_EVENT = 'Change';
  const NS = 'mfp';
  const EVENT_NS = `.${NS}`;
  const READY_CLASS = 'mfp-ready';
  const REMOVING_CLASS = 'mfp-removing';
  const PREVENT_CLOSE_CLASS = 'mfp-prevent-close';

  /**
   * Private vars
   */
  let mfp;

  const MagnificPopup = () => { };
  const _isJQ = !!(window.jQuery);
  let _prevStatus;
  const _window = $(window);
  let _body;
  let _document;
  let _prevContentType;
  let _wrapClasses;
  let _currPopupType;

  /**
   * Private functions
   */
  const _mfpOn = (name, f) => {
    mfp.ev.on(NS + name + EVENT_NS, f);
  };

  const _getEl = (className, appendTo, html, raw) => {
    let el = document.createElement('div');
    el.className = `mfp-${className}`;
    if (html) {
      el.innerHTML = html;
    }
    if (!raw) {
      el = $(el);
      if (appendTo) {
        el.appendTo(appendTo);
      }
    } else if (appendTo) {
      appendTo.appendChild(el);
    }
    return el;
  };

  const _mfpTrigger = (e, data) => {
    mfp.ev.triggerHandler(NS + e, data);

    if (mfp.st.callbacks) {
      // converts "mfpEventName" to "eventName" callback and triggers it if it's present
      e = e.charAt(0).toLowerCase() + e.slice(1);
      if (mfp.st.callbacks[e]) {
        mfp.st.callbacks[e].apply(mfp, $.isArray(data) ? data : [data]);
      }
    }
  };

  const _getCloseBtn = (type) => {
    if (type !== _currPopupType || !mfp.currTemplate.closeBtn) {
      mfp.currTemplate.closeBtn = $(mfp.st.closeMarkup.replace('%title%', mfp.st.tClose));
      _currPopupType = type;
    }
    return mfp.currTemplate.closeBtn;
  };

  const // Initialize Magnific Popup only when called at least once
    _checkInstance = () => {
      if (!$.magnificPopup.instance) {
        mfp = new MagnificPopup();
        mfp.init();
        $.magnificPopup.instance = mfp;
      }
    };

  const // CSS transition detection, http://stackoverflow.com/questions/7264899/detect-css-transitions-using-javascript-and-without-modernizr
    supportsTransitions = () => {
      const s = document.createElement('p').style;
      const v = ['ms', 'O', 'Moz', 'Webkit']; // 'v' for vendor

      if (s.transition !== undefined) {
        return true;
      }

      while (v.length) {
        if (`${v.pop()}Transition` in s) {
          return true;
        }
      }

      return false;
    };


  /**
   * Public functions
   */
  MagnificPopup.prototype = {

    constructor: MagnificPopup,

    /**
     * Initializes Magnific Popup plugin.
     * This function is triggered only once when $.fn.magnificPopup or $.magnificPopup is executed
     */
    init() {
      const appVersion = navigator.appVersion;
      mfp.isIE7 = appVersion.indexOf('MSIE 7.') !== -1;
      mfp.isIE8 = appVersion.indexOf('MSIE 8.') !== -1;
      mfp.isLowIE = mfp.isIE7 || mfp.isIE8;
      mfp.isAndroid = (/android/gi).test(appVersion);
      mfp.isIOS = (/iphone|ipad|ipod/gi).test(appVersion);
      mfp.supportsTransition = supportsTransitions();

      // We disable fixed positioned lightbox on devices that don't handle it nicely.
      // If you know a better way of detecting this - let me know.
      mfp.probablyMobile = (mfp.isAndroid || mfp.isIOS || /(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent));
      _document = $(document);

      mfp.popupsCache = {};
    },

    /**
     * Opens popup
     * @param  data [description]
     */
    open(data) {
      if (!_body) {
        _body = $(document.body);
      }

      let i;

      if (data.isObj === false) {
        // convert jQuery collection to array to avoid conflicts later
        mfp.items = data.items.toArray();

        mfp.index = 0;
        const items = data.items;
        let item;
        for (i = 0; i < items.length; i += 1) {
          item = items[i];
          if (item.parsed) {
            item = item.el[0];
          }
          if (item === data.el[0]) {
            mfp.index = i;
            break;
          }
        }
      } else {
        mfp.items = $.isArray(data.items) ? data.items : [data.items];
        mfp.index = data.index || 0;
      }

      // if popup is already opened - we just update the content
      if (mfp.isOpen) {
        mfp.updateItemHTML();
        return;
      }

      mfp.types = [];
      _wrapClasses = '';
      if (data.mainEl && data.mainEl.length) {
        mfp.ev = data.mainEl.eq(0);
      } else {
        mfp.ev = _document;
      }

      if (data.key) {
        if (!mfp.popupsCache[data.key]) {
          mfp.popupsCache[data.key] = {};
        }
        mfp.currTemplate = mfp.popupsCache[data.key];
      } else {
        mfp.currTemplate = {};
      }


      mfp.st = $.extend(true, {}, $.magnificPopup.defaults, data);
      mfp.fixedContentPos = mfp.st.fixedContentPos === 'auto' ? !mfp.probablyMobile : mfp.st.fixedContentPos;

      if (mfp.st.modal) {
        mfp.st.closeOnContentClick = false;
        mfp.st.closeOnBgClick = false;
        mfp.st.showCloseBtn = false;
        mfp.st.enableEscapeKey = false;
      }


      // Building markup
      // main containers are created only once
      if (!mfp.bgOverlay) {
        // Dark overlay
        mfp.bgOverlay = _getEl('bg').on(`click${EVENT_NS}`, () => {
          mfp.close();
        });

        mfp.wrap = _getEl('wrap').attr('tabindex', -1).on(`click${EVENT_NS}`, (e) => {
          if (mfp._checkIfClose(e.target)) {
            mfp.close();
          }
        });

        mfp.container = _getEl('container', mfp.wrap);
      }

      mfp.contentContainer = _getEl('content');
      if (mfp.st.preloader) {
        mfp.preloader = _getEl('preloader', mfp.container, mfp.st.tLoading);
      }


      // Initializing modules
      const modules = $.magnificPopup.modules;
      for (i = 0; i < modules.length; i += 1) {
        let n = modules[i];
        n = n.charAt(0).toUpperCase() + n.slice(1);
        mfp[`init${n}`].call(mfp);
      }
      _mfpTrigger('BeforeOpen');


      if (mfp.st.showCloseBtn) {
        // Close button
        if (!mfp.st.closeBtnInside) {
          mfp.wrap.append(_getCloseBtn());
        } else {
          _mfpOn(MARKUP_PARSE_EVENT, (e, template, values, item) => {
            values.close_replaceWith = _getCloseBtn(item.type);
          });
          _wrapClasses += ' mfp-close-btn-in';
        }
      }

      if (mfp.st.alignTop) {
        _wrapClasses += ' mfp-align-top';
      }


      if (mfp.fixedContentPos) {
        mfp.wrap.css({
          overflow: mfp.st.overflowY,
          overflowX: 'hidden',
          overflowY: mfp.st.overflowY,
        });
      } else {
        mfp.wrap.css({
          top: _window.scrollTop(),
          position: 'absolute',
        });
      }
      if (mfp.st.fixedBgPos === false || (mfp.st.fixedBgPos === 'auto' && !mfp.fixedContentPos)) {
        mfp.bgOverlay.css({
          height: _document.height(),
          position: 'absolute',
        });
      }


      if (mfp.st.enableEscapeKey) {
        // Close on ESC key
        _document.on(`keyup${EVENT_NS}`, (e) => {
          if (e.keyCode === 27) {
            mfp.close();
          }
        });
      }

      _window.on(`resize${EVENT_NS}`, () => {
        mfp.updateSize();
      });


      if (!mfp.st.closeOnContentClick) {
        _wrapClasses += ' mfp-auto-cursor';
      }

      if (_wrapClasses) { mfp.wrap.addClass(_wrapClasses); }


      // this triggers recalculation of layout, so we get it once to not to trigger twice
      const windowHeight = mfp.wH = _window.height();


      const windowStyles = {};

      if (mfp.fixedContentPos) {
        if (mfp._hasScrollBar(windowHeight)) {
          const s = mfp._getScrollbarSize();
          if (s) {
            windowStyles.marginRight = s;
          }
        }
      }

      if (mfp.fixedContentPos) {
        if (!mfp.isIE7) {
          windowStyles.overflow = 'hidden';
        } else {
          // ie7 double-scroll bug
          $('body, html').css('overflow', 'hidden');
        }
      }


      let classesToadd = mfp.st.mainClass;
      if (mfp.isIE7) {
        classesToadd += ' mfp-ie7';
      }
      if (classesToadd) {
        mfp._addClassToMFP(classesToadd);
      }

      // add content
      mfp.updateItemHTML();

      _mfpTrigger('BuildControls');

      // remove scrollbar, add margin e.t.c
      $('html').css(windowStyles);

      // add everything to DOM
      mfp.bgOverlay.add(mfp.wrap).prependTo(mfp.st.prependTo || _body);

      // Save last focused element
      mfp._lastFocusedEl = document.activeElement;

      // Wait for next cycle to allow CSS transition
      setTimeout(() => {
        if (mfp.content) {
          mfp._addClassToMFP(READY_CLASS);
          mfp._setFocus();
        } else {
          // if content is not defined (not loaded e.t.c) we add class only for BG
          mfp.bgOverlay.addClass(READY_CLASS);
        }

        // Trap the focus in popup
        _document.on(`focusin${EVENT_NS}`, mfp._onFocusIn);
      }, 16);

      mfp.isOpen = true;
      mfp.updateSize(windowHeight);
      _mfpTrigger(OPEN_EVENT);

      return data;
    },

    /**
     * Closes the popup
     */
    close() {
      if (!mfp.isOpen) return;
      _mfpTrigger(BEFORE_CLOSE_EVENT);

      mfp.isOpen = false;
      // for CSS3 animation
      if (mfp.st.removalDelay && !mfp.isLowIE && mfp.supportsTransition) {
        mfp._addClassToMFP(REMOVING_CLASS);
        setTimeout(() => {
          mfp._close();
        }, mfp.st.removalDelay);
      } else {
        mfp._close();
      }
    },

    /**
     * Helper for close() function
     */
    _close() {
      _mfpTrigger(CLOSE_EVENT);

      let classesToRemove = `${REMOVING_CLASS} ${READY_CLASS} `;

      mfp.bgOverlay.detach();
      mfp.wrap.detach();
      mfp.container.empty();

      if (mfp.st.mainClass) {
        classesToRemove += `${mfp.st.mainClass} `;
      }

      mfp._removeClassFromMFP(classesToRemove);

      if (mfp.fixedContentPos) {
        const windowStyles = { marginRight: '' };
        if (mfp.isIE7) {
          $('body, html').css('overflow', '');
        } else {
          windowStyles.overflow = '';
        }
        $('html').css(windowStyles);
      }

      _document.off(`keyup${EVENT_NS} focusin${EVENT_NS}`);
      mfp.ev.off(EVENT_NS);

      // clean up DOM elements that aren't removed
      mfp.wrap.attr('class', 'mfp-wrap').removeAttr('style');
      mfp.bgOverlay.attr('class', 'mfp-bg');
      mfp.container.attr('class', 'mfp-container');

      // remove close button from target element
      if (mfp.st.showCloseBtn &&
        (!mfp.st.closeBtnInside || mfp.currTemplate[mfp.currItem.type] === true)) {
        if (mfp.currTemplate.closeBtn) { mfp.currTemplate.closeBtn.detach(); }
      }


      if (mfp._lastFocusedEl) {
        $(mfp._lastFocusedEl).focus(); // put tab focus back
      }
      mfp.currItem = null;
      mfp.content = null;
      mfp.currTemplate = null;
      mfp.prevHeight = 0;

      _mfpTrigger(AFTER_CLOSE_EVENT);
    },

    updateSize(winHeight) {
      if (mfp.isIOS) {
        // fixes iOS nav bars https://github.com/dimsemenov/Magnific-Popup/issues/2
        const zoomLevel = document.documentElement.clientWidth / window.innerWidth;
        const height = window.innerHeight * zoomLevel;
        mfp.wrap.css('height', height);
        mfp.wH = height;
      } else {
        mfp.wH = winHeight || _window.height();
      }
      // Fixes #84: popup incorrectly positioned with position:relative on body
      if (!mfp.fixedContentPos) {
        mfp.wrap.css('height', mfp.wH);
      }

      _mfpTrigger('Resize');
    },

    /**
     * Set content of popup based on current index
     */
    updateItemHTML() {
      let item = mfp.items[mfp.index];

      // Detach and perform modifications
      mfp.contentContainer.detach();

      if (mfp.content) { mfp.content.detach(); }

      if (!item.parsed) {
        item = mfp.parseEl(mfp.index);
      }

      const type = item.type;

      _mfpTrigger('BeforeChange', [mfp.currItem ? mfp.currItem.type : '', type]);
      // BeforeChange event works like so:
      // _mfpOn('BeforeChange', function(e, prevType, newType) { });

      mfp.currItem = item;


      if (!mfp.currTemplate[type]) {
        const markup = mfp.st[type] ? mfp.st[type].markup : false;

        // allows to modify markup
        _mfpTrigger('FirstMarkupParse', markup);

        if (markup) {
          mfp.currTemplate[type] = $(markup);
        } else {
          // if there is no markup found we just define that template is parsed
          mfp.currTemplate[type] = true;
        }
      }

      if (_prevContentType && _prevContentType !== item.type) {
        mfp.container.removeClass(`mfp-${_prevContentType}-holder`);
      }

      const newContent = mfp[`get${type.charAt(0).toUpperCase()}${type.slice(1)}`](item, mfp.currTemplate[type]);
      mfp.appendContent(newContent, type);

      item.preloaded = true;

      _mfpTrigger(CHANGE_EVENT, item);
      _prevContentType = item.type;

      // Append container back after its content changed
      mfp.container.prepend(mfp.contentContainer);

      _mfpTrigger('AfterChange');
    },


    /**
     * Set HTML content of popup
     */
    appendContent(newContent, type) {
      mfp.content = newContent;

      if (newContent) {
        if (mfp.st.showCloseBtn && mfp.st.closeBtnInside &&
          mfp.currTemplate[type] === true) {
          // if there is no markup, we just append close button element inside
          if (!mfp.content.find('.mfp-close').length) {
            mfp.content.append(_getCloseBtn());
          }
        } else {
          mfp.content = newContent;
        }
      } else {
        mfp.content = '';
      }

      _mfpTrigger(BEFORE_APPEND_EVENT);
      mfp.container.addClass(`mfp-${type}-holder`);

      mfp.contentContainer.append(mfp.content);
    },


    /**
     * Creates Magnific Popup data object based on given data
     * @param  {int} index Index of item to parse
     */
    parseEl(index) {
      let item = mfp.items[index];
      let type;

      if (item.tagName) {
        item = { el: $(item) };
      } else {
        type = item.type;
        item = { data: item, src: item.src };
      }

      if (item.el) {
        const types = mfp.types;

        // check for 'mfp-TYPE' class
        for (let i = 0; i < types.length; i += 1) {
          if (item.el.hasClass(`mfp-${types[i]}`)) {
            type = types[i];
            break;
          }
        }

        item.src = item.el.attr('data-mfp-src');
        if (!item.src) {
          item.src = item.el.attr('href');
        }
      }

      item.type = type || mfp.st.type || 'inline';
      item.index = index;
      item.parsed = true;
      mfp.items[index] = item;
      _mfpTrigger('ElementParse', item);

      return mfp.items[index];
    },


    /**
     * Initializes single popup or a group of popups
     */
    addGroup(el, options) {
      const eHandler = function (e) {
        e.mfpEl = this;
        mfp._openClick(e, el, options);
      };

      if (!options) {
        options = {};
      }

      const eName = 'click.magnificPopup';
      options.mainEl = el;

      if (options.items) {
        options.isObj = true;
        el.off(eName).on(eName, eHandler);
      } else {
        options.isObj = false;
        if (options.delegate) {
          el.off(eName).on(eName, options.delegate, eHandler);
        } else {
          options.items = el;
          el.off(eName).on(eName, eHandler);
        }
      }
    },
    _openClick(e, el, options) {
      const midClick = options.midClick !== undefined
        ? options.midClick : $.magnificPopup.defaults.midClick;


      if (!midClick && (e.which === 2 || e.ctrlKey || e.metaKey)) {
        return;
      }

      const disableOn = options.disableOn !== undefined
        ? options.disableOn : $.magnificPopup.defaults.disableOn;

      if (disableOn) {
        if ($.isFunction(disableOn)) {
          if (!disableOn.call(mfp)) {
            return true;
          }
        } else if (_window.width() < disableOn) {
          return true;
        }
      }

      if (e.type) {
        e.preventDefault();

        // This will prevent popup from closing if element is inside and popup is already opened
        if (mfp.isOpen) {
          e.stopPropagation();
        }
      }


      options.el = $(e.mfpEl);
      if (options.delegate) {
        options.items = el.find(options.delegate);
      }
      mfp.open(options);
    },


    /**
     * Updates text on preloader
     */
    updateStatus(status, text) {
      if (mfp.preloader) {
        if (_prevStatus !== status) {
          mfp.container.removeClass(`mfp-s-${_prevStatus}`);
        }

        if (!text && status === 'loading') {
          text = mfp.st.tLoading;
        }

        const data = {
          status,
          text,
        };
        // allows to modify status
        _mfpTrigger('UpdateStatus', data);

        status = data.status;
        text = data.text;

        mfp.preloader.html(text);

        mfp.preloader.find('a').on('click', (e) => {
          e.stopImmediatePropagation();
        });

        mfp.container.addClass(`mfp-s-${status}`);
        _prevStatus = status;
      }
    },


    /*
        "Private" helpers that aren't private at all
     */
    // Check to close popup or not
    // "target" is an element that was clicked
    _checkIfClose(target) {
      if ($(target).hasClass(PREVENT_CLOSE_CLASS)) {
        return;
      }

      const closeOnContent = mfp.st.closeOnContentClick;
      const closeOnBg = mfp.st.closeOnBgClick;

      if (closeOnContent && closeOnBg) {
        return true;
      }

      // We close the popup if click is on close button or on preloader. Or if there is no content.
      if (!mfp.content || $(target).hasClass('mfp-close') || (mfp.preloader && target === mfp.preloader[0])) {
        return true;
      }

      // if click is outside the content
      if ((target !== mfp.content[0] && !$.contains(mfp.content[0], target))) {
        if (closeOnBg) {
          // last check, if the clicked element is in DOM, (in case it's removed onclick)
          if ($.contains(document, target)) {
            return true;
          }
        }
      } else if (closeOnContent) {
        return true;
      }


      return false;
    },
    _addClassToMFP(cName) {
      mfp.bgOverlay.addClass(cName);
      mfp.wrap.addClass(cName);
    },
    _removeClassFromMFP(cName) {
      this.bgOverlay.removeClass(cName);
      mfp.wrap.removeClass(cName);
    },
    _hasScrollBar(winHeight) {
      return (
        (mfp.isIE7 ?
          _document.height() : document.body.scrollHeight) > (winHeight || _window.height())
      );
    },
    _setFocus() {
      (mfp.st.focus ? mfp.content.find(mfp.st.focus).eq(0) : mfp.wrap).focus();
    },
    _onFocusIn(e) {
      if (e.target !== mfp.wrap[0] && !$.contains(mfp.wrap[0], e.target)) {
        mfp._setFocus();
        return false;
      }
    },
    _parseMarkup(template, values, item) {
      let arr;
      if (item.data) {
        values = $.extend(item.data, values);
      }
      _mfpTrigger(MARKUP_PARSE_EVENT, [template, values, item]);

      $.each(values, (key, value) => {
        if (value === undefined || value === false) {
          return true;
        }
        arr = key.split('_');
        if (arr.length > 1) {
          const el = template.find(`${EVENT_NS}-${arr[0]}`);

          if (el.length > 0) {
            const attr = arr[1];
            if (attr === 'replaceWith') {
              if (el[0] !== value[0]) {
                el.replaceWith(value);
              }
            } else if (attr === 'img') {
              if (el.is('img')) {
                el.attr('src', value);
              } else {
                el.replaceWith(`<img src="${value}" class="${el.attr('class')}" />`);
              }
            } else {
              el.attr(arr[1], value);
            }
          }
        } else {
          template.find(`${EVENT_NS}-${key}`).html(value);
        }
      });
    },

    _getScrollbarSize() {
      // thx David
      if (mfp.scrollbarSize === undefined) {
        const scrollDiv = document.createElement('div');
        scrollDiv.style.cssText = 'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
        document.body.appendChild(scrollDiv);
        mfp.scrollbarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        document.body.removeChild(scrollDiv);
      }
      return mfp.scrollbarSize;
    },

  };/* MagnificPopup core prototype end */


  /**
   * Public static functions
   */
  $.magnificPopup = {
    instance: null,
    proto: MagnificPopup.prototype,
    modules: [],

    open(options, index) {
      _checkInstance();

      if (!options) {
        options = {};
      } else {
        options = $.extend(true, {}, options);
      }


      options.isObj = true;
      options.index = index || 0;
      return this.instance.open(options);
    },

    close() {
      return $.magnificPopup.instance && $.magnificPopup.instance.close();
    },

    registerModule(name, module) {
      if (module.options) {
        $.magnificPopup.defaults[name] = module.options;
      }
      $.extend(this.proto, module.proto);
      this.modules.push(name);
    },

    defaults: {

      // Info about options is in docs:
      // http://dimsemenov.com/plugins/magnific-popup/documentation.html#options

      disableOn: 0,

      key: null,

      midClick: false,

      mainClass: '',

      preloader: true,

      focus: '', // CSS selector of input to focus after popup is opened

      closeOnContentClick: false,

      closeOnBgClick: true,

      closeBtnInside: true,

      showCloseBtn: true,

      enableEscapeKey: true,

      modal: false,

      alignTop: false,

      removalDelay: 0,

      prependTo: null,

      fixedContentPos: 'auto',

      fixedBgPos: 'auto',

      overflowY: 'auto',

      closeMarkup: '<button title="%title%" type="button" class="mfp-close">&times;</button>',

      tClose: 'Close (Esc)',

      tLoading: 'Loading...',

    },
  };


  $.fn.magnificPopup = function (options, ...args) {
    _checkInstance();

    const jqEl = $(this);

    if (!jqEl) return;

    // We call some API method of first param is a string
    if (typeof options === 'string') {
      if (options === 'open') {
        let items;
        const itemOpts = _isJQ ? jqEl.data('magnificPopup') : jqEl[0].magnificPopup;
        const index = parseInt(args[1], 10) || 0;

        if (itemOpts.items) {
          items = itemOpts.items[index];
        } else {
          items = jqEl;
          if (itemOpts.delegate) {
            items = items.find(itemOpts.delegate);
          }
          items = items.eq(index);
        }
        mfp._openClick({ mfpEl: items }, jqEl, itemOpts);
      } else if (mfp.isOpen) { mfp[options](...Array.prototype.slice.call(args, 1)); }
    } else {
      // clone options obj
      options = $.extend(true, {}, options);

      /*
       * As Zepto doesn't support .data() method for objects
       * and it works only in normal browsers
       * we assign "options" object directly to the DOM element. FTW!
       */
      if (_isJQ) {
        jqEl.data('magnificPopup', options);
      } else if (jqEl[0]) {
        jqEl[0].magnificPopup = options;
      }

      mfp.addGroup(jqEl, options);
    }
    return jqEl;
  };


  // Quick benchmark
  /*
  var start = performance.now(),
      i,
      rounds = 1000;

  for(i = 0; i < rounds; i+= 1) {

  }
  console.log('Test #1:', performance.now() - start);

  start = performance.now();
  for(i = 0; i < rounds; i+= 1) {

  }
  console.log('Test #2:', performance.now() - start);
  */


  /* >>core*/

  /* >>inline*/

  const INLINE_NS = 'inline';

  let _hiddenClass;
  let _inlinePlaceholder;
  let _lastInlineElement;

  const _putInlineElementsBack = () => {
    if (_lastInlineElement) {
      _inlinePlaceholder.after(_lastInlineElement.addClass(_hiddenClass)).detach();
      _lastInlineElement = null;
    }
  };

  $.magnificPopup.registerModule(INLINE_NS, {
    options: {
      hiddenClass: 'hide', // will be appended with `mfp-` prefix
      markup: '',
      tNotFound: 'Content not found',
    },
    proto: {

      initInline() {
        mfp.types.push(INLINE_NS);

        _mfpOn(`${CLOSE_EVENT}.${INLINE_NS}`, () => {
          _putInlineElementsBack();
        });
      },

      getInline(item, template) {
        _putInlineElementsBack();

        if (item.src) {
          const inlineSt = mfp.st.inline;
          let el = $(item.src);

          if (el.length) {
            const parent = el[0].parentNode;
            if (parent && parent.tagName) {
              if (!_inlinePlaceholder) {
                _hiddenClass = inlineSt.hiddenClass;
                _inlinePlaceholder = _getEl(_hiddenClass);
                _hiddenClass = `mfp-${_hiddenClass}`;
              }
              // replace target inline element with placeholder
              _lastInlineElement = el.after(_inlinePlaceholder).detach().removeClass(_hiddenClass);
            }

            mfp.updateStatus('ready');
          } else {
            mfp.updateStatus('error', inlineSt.tNotFound);
            el = $('<div>');
          }

          item.inlineElement = el;
          return el;
        }

        mfp.updateStatus('ready');
        mfp._parseMarkup(template, {}, item);
        return template;
      },
    },
  });

  /* >>inline*/

  /* >>ajax*/
  const AJAX_NS = 'ajax';

  let _ajaxCur;

  const _removeAjaxCursor = () => {
    if (_ajaxCur) {
      _body.removeClass(_ajaxCur);
    }
  };

  const _destroyAjaxRequest = () => {
    _removeAjaxCursor();
    if (mfp.req) {
      mfp.req.abort();
    }
  };

  $.magnificPopup.registerModule(AJAX_NS, {

    options: {
      settings: null,
      cursor: 'mfp-ajax-cur',
      tError: '<a href="%url%">The content</a> could not be loaded.',
    },

    proto: {
      initAjax() {
        mfp.types.push(AJAX_NS);
        _ajaxCur = mfp.st.ajax.cursor;

        _mfpOn(`${CLOSE_EVENT}.${AJAX_NS}`, _destroyAjaxRequest);
        _mfpOn(`BeforeChange.${AJAX_NS}`, _destroyAjaxRequest);
      },
      getAjax(item) {
        if (_ajaxCur) { _body.addClass(_ajaxCur); }

        mfp.updateStatus('loading');

        const opts = $.extend({
          url: item.src,
          success(data, textStatus, jqXHR) {
            const temp = {
              data,
              xhr: jqXHR,
            };

            _mfpTrigger('ParseAjax', temp);

            mfp.appendContent($(temp.data), AJAX_NS);

            item.finished = true;

            _removeAjaxCursor();

            mfp._setFocus();

            setTimeout(() => {
              mfp.wrap.addClass(READY_CLASS);
            }, 16);

            mfp.updateStatus('ready');

            _mfpTrigger('AjaxContentAdded');
          },
          error() {
            _removeAjaxCursor();
            item.finished = item.loadError = true;
            mfp.updateStatus('error', mfp.st.ajax.tError.replace('%url%', item.src));
          },
        }, mfp.st.ajax.settings);

        mfp.req = $.ajax(opts);

        return '';
      },
    },
  });


  /* >>ajax*/

  /* >>image*/
  let _imgInterval;

  const _getTitle = (item) => {
    if (item.data && item.data.title !== undefined) { return item.data.title; }

    const src = mfp.st.image.titleSrc;

    if (src) {
      if ($.isFunction(src)) {
        return src.call(mfp, item);
      } else if (item.el) {
        return item.el.attr(src) || '';
      }
    }
    return '';
  };

  $.magnificPopup.registerModule('image', {

    options: {
      markup: '<div class="mfp-figure">' +
        '<div class="mfp-close"></div>' +
        '<figure>' +
        '<div class="mfp-img"></div>' +
        '<figcaption>' +
        '<div class="mfp-bottom-bar">' +
        '<div class="mfp-title"></div>' +
        '<div class="mfp-counter"></div>' +
        '</div>' +
        '</figcaption>' +
        '</figure>' +
        '</div>',
      cursor: 'mfp-zoom-out-cur',
      titleSrc: 'title',
      verticalFit: true,
      tError: '<a href="%url%">The image</a> could not be loaded.',
    },

    proto: {
      initImage() {
        const imgSt = mfp.st.image;
        const ns = '.image';

        mfp.types.push('image');

        _mfpOn(OPEN_EVENT + ns, () => {
          if (mfp.currItem.type === 'image' && imgSt.cursor) {
            _body.addClass(imgSt.cursor);
          }
        });

        _mfpOn(CLOSE_EVENT + ns, () => {
          if (imgSt.cursor) {
            _body.removeClass(imgSt.cursor);
          }
          _window.off(`resize${EVENT_NS}`);
        });

        _mfpOn(`Resize${ns}`, mfp.resizeImage);
        if (mfp.isLowIE) {
          _mfpOn('AfterChange', mfp.resizeImage);
        }
      },
      resizeImage() {
        const item = mfp.currItem;
        if (!item || !item.img) return;

        if (mfp.st.image.verticalFit) {
          let decr = 0;
          // fix box-sizing in ie7/8
          if (mfp.isLowIE) {
            decr = parseInt(item.img.css('padding-top'), 10) + parseInt(item.img.css('padding-bottom'), 10);
          }
          item.img.css('max-height', mfp.wH - decr);
        }
      },
      _onImageHasSize(item) {
        if (item.img) {
          item.hasSize = true;

          if (_imgInterval) {
            clearInterval(_imgInterval);
          }

          item.isCheckingImgSize = false;

          _mfpTrigger('ImageHasSize', item);

          if (item.imgHidden) {
            if (mfp.content) { mfp.content.removeClass('mfp-loading'); }

            item.imgHidden = false;
          }
        }
      },

      /**
       * Function that loops until the image has size to display elements that rely on it asap
       */
      findImageSize(item) {
        let counter = 0;
        const img = item.img[0];

        const mfpSetInterval = (delay) => {
          if (_imgInterval) {
            clearInterval(_imgInterval);
          }
          // decelerating interval that checks for size of an image
          _imgInterval = setInterval(() => {
            if (img.naturalWidth > 0) {
              mfp._onImageHasSize(item);
              return;
            }

            if (counter > 200) {
              clearInterval(_imgInterval);
            }

            counter += 1;
            if (counter === 3) {
              mfpSetInterval(10);
            } else if (counter === 40) {
              mfpSetInterval(50);
            } else if (counter === 100) {
              mfpSetInterval(500);
            }
          }, delay);
        };

        mfpSetInterval(1);
      },

      getImage(item, template) {
        let guard = 0;

        const // image load complete handler
          onLoadComplete = () => {
            if (item) {
              if (item.img[0].complete) {
                item.img.off('.mfploader');

                if (item === mfp.currItem) {
                  mfp._onImageHasSize(item);

                  mfp.updateStatus('ready');
                }

                item.hasSize = true;
                item.loaded = true;

                _mfpTrigger('ImageLoadComplete');
              } else {
                guard += 1;
                if (guard < 200) {
                  setTimeout(onLoadComplete, 100);
                } else {
                  onLoadError();
                }
              }
            }
          };

        const // image error handler
          onLoadError = () => {
            if (item) {
              item.img.off('.mfploader');
              if (item === mfp.currItem) {
                mfp._onImageHasSize(item);
                mfp.updateStatus('error', imgSt.tError.replace('%url%', item.src));
              }

              item.hasSize = true;
              item.loaded = true;
              item.loadError = true;
            }
          };

        const imgSt = mfp.st.image;


        const el = template.find('.mfp-img');
        if (el.length) {
          let img = document.createElement('img');
          img.className = 'mfp-img';
          if (item.el && item.el.find('img').length) {
            img.alt = item.el.find('img').attr('alt');
          }
          item.img = $(img).on('load.mfploader', onLoadComplete).on('error.mfploader', onLoadError);
          img.src = item.src;

          // without clone() "error" event is not firing when IMG is replaced by new IMG
          // TODO: find a way to avoid such cloning
          if (el.is('img')) {
            item.img = item.img.clone();
          }

          img = item.img[0];
          if (img.naturalWidth > 0) {
            item.hasSize = true;
          } else if (!img.width) {
            item.hasSize = false;
          }
        }

        mfp._parseMarkup(template, {
          title: _getTitle(item),
          img_replaceWith: item.img,
        }, item);

        mfp.resizeImage();

        if (item.hasSize) {
          if (_imgInterval) clearInterval(_imgInterval);

          if (item.loadError) {
            template.addClass('mfp-loading');
            mfp.updateStatus('error', imgSt.tError.replace('%url%', item.src));
          } else {
            template.removeClass('mfp-loading');
            mfp.updateStatus('ready');
          }
          return template;
        }

        mfp.updateStatus('loading');
        item.loading = true;

        if (!item.hasSize) {
          item.imgHidden = true;
          template.addClass('mfp-loading');
          mfp.findImageSize(item);
        }

        return template;
      },
    },
  });


  /* >>image*/

  /* >>zoom*/
  let hasMozTransform;

  const getHasMozTransform = () => {
    if (hasMozTransform === undefined) {
      hasMozTransform = document.createElement('p').style.MozTransform !== undefined;
    }
    return hasMozTransform;
  };

  $.magnificPopup.registerModule('zoom', {

    options: {
      enabled: false,
      easing: 'ease-in-out',
      duration: 300,
      opener(element) {
        return element.is('img') ? element : element.find('img');
      },
    },

    proto: {

      initZoom() {
        const zoomSt = mfp.st.zoom;
        const ns = '.zoom';
        let image;

        if (!zoomSt.enabled || !mfp.supportsTransition) {
          return;
        }

        const duration = zoomSt.duration;

        const getElToAnimate = (imageb) => {
          const newImg = imageb.clone().removeAttr('style').removeAttr('class').addClass('mfp-animated-image');
          const transition = `all ${zoomSt.duration / 1000}s ${zoomSt.easing}`;

          const cssObj = {
            position: 'fixed',
            zIndex: 9999,
            left: 0,
            top: 0,
            '-webkit-backface-visibility': 'hidden',
          };

          const t = 'transition';

          cssObj[`-webkit-${t}`] = cssObj[`-moz-${t}`] = cssObj[`-o-${t}`] = cssObj[t] = transition;

          newImg.css(cssObj);
          return newImg;
        };

        const showMainContent = () => {
          mfp.content.css('visibility', 'visible');
        };

        let openTimeout;
        let animatedImg;

        _mfpOn(`BuildControls${ns}`, () => {
          if (mfp._allowZoom()) {
            clearTimeout(openTimeout);
            mfp.content.css('visibility', 'hidden');


            image = mfp._getItemToZoom();

            if (!image) {
              showMainContent();
              return;
            }

            animatedImg = getElToAnimate(image);

            animatedImg.css(mfp._getOffset());

            mfp.wrap.append(animatedImg);

            openTimeout = setTimeout(() => {
              animatedImg.css(mfp._getOffset(true));
              openTimeout = setTimeout(() => {
                showMainContent();

                setTimeout(() => {
                  animatedImg.remove();
                  image = animatedImg = null;
                  _mfpTrigger('ZoomAnimationEnded');
                }, 16); // avoid blink when switching images
              }, duration); // this timeout equals animation duration
            }, 16); // by adding this timeout we avoid short glitch at the beginning of animation


            // Lots of timeouts...
          }
        });
        _mfpOn(BEFORE_CLOSE_EVENT + ns, () => {
          if (mfp._allowZoom()) {
            clearTimeout(openTimeout);

            mfp.st.removalDelay = duration;

            if (!image) {
              image = mfp._getItemToZoom();
              if (!image) {
                return;
              }
              animatedImg = getElToAnimate(image);
            }


            animatedImg.css(mfp._getOffset(true));
            mfp.wrap.append(animatedImg);
            mfp.content.css('visibility', 'hidden');

            setTimeout(() => {
              animatedImg.css(mfp._getOffset());
            }, 16);
          }
        });

        _mfpOn(CLOSE_EVENT + ns, () => {
          if (mfp._allowZoom()) {
            showMainContent();
            if (animatedImg) {
              animatedImg.remove();
            }
            image = null;
          }
        });
      },

      _allowZoom() {
        return mfp.currItem.type === 'image';
      },

      _getItemToZoom() {
        if (mfp.currItem.hasSize) {
          return mfp.currItem.img;
        }
        return false;
      },

      // Get element postion relative to viewport
      _getOffset(isLarge) {
        let el;
        if (isLarge) {
          el = mfp.currItem.img;
        } else {
          el = mfp.st.zoom.opener(mfp.currItem.el || mfp.currItem);
        }

        const offset = el.offset();
        const paddingTop = parseInt(el.css('padding-top'), 10);
        const paddingBottom = parseInt(el.css('padding-bottom'), 10);
        offset.top -= ($(window).scrollTop() - paddingTop);

        const obj = {
          width: el.width(),
          // fix Zepto height+padding issue
          height: (_isJQ ? el.innerHeight() : el[0].offsetHeight) - paddingBottom - paddingTop,
        };

        // I hate to do this, but there is no another option
        if (getHasMozTransform()) {
          obj['-moz-transform'] = obj.transform = `translate(${offset.left}px,${offset.top}px)`;
        } else {
          obj.left = offset.left;
          obj.top = offset.top;
        }
        return obj;
      },

    },
  });


  /* >>zoom*/

  /* >>iframe*/

  const IFRAME_NS = 'iframe';

  const _emptyPage = '//about:blank';

  const _fixIframeBugs = (isShowing) => {
    if (mfp.currTemplate[IFRAME_NS]) {
      const el = mfp.currTemplate[IFRAME_NS].find('iframe');
      if (el.length) {
        if (!isShowing) {
          el[0].src = _emptyPage;
        }

        // IE8 black screen bug fix
        if (mfp.isIE8) {
          el.css('display', isShowing ? 'block' : 'none');
        }
      }
    }
  };

  $.magnificPopup.registerModule(IFRAME_NS, {

    options: {
      markup: '<div class="mfp-iframe-scaler">' +
        '<div class="mfp-close"></div>' +
        '<iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe>' +
        '</div>',

      srcAction: 'iframe_src',

      // we don't care and support only one default type of URL by default
      patterns: {
        youtube: {
          index: 'youtube.com',
          id: 'v=',
          src: '//www.youtube.com/embed/%id%?autoplay=1',
        },
        vimeo: {
          index: 'vimeo.com/',
          id: '/',
          src: '//player.vimeo.com/video/%id%?autoplay=1',
        },
        gmaps: {
          index: '//maps.google.',
          src: '%id%&output=embed',
        },
      },
    },

    proto: {
      initIframe() {
        mfp.types.push(IFRAME_NS);

        _mfpOn('BeforeChange', (e, prevType, newType) => {
          if (prevType !== newType) {
            if (prevType === IFRAME_NS) {
              _fixIframeBugs(); // iframe if removed
            } else if (newType === IFRAME_NS) {
              _fixIframeBugs(true); // iframe is showing
            }
          }// else {
          // iframe source is switched, don't do anything
          // }
        });

        _mfpOn(`${CLOSE_EVENT}.${IFRAME_NS}`, () => {
          _fixIframeBugs();
        });
      },

      getIframe(item, template) {
        let eSrc = item.src;
        const iframeSt = mfp.st.iframe;

        $.each(iframeSt.patterns, function () {
          if (eSrc.indexOf(this.index) !== -1) {
            if (this.id) {
              if (typeof this.id === 'string') {
                eSrc = eSrc.substr(eSrc.lastIndexOf(this.id) + this.id.length, eSrc.length);
              } else {
                eSrc = this.id.call(this, eSrc);
              }
            }
            eSrc = this.src.replace('%id%', eSrc);
            return false; // break;
          }
        });

        const dataObj = {};
        if (iframeSt.srcAction) {
          dataObj[iframeSt.srcAction] = eSrc;
        }
        mfp._parseMarkup(template, dataObj, item);

        mfp.updateStatus('ready');

        return template;
      },
    },
  });


  /* >>iframe*/

  /* >>gallery*/
  /**
   * Get looped index depending on number of slides
   */
  const _getLoopedId = (index) => {
    const numSlides = mfp.items.length;
    if (index > numSlides - 1) {
      return index - numSlides;
    } else if (index < 0) {
      return numSlides + index;
    }
    return index;
  };

  const _replaceCurrTotal = (text, curr, total) => text.replace(/%curr%/gi, curr + 1).replace(/%total%/gi, total);

  $.magnificPopup.registerModule('gallery', {

    options: {
      enabled: false,
      arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',
      preload: [0, 2],
      navigateByImgClick: true,
      arrows: true,

      tPrev: 'Previous (Left arrow key)',
      tNext: 'Next (Right arrow key)',
      tCounter: '%curr% of %total%',
    },

    proto: {
      initGallery() {
        const gSt = mfp.st.gallery;
        const ns = '.mfp-gallery';
        const supportsFastClick = Boolean($.fn.mfpFastClick);

        mfp.direction = true; // true - next, false - prev

        if (!gSt || !gSt.enabled) return false;

        _wrapClasses += ' mfp-gallery';

        _mfpOn(OPEN_EVENT + ns, () => {
          if (gSt.navigateByImgClick) {
            mfp.wrap.on(`click${ns}`, '.mfp-img', () => {
              if (mfp.items.length > 1) {
                mfp.next();
                return false;
              }
            });
          }

          _document.on(`keydown${ns}`, (e) => {
            if (e.keyCode === 37) {
              mfp.prev();
            } else if (e.keyCode === 39) {
              mfp.next();
            }
          });
        });

        _mfpOn(`UpdateStatus${ns}`, (e, data) => {
          if (data.text) {
            data.text = _replaceCurrTotal(data.text, mfp.currItem.index, mfp.items.length);
          }
        });

        _mfpOn(MARKUP_PARSE_EVENT + ns, (e, element, values, item) => {
          const l = mfp.items.length;
          values.counter = l > 1 ? _replaceCurrTotal(gSt.tCounter, item.index, l) : '';
        });

        _mfpOn(`BuildControls${ns}`, () => {
          if (mfp.items.length > 1 && gSt.arrows && !mfp.arrowLeft) {
            const markup = gSt.arrowMarkup;
            const arrowLeft = mfp.arrowLeft = $(markup.replace(/%title%/gi, gSt.tPrev).replace(/%dir%/gi, 'left')).addClass(PREVENT_CLOSE_CLASS);
            const arrowRight = mfp.arrowRight = $(markup.replace(/%title%/gi, gSt.tNext).replace(/%dir%/gi, 'right')).addClass(PREVENT_CLOSE_CLASS);

            const eName = supportsFastClick ? 'mfpFastClick' : 'click';
            arrowLeft[eName](() => {
              mfp.prev();
            });
            arrowRight[eName](() => {
              mfp.next();
            });

            // Polyfill for :before and :after (adds elements with classes mfp-a and mfp-b)
            if (mfp.isIE7) {
              _getEl('b', arrowLeft[0], false, true);
              _getEl('a', arrowLeft[0], false, true);
              _getEl('b', arrowRight[0], false, true);
              _getEl('a', arrowRight[0], false, true);
            }

            mfp.container.append(arrowLeft.add(arrowRight));
          }
        });

        _mfpOn(CHANGE_EVENT + ns, () => {
          if (mfp._preloadTimeout) clearTimeout(mfp._preloadTimeout);

          mfp._preloadTimeout = setTimeout(() => {
            mfp.preloadNearbyImages();
            mfp._preloadTimeout = null;
          }, 16);
        });


        _mfpOn(CLOSE_EVENT + ns, () => {
          _document.off(ns);
          mfp.wrap.off(`click${ns}`);

          if (mfp.arrowLeft && supportsFastClick) {
            mfp.arrowLeft.add(mfp.arrowRight).destroyMfpFastClick();
          }
          mfp.arrowRight = mfp.arrowLeft = null;
        });
      },
      next() {
        mfp.direction = true;
        mfp.index = _getLoopedId(mfp.index + 1);
        mfp.updateItemHTML();
      },
      prev() {
        mfp.direction = false;
        mfp.index = _getLoopedId(mfp.index - 1);
        mfp.updateItemHTML();
      },
      goTo(newIndex) {
        mfp.direction = (newIndex >= mfp.index);
        mfp.index = newIndex;
        mfp.updateItemHTML();
      },
      preloadNearbyImages() {
        const p = mfp.st.gallery.preload;
        const preloadBefore = Math.min(p[0], mfp.items.length);
        const preloadAfter = Math.min(p[1], mfp.items.length);
        let i;

        for (i = 1; i <= (mfp.direction ? preloadAfter : preloadBefore); i += 1) {
          mfp._preloadItem(mfp.index + i);
        }
        for (i = 1; i <= (mfp.direction ? preloadBefore : preloadAfter); i += 1) {
          mfp._preloadItem(mfp.index - i);
        }
      },
      _preloadItem(index) {
        index = _getLoopedId(index);

        if (mfp.items[index].preloaded) {
          return;
        }

        let item = mfp.items[index];
        if (!item.parsed) {
          item = mfp.parseEl(index);
        }

        _mfpTrigger('LazyLoad', item);

        if (item.type === 'image') {
          item.img = $('<img class="mfp-img" />').on('load.mfploader', () => {
            item.hasSize = true;
          }).on('error.mfploader', () => {
            item.hasSize = true;
            item.loadError = true;
            _mfpTrigger('LazyLoadError', item);
          }).attr('src', item.src);
        }


        item.preloaded = true;
      },
    },
  });

  /*
  Touch Support that might be implemented some day

  addSwipeGesture: function() {
      var startX,
          moved,
          multipleTouches;

          return;

      var namespace = '.mfp',
          addEventNames = function(pref, down, move, up, cancel) {
              mfp._tStart = pref + down + namespace;
              mfp._tMove = pref + move + namespace;
              mfp._tEnd = pref + up + namespace;
              mfp._tCancel = pref + cancel + namespace;
          };

      if(window.navigator.msPointerEnabled) {
          addEventNames('MSPointer', 'Down', 'Move', 'Up', 'Cancel');
      } else if('ontouchstart' in window) {
          addEventNames('touch', 'start', 'move', 'end', 'cancel');
      } else {
          return;
      }
      _window.on(mfp._tStart, function(e) {
          var oE = e.originalEvent;
          multipleTouches = moved = false;
          startX = oE.pageX || oE.changedTouches[0].pageX;
      }).on(mfp._tMove, function(e) {
          if(e.originalEvent.touches.length > 1) {
              multipleTouches = e.originalEvent.touches.length;
          } else {
              //e.preventDefault();
              moved = true;
          }
      }).on(mfp._tEnd + ' ' + mfp._tCancel, function(e) {
          if(moved && !multipleTouches) {
              var oE = e.originalEvent,
                  diff = startX - (oE.pageX || oE.changedTouches[0].pageX);

              if(diff > 20) {
                  mfp.next();
              } else if(diff < -20) {
                  mfp.prev();
              }
          }
      });
  },
  */


  /* >>gallery*/

  /* >>retina*/

  const RETINA_NS = 'retina';

  $.magnificPopup.registerModule(RETINA_NS, {
    options: {
      replaceSrc(item) {
        return item.src.replace(/\.\w+$/, m => `@2x${m}`);
      },
      ratio: 1, // Function or number.  Set to 1 to disable.
    },
    proto: {
      initRetina() {
        if (window.devicePixelRatio > 1) {
          const st = mfp.st.retina;
          let ratio = st.ratio;

          ratio = !isNaN(ratio) ? ratio : ratio();

          if (ratio > 1) {
            _mfpOn(`ImageHasSize.${RETINA_NS}`, (e, item) => {
              item.img.css({
                'max-width': item.img[0].naturalWidth / ratio,
                width: '100%',
              });
            });
            _mfpOn(`ElementParse.${RETINA_NS}`, (e, item) => {
              item.src = st.replaceSrc(item, ratio);
            });
          }
        }
      },
    },
  });

  /* >>retina*/

  /* >>fastclick*/
  /**
   * FastClick event implementation. (removes 300ms delay on touch devices)
   * Based on https://developers.google.com/mobile/articles/fast_buttons
   *
   * You may use it outside the Magnific Popup by calling just:
   *
   * $('.your-el').mfpFastClick(function() {
   *     console.log('Clicked!');
   * });
   *
   * To unbind:
   * $('.your-el').destroyMfpFastClick();
   *
   *
   * Note that it's a very basic and simple implementation,
   * it blocks ghost click on the same element where it was bound.
   * If you need something more advanced, use plugin by FT Labs https://github.com/ftlabs/fastclick
   *
   */

  ((() => {
    const ghostClickDelay = 1000;
    const supportsTouch = 'ontouchstart' in window;

    const unbindTouchMove = () => {
      _window.off(`touchmove${ns} touchend${ns}`);
    };

    const eName = 'mfpFastClick';
    const ns = `.${eName}`;

    $.fn.mfpFastClick = function (callback) {
      return $(this).each(function () {
        const elem = $(this);
        let lock;

        if (supportsTouch) {
          let timeout;
          let startX;
          let startY;
          let pointerMoved;
          let point;
          let numPointers;

          elem.on(`touchstart${ns}`, (e) => {
            pointerMoved = false;
            numPointers = 1;

            point = e.originalEvent ? e.originalEvent.touches[0] : e.touches[0];
            startX = point.clientX;
            startY = point.clientY;

            _window.on(`touchmove${ns}`, (ev) => {
              point = ev.originalEvent ? ev.originalEvent.touches : ev.touches;
              numPointers = point.length;
              point = point[0];
              if (Math.abs(point.clientX - startX) > 10 ||
                Math.abs(point.clientY - startY) > 10) {
                pointerMoved = true;
                unbindTouchMove();
              }
            }).on(`touchend${ns}`, (ev) => {
              unbindTouchMove();
              if (pointerMoved || numPointers > 1) {
                return;
              }
              lock = true;
              ev.preventDefault();
              clearTimeout(timeout);
              timeout = setTimeout(() => {
                lock = false;
              }, ghostClickDelay);
              callback();
            });
          });
        }

        elem.on(`click${ns}`, () => {
          if (!lock) {
            callback();
          }
        });
      });
    };

    $.fn.destroyMfpFastClick = function () {
      $(this).off(`touchstart${ns} click${ns}`);
      if (supportsTouch) _window.off(`touchmove${ns} touchend${ns}`);
    };
  }))();

  /* >>fastclick*/
  _checkInstance();


  return $;
};
