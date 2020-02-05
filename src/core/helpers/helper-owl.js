/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
/* eslint-disable no-continue */

export default (jQuery) => {
  /*
  *  jQuery OwlCarousel v1.3.3
  *
  *  Copyright (c) 2013 Bartosz Wojciechowski
  *  http://www.owlgraphic.com/owlcarousel/
  *
  *  Licensed under MIT
  *
  */

  if (typeof Object.create !== 'function') {
    Object.create = function (obj) {
      function F() { }
      F.prototype = obj;
      return new F();
    };
  }
  (function ($, window, document) {
    const Carousel = {
      init: function init(options, el) {
        const base = this;

        base.$elem = $(el);
        base.options = $.extend({}, $.fn.owlCarousel.options, base.$elem.data(), options);

        base.userOptions = options;
        base.loadContent();
      },

      loadContent: function loadContent() {
        const base = this;
        let url;

        function getData(data) {
          let i;
          let content = '';
          if (typeof base.options.jsonSuccess === 'function') {
            base.options.jsonSuccess.apply(this, [data]);
          } else {
            for (i in data.owl) {
              if (data.owl.hasOwnProperty(i)) {
                content += data.owl[i].item;
              }
            }
            base.$elem.html(content);
          }
          base.logIn();
        }

        if (typeof base.options.beforeInit === 'function') {
          base.options.beforeInit.apply(this, [base.$elem]);
        }

        if (typeof base.options.jsonPath === 'string') {
          url = base.options.jsonPath;
          $.getJSON(url, getData);
        } else {
          base.logIn();
        }
      },

      logIn: function logIn() {
        const base = this;

        base.$elem.data('owl-originalStyles', base.$elem.attr('style'));
        base.$elem.data('owl-originalClasses', base.$elem.attr('class'));

        base.$elem.css({ opacity: 0 });
        base.orignalItems = base.options.items;
        base.checkBrowser();
        base.wrapperWidth = 0;
        base.checkVisible = null;
        base.setVars();
      },

      setVars: function setVars() {
        const base = this;
        if (base.$elem.children().length === 0) { return false; }
        base.baseClass();
        base.eventTypes();
        base.$userItems = base.$elem.children();
        base.itemsAmount = base.$userItems.length;
        base.wrapItems();
        base.$owlItems = base.$elem.find('.owl-item');
        base.$owlWrapper = base.$elem.find('.owl-wrapper');
        base.playDirection = 'next';
        base.prevItem = 0;
        base.prevArr = [0];
        base.currentItem = 0;
        base.customEvents();
        base.onStartup();
        return true;
      },

      onStartup: function onStartup() {
        const base = this;
        base.updateItems();
        base.calculateAll();
        base.buildControls();
        base.updateControls();
        base.response();
        base.moveEvents();
        base.stopOnHover();
        base.owlStatus();

        if (base.options.transitionStyle !== false) {
          base.transitionTypes(base.options.transitionStyle);
        }
        if (base.options.autoPlay === true) {
          base.options.autoPlay = 5000;
        }
        base.play();

        base.$elem.find('.owl-wrapper').css('display', 'block');

        if (!base.$elem.is(':visible')) {
          base.watchVisibility();
        } else {
          base.$elem.css('opacity', 1);
        }
        base.onstartup = false;
        base.eachMoveUpdate();
        if (typeof base.options.afterInit === 'function') {
          base.options.afterInit.apply(this, [base.$elem]);
        }
      },

      eachMoveUpdate: function eachMoveUpdate() {
        const base = this;

        if (base.options.lazyLoad === true) {
          base.lazyLoad();
        }
        if (base.options.autoHeight === true) {
          base.autoHeight();
        }
        base.onVisibleItems();

        if (typeof base.options.afterAction === 'function') {
          base.options.afterAction.apply(this, [base.$elem]);
        }
      },

      updateVars: function updateVars() {
        const base = this;
        if (typeof base.options.beforeUpdate === 'function') {
          base.options.beforeUpdate.apply(this, [base.$elem]);
        }
        base.watchVisibility();
        base.updateItems();
        base.calculateAll();
        base.updatePosition();
        base.updateControls();
        base.eachMoveUpdate();
        if (typeof base.options.afterUpdate === 'function') {
          base.options.afterUpdate.apply(this, [base.$elem]);
        }
      },

      reload: function reload() {
        const base = this;
        window.setTimeout(() => {
          base.updateVars();
        }, 0);
      },

      watchVisibility: function watchVisibility() {
        const base = this;

        if (base.$elem.is(':visible') === false) {
          base.$elem.css({ opacity: 0 });
          window.clearInterval(base.autoPlayInterval);
          window.clearInterval(base.checkVisible);
        } else {
          return false;
        }
        base.checkVisible = window.setInterval(() => {
          if (base.$elem.is(':visible')) {
            base.reload();
            base.$elem.animate({ opacity: 1 }, 200);
            window.clearInterval(base.checkVisible);
          }
        }, 500);
        return true;
      },

      wrapItems: function wrapItems() {
        const base = this;
        base.$userItems.wrapAll('<div class="owl-wrapper">').wrap('<div class="owl-item"></div>');
        base.$elem.find('.owl-wrapper').wrap('<div class="owl-wrapper-outer">');
        base.wrapperOuter = base.$elem.find('.owl-wrapper-outer');
        base.$elem.css('display', 'block');
      },

      baseClass: function baseClass() {
        const base = this;
        const hasBaseClass = base.$elem.hasClass(base.options.baseClass);
        const hasThemeClass = base.$elem.hasClass(base.options.theme);

        if (!hasBaseClass) {
          base.$elem.addClass(base.options.baseClass);
        }

        if (!hasThemeClass) {
          base.$elem.addClass(base.options.theme);
        }
      },

      updateItems: function updateItems() {
        const base = this;
        let i;

        if (base.options.responsive === false) {
          return false;
        }
        if (base.options.singleItem === true) {
          base.options.items = base.orignalItems = 1;
          base.options.itemsCustom = false;
          base.options.itemsDesktop = false;
          base.options.itemsDesktopSmall = false;
          base.options.itemsTablet = false;
          base.options.itemsTabletSmall = false;
          base.options.itemsMobile = false;
          return false;
        }

        const width = $(base.options.responsiveBaseWidth).width();

        if (width > (base.options.itemsDesktop[0] || base.orignalItems)) {
          base.options.items = base.orignalItems;
        }
        if (base.options.itemsCustom !== false) {
          // Reorder array by screen size
          base.options.itemsCustom.sort((a, b) => (a[0] - b[0]));

          for (i = 0; i < base.options.itemsCustom.length; i += 1) {
            if (base.options.itemsCustom[i][0] <= width) {
              base.options.items = base.options.itemsCustom[i][1];
            }
          }
        } else {
          if (width <= base.options.itemsDesktop[0]
            && base.options.itemsDesktop !== false) {
            base.options.items = base.options.itemsDesktop[1];
          }

          if (width <= base.options.itemsDesktopSmall[0]
            && base.options.itemsDesktopSmall !== false) {
            base.options.items = base.options.itemsDesktopSmall[1];
          }

          if (width <= base.options.itemsTablet[0]
            && base.options.itemsTablet !== false) {
            base.options.items = base.options.itemsTablet[1];
          }

          if (width <= base.options.itemsTabletSmall[0]
            && base.options.itemsTabletSmall !== false) {
            base.options.items = base.options.itemsTabletSmall[1];
          }

          if (width <= base.options.itemsMobile[0]
            && base.options.itemsMobile !== false) {
            base.options.items = base.options.itemsMobile[1];
          }
        }

        // if number of items is less than declared
        if (base.options.items > base.itemsAmount && base.options.itemsScaleUp === true) {
          base.options.items = base.itemsAmount;
        }
        return true;
      },

      response: function response() {
        const base = this;
        let smallDelay;
        let lastWindowWidth;

        if (base.options.responsive !== true) {
          return false;
        }
        lastWindowWidth = $(window).width();

        base.resizer = function () {
          if ($(window).width() !== lastWindowWidth) {
            if (base.options.autoPlay !== false) {
              window.clearInterval(base.autoPlayInterval);
            }
            window.clearTimeout(smallDelay);
            smallDelay = window.setTimeout(() => {
              lastWindowWidth = $(window).width();
              base.updateVars();
            }, base.options.responsiveRefreshRate);
          }
        };
        $(window).resize(base.resizer);
        return true;
      },

      updatePosition: function updatePosition() {
        const base = this;
        base.jumpTo(base.currentItem);
        if (base.options.autoPlay !== false) {
          base.checkAp();
        }
      },

      appendItemsSizes: function appendItemsSizes() {
        const base = this;
        let roundPages = 0;
        const lastItem = base.itemsAmount - base.options.items;

        base.$owlItems.each(function (index) {
          const $this = $(this);
          $this
            .css({ width: base.itemWidth })
            .data('owl-item', Number(index));

          if (index % base.options.items === 0 || index === lastItem) {
            if (!(index > lastItem)) {
              roundPages += 1;
            }
          }
          $this.data('owl-roundPages', roundPages);
        });
      },

      appendWrapperSizes: function appendWrapperSizes() {
        const base = this;
        const width = base.$owlItems.length * base.itemWidth;

        base.$owlWrapper.css({
          width: width * 2,
          left: 0,
        });
        base.appendItemsSizes();
      },

      calculateAll: function calculateAll() {
        const base = this;
        base.calculateWidth();
        base.appendWrapperSizes();
        base.loops();
        base.max();
      },

      calculateWidth: function calculateWidth() {
        const base = this;
        base.itemWidth = Math.round(base.$elem.width() / base.options.items);
      },

      max: function max() {
        const ba = this;
        let maximum = ((ba.itemsAmount * ba.itemWidth) - (ba.options.items * ba.itemWidth)) * -1;
        if (ba.options.items > ba.itemsAmount) {
          ba.maximumItem = 0;
          maximum = 0;
          ba.maximumPixels = 0;
        } else {
          ba.maximumItem = ba.itemsAmount - ba.options.items;
          ba.maximumPixels = maximum;
        }
        return maximum;
      },

      min: function min() {
        return 0;
      },

      loops: function loops() {
        const base = this;
        let prev = 0;
        let elWidth = 0;
        let i;
        let item;
        let roundPageNum;

        base.positionsInArray = [0];
        base.pagesInArray = [];

        for (i = 0; i < base.itemsAmount; i += 1) {
          elWidth += base.itemWidth;
          base.positionsInArray.push(-elWidth);

          if (base.options.scrollPerPage === true) {
            item = $(base.$owlItems[i]);
            roundPageNum = item.data('owl-roundPages');
            if (roundPageNum !== prev) {
              base.pagesInArray[prev] = base.positionsInArray[i];
              prev = roundPageNum;
            }
          }
        }
      },

      buildControls: function buildControls() {
        const base = this;
        if (base.options.navigation === true || base.options.pagination === true) {
          base.owlControls = $('<div class="owl-controls"/>').toggleClass('clickable', !base.browser.isTouch).appendTo(base.$elem);
        }
        if (base.options.pagination === true) {
          base.buildPagination();
        }
        if (base.options.navigation === true) {
          base.buildButtons();
        }
      },

      buildButtons: function buildButtons() {
        const base = this;
        const buttonsWrapper = $('<div class="owl-buttons"/>');
        base.owlControls.append(buttonsWrapper);

        base.buttonPrev = $('<div/>', {
          class: 'owl-prev',
          html: base.options.navigationText[0] || '',
        });

        base.buttonNext = $('<div/>', {
          class: 'owl-next',
          html: base.options.navigationText[1] || '',
        });

        buttonsWrapper
          .append(base.buttonPrev)
          .append(base.buttonNext);

        buttonsWrapper.on('touchstart.owlControls mousedown.owlControls', 'div[class^="owl"]', (event) => {
          event.preventDefault();
        });

        buttonsWrapper.on('touchend.owlControls mouseup.owlControls', 'div[class^="owl"]', function (event) {
          event.preventDefault();
          if ($(this).hasClass('owl-next')) {
            base.next();
          } else {
            base.prev();
          }
        });
      },

      buildPagination: function buildPagination() {
        const base = this;

        base.paginationWrapper = $('<div class="owl-pagination"/>');
        base.owlControls.append(base.paginationWrapper);

        base.paginationWrapper.on('touchend.owlControls mouseup.owlControls', '.owl-page', function (event) {
          event.preventDefault();
          if (Number($(this).data('owl-page')) !== base.currentItem) {
            base.goTo(Number($(this).data('owl-page')), true);
          }
        });
      },

      updatePagination: function updatePagination() {
        const base = this;
        let counter;
        let lastItem;
        let i;
        let paginationButton;
        let paginationButtonInner;

        if (base.options.pagination === false) {
          return false;
        }

        base.paginationWrapper.html('');

        counter = 0;
        const lastPage = base.itemsAmount - (base.itemsAmount % base.options.items);

        for (i = 0; i < base.itemsAmount; i += 1) {
          if (i % base.options.items === 0) {
            counter += 1;
            if (lastPage === i) {
              lastItem = base.itemsAmount - base.options.items;
            }
            paginationButton = $('<div/>', {
              class: 'owl-page',
            });
            paginationButtonInner = $('<span></span>', {
              text: base.options.paginationNumbers === true ? counter : '',
              class: base.options.paginationNumbers === true ? 'owl-numbers' : '',
            });
            paginationButton.append(paginationButtonInner);

            paginationButton.data('owl-page', lastPage === i ? lastItem : i);
            paginationButton.data('owl-roundPages', counter);

            base.paginationWrapper.append(paginationButton);
          }
        }
        base.checkPagination();
        return true;
      },

      checkPagination: function checkPagination() {
        const base = this;
        if (base.options.pagination === false) {
          return false;
        }
        base.paginationWrapper.find('.owl-page').each(function () {
          if ($(this).data('owl-roundPages') === $(base.$owlItems[base.currentItem]).data('owl-roundPages')) {
            base.paginationWrapper
              .find('.owl-page')
              .removeClass('active');
            $(this).addClass('active');
          }
        });
        return true;
      },

      checkNavigation: function checkNavigation() {
        const base = this;

        if (base.options.navigation === false) {
          return false;
        }
        if (base.options.rewindNav === false) {
          if (base.currentItem === 0 && base.maximumItem === 0) {
            base.buttonPrev.addClass('disabled');
            base.buttonNext.addClass('disabled');
          } else if (base.currentItem === 0 && base.maximumItem !== 0) {
            base.buttonPrev.addClass('disabled');
            base.buttonNext.removeClass('disabled');
          } else if (base.currentItem === base.maximumItem) {
            base.buttonPrev.removeClass('disabled');
            base.buttonNext.addClass('disabled');
          } else if (base.currentItem !== 0 && base.currentItem !== base.maximumItem) {
            base.buttonPrev.removeClass('disabled');
            base.buttonNext.removeClass('disabled');
          }
        }
        return true;
      },

      updateControls: function updateControls() {
        const base = this;
        base.updatePagination();
        base.checkNavigation();
        if (base.owlControls) {
          if (base.options.items >= base.itemsAmount) {
            base.owlControls.hide();
          } else {
            base.owlControls.show();
          }
        }
      },

      destroyControls: function destroyControls() {
        const base = this;
        if (base.owlControls) {
          base.owlControls.remove();
        }
      },

      next: function next(spd) {
        let speed = spd;
        const base = this;

        if (base.isTransition) {
          return false;
        }

        base.currentItem += base.options.scrollPerPage === true ? base.options.items : 1;
        if (base.currentItem >
          base.maximumItem + (base.options.scrollPerPage === true ? (base.options.items - 1) : 0)) {
          if (base.options.rewindNav === true) {
            base.currentItem = 0;
            speed = 'rewind';
          } else {
            base.currentItem = base.maximumItem;
            return false;
          }
        }
        base.goTo(base.currentItem, speed);
        return true;
      },

      prev: function prev(spd) {
        let speed = spd;
        const base = this;

        if (base.isTransition) {
          return false;
        }

        if (base.options.scrollPerPage === true
          && base.currentItem > 0
          && base.currentItem < base.options.items) {
          base.currentItem = 0;
        } else {
          base.currentItem -= base.options.scrollPerPage === true ? base.options.items : 1;
        }
        if (base.currentItem < 0) {
          if (base.options.rewindNav === true) {
            base.currentItem = base.maximumItem;
            speed = 'rewind';
          } else {
            base.currentItem = 0;
            return false;
          }
        }
        base.goTo(base.currentItem, speed);
        return true;
      },

      goTo: function goTo(pos, speed, drag) {
        const base = this;
        let position = pos;

        if (base.isTransition) {
          return false;
        }
        if (typeof base.options.beforeMove === 'function') {
          base.options.beforeMove.apply(this, [base.$elem]);
        }
        if (position >= base.maximumItem) {
          position = base.maximumItem;
        } else if (position <= 0) {
          position = 0;
        }

        base.currentItem = base.owl.currentItem = position;
        if (base.options.transitionStyle !== false && drag !== 'drag' && base.options.items === 1 && base.browser.support3d === true) {
          base.swapSpeed(0);
          if (base.browser.support3d === true) {
            base.transition3d(base.positionsInArray[position]);
          } else {
            base.css2slide(base.positionsInArray[position], 1);
          }
          base.afterGo();
          base.singleItemTransition();
          return false;
        }
        const goToPixel = base.positionsInArray[position];

        if (base.browser.support3d === true) {
          base.isCss3Finish = false;

          if (speed === true) {
            base.swapSpeed('paginationSpeed');
            window.setTimeout(() => {
              base.isCss3Finish = true;
            }, base.options.paginationSpeed);
          } else if (speed === 'rewind') {
            base.swapSpeed(base.options.rewindSpeed);
            window.setTimeout(() => {
              base.isCss3Finish = true;
            }, base.options.rewindSpeed);
          } else {
            base.swapSpeed('slideSpeed');
            window.setTimeout(() => {
              base.isCss3Finish = true;
            }, base.options.slideSpeed);
          }
          base.transition3d(goToPixel);
        } else if (speed === true) {
          base.css2slide(goToPixel, base.options.paginationSpeed);
        } else if (speed === 'rewind') {
          base.css2slide(goToPixel, base.options.rewindSpeed);
        } else {
          base.css2slide(goToPixel, base.options.slideSpeed);
        }
        base.afterGo();
        return true;
      },

      jumpTo: function jumpTo(pos) {
        let position = pos;
        const base = this;
        if (typeof base.options.beforeMove === 'function') {
          base.options.beforeMove.apply(this, [base.$elem]);
        }
        if (position >= base.maximumItem || position === -1) {
          position = base.maximumItem;
        } else if (position <= 0) {
          position = 0;
        }
        base.swapSpeed(0);
        if (base.browser.support3d === true) {
          base.transition3d(base.positionsInArray[position]);
        } else {
          base.css2slide(base.positionsInArray[position], 1);
        }
        base.currentItem = base.owl.currentItem = position;
        base.afterGo();
      },

      afterGo: function afterGo() {
        const base = this;

        base.prevArr.push(base.currentItem);
        base.prevItem = base.owl.prevItem = base.prevArr[base.prevArr.length - 2];
        base.prevArr.shift(0);

        if (base.prevItem !== base.currentItem) {
          base.checkPagination();
          base.checkNavigation();
          base.eachMoveUpdate();

          if (base.options.autoPlay !== false) {
            base.checkAp();
          }
        }
        if (typeof base.options.afterMove === 'function' && base.prevItem !== base.currentItem) {
          base.options.afterMove.apply(this, [base.$elem]);
        }
      },

      stop: function stop() {
        const base = this;
        base.apStatus = 'stop';
        window.clearInterval(base.autoPlayInterval);
      },

      checkAp: function checkAp() {
        const base = this;
        if (base.apStatus !== 'stop') {
          base.play();
        }
      },

      play: function play() {
        const base = this;
        base.apStatus = 'play';
        if (base.options.autoPlay === false) {
          return false;
        }
        window.clearInterval(base.autoPlayInterval);
        base.autoPlayInterval = window.setInterval(() => {
          base.next(true);
        }, base.options.autoPlay);
        return true;
      },

      swapSpeed: function swapSpeed(action) {
        const base = this;
        if (action === 'slideSpeed') {
          base.$owlWrapper.css(base.addCssSpeed(base.options.slideSpeed));
        } else if (action === 'paginationSpeed') {
          base.$owlWrapper.css(base.addCssSpeed(base.options.paginationSpeed));
        } else if (typeof action !== 'string') {
          base.$owlWrapper.css(base.addCssSpeed(action));
        }
      },

      addCssSpeed: function addCssSpeed(speed) {
        return {
          '-webkit-transition': `all ${speed}ms ease`,
          '-moz-transition': `all ${speed}ms ease`,
          '-o-transition': `all ${speed}ms ease`,
          transition: `all ${speed}ms ease`,
        };
      },

      removeTransition: function removeTransition() {
        return {
          '-webkit-transition': '',
          '-moz-transition': '',
          '-o-transition': '',
          transition: '',
        };
      },

      doTranslate: function doTranslate(pixels) {
        return {
          '-webkit-transform': `translate3d(${pixels}px, 0px, 0px)`,
          '-moz-transform': `translate3d(${pixels}px, 0px, 0px)`,
          '-o-transform': `translate3d(${pixels}px, 0px, 0px)`,
          '-ms-transform': `translate3d(${pixels}px, 0px, 0px)`,
          transform: `translate3d(${pixels}px, 0px,0px)`,
        };
      },

      transition3d: function transition3d(value) {
        const base = this;
        base.$owlWrapper.css(base.doTranslate(value));
      },

      css2move: function css2move(value) {
        const base = this;
        base.$owlWrapper.css({ left: value });
      },

      css2slide: function css2slide(value, speed) {
        const base = this;

        base.isCssFinish = false;
        base.$owlWrapper.stop(true, true).animate(
          {
            left: value,
          }, {
            duration: speed || base.options.slideSpeed,
            complete: function complete() {
              base.isCssFinish = true;
            },
          });
      },

      checkBrowser: function checkBrowser() {
        const base = this;
        const translate3D = 'translate3d(0px, 0px, 0px)';
        const tempElem = document.createElement('div');

        tempElem.style.cssText = `  -moz-transform:${translate3D
          }; -ms-transform:${translate3D
          }; -o-transform:${translate3D
          }; -webkit-transform:${translate3D
          }; transform:${translate3D}`;
        const regex = /translate3d\(0px, 0px, 0px\)/g;
        const asSupport = tempElem.style.cssText.match(regex);
        const support3d = (asSupport !== null && asSupport.length === 1);

        const isTouch = 'ontouchstart' in window || window.navigator.msMaxTouchPoints;

        base.browser = {
          support3d,
          isTouch,
        };
      },

      moveEvents: function moveEvents() {
        const base = this;
        if (base.options.mouseDrag !== false || base.options.touchDrag !== false) {
          base.gestures();
          base.disabledEvents();
        }
      },

      eventTypes: function eventTypes() {
        const base = this;
        let types = ['s', 'e', 'x'];

        base.ev_types = {};

        if (base.options.mouseDrag === true && base.options.touchDrag === true) {
          types = [
            'touchstart.owl mousedown.owl',
            'touchmove.owl mousemove.owl',
            'touchend.owl touchcancel.owl mouseup.owl',
          ];
        } else if (base.options.mouseDrag === false && base.options.touchDrag === true) {
          types = [
            'touchstart.owl',
            'touchmove.owl',
            'touchend.owl touchcancel.owl',
          ];
        } else if (base.options.mouseDrag === true && base.options.touchDrag === false) {
          types = [
            'mousedown.owl',
            'mousemove.owl',
            'mouseup.owl',
          ];
        }

        base.ev_types.start = types[0];
        base.ev_types.move = types[1];
        base.ev_types.end = types[2];
      },

      disabledEvents: function disabledEvents() {
        const base = this;
        base.$elem.on('dragstart.owl', (event) => { event.preventDefault(); });
        base.$elem.on('mousedown.disableTextSelect', e => ($(e.target).is('input, textarea, select, option')));
      },

      gestures: function gestures() {
        /* jslint unparam: true*/
        const base = this;
        const locals = {
          offsetX: 0,
          offsetY: 0,
          baseElWidth: 0,
          relativePos: 0,
          position: null,
          minSwipe: null,
          maxSwipe: null,
          sliding: null,
          dargging: null,
          targetElement: null,
        };

        base.isCssFinish = true;

        function getTouches(event) {
          if (event.touches !== undefined) {
            return {
              x: event.touches[0].pageX,
              y: event.touches[0].pageY,
            };
          }

          if (event.touches === undefined) {
            if (event.pageX !== undefined) {
              return {
                x: event.pageX,
                y: event.pageY,
              };
            }
            if (event.pageX === undefined) {
              return {
                x: event.clientX,
                y: event.clientY,
              };
            }
          }
          return null;
        }

        function dragMove(event) {
          const ev = event.originalEvent || event || window.event;

          base.newPosX = getTouches(ev).x - locals.offsetX;
          base.newPosY = getTouches(ev).y - locals.offsetY;
          base.newRelativeX = base.newPosX - locals.relativePos;

          if (typeof base.options.startDragging === 'function' && locals.dragging !== true && base.newRelativeX !== 0) {
            locals.dragging = true;
            base.options.startDragging.apply(base, [base.$elem]);
          }

          if ((base.newRelativeX > 8
            || base.newRelativeX < -8)
            && (base.browser.isTouch === true)) {
            if (ev.preventDefault !== undefined) {
              ev.preventDefault();
            } else {
              ev.returnValue = false;
            }
            locals.sliding = true;
          }

          if ((base.newPosY > 10 || base.newPosY < -10) && locals.sliding === false) {
            $(document).off('touchmove.owl');
          }

          const minSwipe = () => (base.newRelativeX / 5);

          const maxSwipe = () => (base.maximumPixels + (base.newRelativeX / 5));

          base.newPosX = Math.max(Math.min(base.newPosX, minSwipe()), maxSwipe());
          if (base.browser.support3d === true) {
            base.transition3d(base.newPosX);
          } else {
            base.css2move(base.newPosX);
          }
        }

        function dragEnd(event) {
          let ev = event.originalEvent || event || window.event;
          let newPosition;
          let handlers;
          let owlStopEvent;

          ev = ev.target ? { ...ev, target: ev.target } : { ...ev, target: ev.srcElement };

          locals.dragging = false;

          if (base.browser.isTouch !== true) {
            base.$owlWrapper.removeClass('grabbing');
          }

          if (base.newRelativeX < 0) {
            base.dragDirection = base.owl.dragDirection = 'left';
          } else {
            base.dragDirection = base.owl.dragDirection = 'right';
          }

          if (base.newRelativeX !== 0) {
            newPosition = base.getNewPosition();
            base.goTo(newPosition, false, 'drag');
            if (locals.targetElement === ev.target && base.browser.isTouch !== true) {
              $(ev.target).on('click.disable', (e) => {
                e.stopImmediatePropagation();
                e.stopPropagation();
                e.preventDefault();
                $(ev.target).off('click.disable');
              });
              handlers = $._data(ev.target, 'events').click;
              owlStopEvent = handlers.pop();
              handlers.splice(0, 0, owlStopEvent);
            }
          }
          swapEvents('off');
        }

        function swapEvents(type) {
          if (type === 'on') {
            $(document).on(base.ev_types.move, dragMove);
            $(document).on(base.ev_types.end, dragEnd);
          } else if (type === 'off') {
            $(document).off(base.ev_types.move);
            $(document).off(base.ev_types.end);
          }
        }

        function dragStart(event) {
          const ev = event.originalEvent || event || window.event;

          if (ev.which === 3) {
            return false;
          }
          if (base.itemsAmount <= base.options.items) {
            return null;
          }
          if (base.isCssFinish === false && !base.options.dragBeforeAnimFinish) {
            return false;
          }
          if (base.isCss3Finish === false && !base.options.dragBeforeAnimFinish) {
            return false;
          }

          if (base.options.autoPlay !== false) {
            window.clearInterval(base.autoPlayInterval);
          }

          if (base.browser.isTouch !== true && !base.$owlWrapper.hasClass('grabbing')) {
            base.$owlWrapper.addClass('grabbing');
          }

          base.newPosX = 0;
          base.newRelativeX = 0;

          $(this).css(base.removeTransition());

          const position = $(this).position();
          locals.relativePos = position.left;

          locals.offsetX = getTouches(ev).x - position.left;
          locals.offsetY = getTouches(ev).y - position.top;

          swapEvents('on');

          locals.sliding = false;
          locals.targetElement = ev.target || ev.srcElement;
          return true;
        }
        base.$elem.on(base.ev_types.start, '.owl-wrapper', dragStart);
      },

      getNewPosition: function getNewPosition() {
        const base = this;
        let newPosition = base.closestItem();

        if (newPosition > base.maximumItem) {
          base.currentItem = base.maximumItem;
          newPosition = base.maximumItem;
        } else if (base.newPosX >= 0) {
          newPosition = 0;
          base.currentItem = 0;
        }
        return newPosition;
      },
      closestItem: function closestItem() {
        const base = this;
        const array = base.options.scrollPerPage === true
          ? base.pagesInArray
          : base.positionsInArray;
        const goal = base.newPosX;
        let closest = null;

        $.each(array, (i, v) => {
          if (goal - (base.itemWidth / 20) > array[i + 1] && goal - (base.itemWidth / 20) < v && base.moveDirection() === 'left') {
            closest = v;
            if (base.options.scrollPerPage === true) {
              base.currentItem = $.inArray(closest, base.positionsInArray);
            } else {
              base.currentItem = i;
            }
          } else if (goal + (base.itemWidth / 20) < v && goal + (base.itemWidth / 20) > (array[i + 1] || array[i] - base.itemWidth) && base.moveDirection() === 'right') {
            if (base.options.scrollPerPage === true) {
              closest = array[i + 1] || array[array.length - 1];
              base.currentItem = $.inArray(closest, base.positionsInArray);
            } else {
              closest = array[i + 1];
              base.currentItem = i + 1;
            }
          }
        });
        return base.currentItem;
      },

      moveDirection: function moveDirection() {
        const base = this;
        let direction;
        if (base.newRelativeX < 0) {
          direction = 'right';
          base.playDirection = 'next';
        } else {
          direction = 'left';
          base.playDirection = 'prev';
        }
        return direction;
      },

      customEvents: function customEvents() {
        const base = this;
        base.$elem.on('owl.next', () => {
          base.next();
        });
        base.$elem.on('owl.prev', () => {
          base.prev();
        });
        base.$elem.on('owl.play', (event, speed) => {
          base.options.autoPlay = speed;
          base.play();
          base.hoverStatus = 'play';
        });
        base.$elem.on('owl.stop', () => {
          base.stop();
          base.hoverStatus = 'stop';
        });
        base.$elem.on('owl.goTo', (event, item) => {
          base.goTo(item);
        });
        base.$elem.on('owl.jumpTo', (event, item) => {
          base.jumpTo(item);
        });
      },

      stopOnHover: function stopOnHover() {
        const base = this;
        if (base.options.stopOnHover === true
          && base.browser.isTouch !== true
          && base.options.autoPlay !== false) {
          base.$elem.on('mouseover', () => {
            base.stop();
          });
          base.$elem.on('mouseout', () => {
            if (base.hoverStatus !== 'stop') {
              base.play();
            }
          });
        }
      },

      lazyLoad: function lazyLoad() {
        const base = this;
        let i;
        let $item;
        let itemNumber;
        let $lazyImg;
        let follow;

        if (base.options.lazyLoad === false) {
          return false;
        }
        for (i = 0; i < base.itemsAmount; i += 1) {
          $item = $(base.$owlItems[i]);

          if ($item.data('owl-loaded') === 'loaded') {
            continue;
          }

          itemNumber = $item.data('owl-item');
          $lazyImg = $item.find('.lazyOwl');

          if (typeof $lazyImg.data('src') !== 'string') {
            $item.data('owl-loaded', 'loaded');
            continue;
          }
          if ($item.data('owl-loaded') === undefined) {
            $lazyImg.hide();
            $item.addClass('loading').data('owl-loaded', 'checked');
          }
          if (base.options.lazyFollow === true) {
            follow = itemNumber >= base.currentItem;
          } else {
            follow = true;
          }
          if (follow && itemNumber < base.currentItem + base.options.items && $lazyImg.length) {
            base.lazyPreload($item, $lazyImg);
          }
        }
        return true;
      },

      lazyPreload: function lazyPreload($item, $lazyImg) {
        const base = this;
        let iterations = 0;
        let isBackgroundImg;

        if ($lazyImg.prop('tagName') === 'DIV') {
          $lazyImg.css('background-image', `url(${$lazyImg.data('src')})`);
          isBackgroundImg = true;
        } else {
          $lazyImg[0].src = $lazyImg.data('src');
        }

        function showImage() {
          $item.data('owl-loaded', 'loaded').removeClass('loading');
          $lazyImg.removeAttr('data-src');
          if (base.options.lazyEffect === 'fade') {
            $lazyImg.fadeIn(400);
          } else {
            $lazyImg.show();
          }
          if (typeof base.options.afterLazyLoad === 'function') {
            base.options.afterLazyLoad.apply(this, [base.$elem]);
          }
        }

        function checkLazyImage() {
          iterations += 1;
          if (base.completeImg($lazyImg.get(0)) || isBackgroundImg === true) {
            showImage();
          } else if (iterations <= 100) {
            // if image loads in less than 10 seconds
            window.setTimeout(checkLazyImage, 100);
          } else {
            showImage();
          }
        }

        checkLazyImage();
      },

      autoHeight: function autoHeight() {
        const base = this;
        const $currentimg = $(base.$owlItems[base.currentItem]).find('img');
        let iterations;

        function addHeight() {
          const $currentItem = $(base.$owlItems[base.currentItem]).height();
          base.wrapperOuter.css('height', `${$currentItem}px`);
          if (!base.wrapperOuter.hasClass('autoHeight')) {
            window.setTimeout(() => {
              base.wrapperOuter.addClass('autoHeight');
            }, 0);
          }
        }

        function checkImage() {
          iterations += 1;
          if (base.completeImg($currentimg.get(0))) {
            addHeight();
          } else if (iterations <= 100) { // if image loads in less than 10 seconds
            window.setTimeout(checkImage, 100);
          } else {
            base.wrapperOuter.css('height', ''); // Else remove height attribute
          }
        }

        if ($currentimg.get(0) !== undefined) {
          iterations = 0;
          checkImage();
        } else {
          addHeight();
        }
      },

      completeImg: function completeImg(img) {
        if (!img.complete) {
          return false;
        }
        const naturalWidthType = typeof img.naturalWidth;
        if (naturalWidthType !== 'undefined' && img.naturalWidth === 0) {
          return false;
        }
        return true;
      },

      onVisibleItems: function onVisibleItems() {
        const base = this;
        let i;

        if (base.options.addClassActive === true) {
          base.$owlItems.removeClass('active');
        }
        base.visibleItems = [];
        for (i = base.currentItem; i < base.currentItem + base.options.items; i += 1) {
          base.visibleItems.push(i);

          if (base.options.addClassActive === true) {
            $(base.$owlItems[i]).addClass('active');
          }
        }
        base.owl.visibleItems = base.visibleItems;
      },

      transitionTypes: function transitionTypes(className) {
        const base = this;
        // Currently available: "fade", "backSlide", "goDown", "fadeUp"
        base.outClass = `owl-${className}-out`;
        base.inClass = `owl-${className}-in`;
      },

      singleItemTransition: function singleItemTransition() {
        const base = this;
        const outClass = base.outClass;
        const inClass = base.inClass;
        const $currentItem = base.$owlItems.eq(base.currentItem);
        const $prevItem = base.$owlItems.eq(base.prevItem);
        const prevPos =
          Math.abs(base.positionsInArray[base.currentItem]) + base.positionsInArray[base.prevItem];
        const origin = Math.abs(base.positionsInArray[base.currentItem]) + (base.itemWidth / 2);
        const animEnd = 'webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend';

        base.isTransition = true;

        base.$owlWrapper
          .addClass('owl-origin')
          .css({
            '-webkit-transform-origin': `${origin}px`,
            '-moz-perspective-origin': `${origin}px`,
            'perspective-origin': `${origin}px`,
          });
        function transStyles(prevPosition) {
          return {
            position: 'relative',
            left: `${prevPosition}px`,
          };
        }

        $prevItem
          .css(transStyles(prevPos, 10))
          .addClass(outClass)
          .on(animEnd, () => {
            base.endPrev = true;
            $prevItem.off(animEnd);
            base.clearTransStyle($prevItem, outClass);
          });

        $currentItem
          .addClass(inClass)
          .on(animEnd, () => {
            base.endCurrent = true;
            $currentItem.off(animEnd);
            base.clearTransStyle($currentItem, inClass);
          });
      },

      clearTransStyle: function clearTransStyle(item, classToRemove) {
        const base = this;
        item.css({
          position: '',
          left: '',
        }).removeClass(classToRemove);

        if (base.endPrev && base.endCurrent) {
          base.$owlWrapper.removeClass('owl-origin');
          base.endPrev = false;
          base.endCurrent = false;
          base.isTransition = false;
        }
      },

      owlStatus: function owlStatus() {
        const base = this;
        base.owl = {
          userOptions: base.userOptions,
          baseElement: base.$elem,
          userItems: base.$userItems,
          owlItems: base.$owlItems,
          currentItem: base.currentItem,
          prevItem: base.prevItem,
          visibleItems: base.visibleItems,
          isTouch: base.browser.isTouch,
          browser: base.browser,
          dragDirection: base.dragDirection,
        };
      },

      clearEvents: function clearEvents() {
        const base = this;
        base.$elem.off('.owl owl mousedown.disableTextSelect');
        $(document).off('.owl owl');
        $(window).off('resize', base.resizer);
      },

      unWrap: function unWrap() {
        const base = this;
        if (base.$elem.children().length !== 0) {
          base.$owlWrapper.unwrap();
          base.$userItems.unwrap().unwrap();
          if (base.owlControls) {
            base.owlControls.remove();
          }
        }
        base.clearEvents();
        base.$elem
          .attr('style', base.$elem.data('owl-originalStyles') || '')
          .attr('class', base.$elem.data('owl-originalClasses'));
      },

      destroy: function destroy() {
        const base = this;
        base.stop();
        window.clearInterval(base.checkVisible);
        base.unWrap();
        base.$elem.removeData();
      },

      reinit: function reinit(newOptions) {
        const base = this;
        const options = $.extend({}, base.userOptions, newOptions);
        base.unWrap();
        base.init(options, base.$elem);
      },

      addItem: function addItem(htmlString, targetPosition) {
        const base = this;
        let position;

        if (!htmlString) { return false; }

        if (base.$elem.children().length === 0) {
          base.$elem.append(htmlString);
          base.setVars();
          return false;
        }
        base.unWrap();
        if (targetPosition === undefined || targetPosition === -1) {
          position = -1;
        } else {
          position = targetPosition;
        }
        if (position >= base.$userItems.length || position === -1) {
          base.$userItems.eq(-1).after(htmlString);
        } else {
          base.$userItems.eq(position).before(htmlString);
        }

        base.setVars();
        return true;
      },

      removeItem: function removeItem(targetPosition) {
        const base = this;
        let position;

        if (base.$elem.children().length === 0) {
          return false;
        }
        if (targetPosition === undefined || targetPosition === -1) {
          position = -1;
        } else {
          position = targetPosition;
        }

        base.unWrap();
        base.$userItems.eq(position).remove();
        base.setVars();
        return true;
      },

    };

    $.fn.owlCarousel = function owlCarousel(options) {
      return this.each((i, el) => {
        if ($(el).data('owl-init') === true) {
          return false;
        }
        $(el).data('owl-init', true);
        const carousel = Object.create(Carousel);
        carousel.init(options, el);
        $.data(el, 'owlCarousel', carousel);
        return true;
      });
    };

    $.fn.owlCarousel.options = {

      items: 5,
      itemsCustom: false,
      itemsDesktop: [1199, 4],
      itemsDesktopSmall: [979, 3],
      itemsTablet: [768, 2],
      itemsTabletSmall: false,
      itemsMobile: [479, 1],
      singleItem: false,
      itemsScaleUp: false,

      slideSpeed: 200,
      paginationSpeed: 800,
      rewindSpeed: 1000,

      autoPlay: false,
      stopOnHover: false,

      navigation: false,
      navigationText: ['prev', 'next'],
      rewindNav: true,
      scrollPerPage: false,

      pagination: true,
      paginationNumbers: false,

      responsive: true,
      responsiveRefreshRate: 200,
      responsiveBaseWidth: window,

      baseClass: 'owl-carousel',
      theme: 'owl-theme',

      lazyLoad: false,
      lazyFollow: true,
      lazyEffect: 'fade',

      autoHeight: false,

      jsonPath: false,
      jsonSuccess: false,

      dragBeforeAnimFinish: true,
      mouseDrag: true,
      touchDrag: true,

      addClassActive: false,
      transitionStyle: false,

      beforeUpdate: false,
      afterUpdate: false,
      beforeInit: false,
      afterInit: false,
      beforeMove: false,
      afterMove: false,
      afterAction: false,
      startDragging: false,
      afterLazyLoad: false,
    };
  }(jQuery, window, document));


  /*! ResponsiveSlides.js v1.54
  * http://responsiveslides.com
  * http://viljamis.com
  *
  * Copyright (c) 2011-2012 @viljamis
  * Available under the MIT license
  */

  (function ($, window, ind) {
    let i = ind;

    $.fn.responsiveSlides = function (options) {
      // Default settings
      const settings = $.extend({
        auto: true,             // Boolean: Animate automatically, true or false
        speed: 500,             // Integer: Speed of the transition, in milliseconds
        timeout: 4000,          // Integer: Time between slide transitions, in milliseconds
        pager: false,           // Boolean: Show pager, true or false
        nav: false,             // Boolean: Show navigation, true or false
        random: false,          // Boolean: Randomize the order of the slides, true or false
        pause: false,           // Boolean: Pause on hover, true or false
        pauseControls: true,    // Boolean: Pause when hovering controls, true or false
        prevText: 'Previous',   // String: Text for the "previous" button
        nextText: 'Next',       // String: Text for the "next" button
        maxwidth: '',           // Integer: Max-width of the slideshow, in pixels
        navContainer: '',       // Selector: Where auto generated controls should be appended to, default is after the <ul>
        manualControls: '',     // Selector: Declare custom pager navigation
        namespace: 'rslides',   // String: change the default namespace used
        before: $.noop,         // Function: Before callback
        after: $.noop,           // Function: After callback
      }, options);

      return this.each((j, el) => {
        // Index for namespacing
        i += 1;

        const $this = $(el);

        // Local variables
        let vendor;
        let selectTab;
        let startCycle;
        let restartCycle;
        let rotate;
        let $tabs;

        // Helpers
        let index = 0;
        const $slide = $this.children();
        const length = $slide.size();
        const fadeTime = parseFloat(settings.speed);
        const waitTime = parseFloat(settings.timeout);
        const maxw = parseFloat(settings.maxwidth);

        // Namespacing
        const namespace = settings.namespace;
        const namespaceIdx = namespace + i;

        // Classes
        const navClass = `${namespace}_nav ${namespaceIdx}_nav`;
        const activeClass = `${namespace}_here`;
        const visibleClass = `${namespaceIdx}_on`;
        const slideClassPrefix = `${namespaceIdx}_s`;

        // Pager
        let $pager = $(`<ul class='${namespace}_tabs ${namespaceIdx}_tabs' />`);

        // Styles for visible and hidden slides
        const visible = { float: 'left', position: 'relative', opacity: 1, zIndex: 2 };
        const hidden = { float: 'none', position: 'absolute', opacity: 0, zIndex: 1 };

        // Detect transition support
        const supportsTransitions = (function () {
          const docBody = document.body || document.documentElement;
          const styles = docBody.style;
          let prop = 'transition';
          if (typeof styles[prop] === 'string') {
            return true;
          }
          // Tests for vendor specific prop
          vendor = ['Moz', 'Webkit', 'Khtml', 'O', 'ms'];
          prop = prop.charAt(0).toUpperCase() + prop.substr(1);
          for (let k = 0; k < vendor.length; k += 1) {
            if (typeof styles[vendor[k] + prop] === 'string') {
              return true;
            }
          }
          return false;
        }());

        // Fading animation
        const slideTo = function (idx) {
          settings.before(idx);
          // If CSS3 transitions are supported
          if (supportsTransitions) {
            $slide
              .removeClass(visibleClass)
              .css(hidden)
              .eq(idx)
              .addClass(visibleClass)
              .css(visible);
            index = idx;
            setTimeout(() => {
              settings.after(idx);
            }, fadeTime);
            // If not, use jQuery fallback
          } else {
            $slide
              .stop()
              .fadeOut(fadeTime, function () {
                $(this)
                  .removeClass(visibleClass)
                  .css(hidden)
                  .css('opacity', 1);
              })
              .eq(idx)
              .fadeIn(fadeTime, function () {
                $(this)
                  .addClass(visibleClass)
                  .css(visible);
                settings.after(idx);
                index = idx;
              });
          }
        };

        // Random order
        if (settings.random) {
          $slide.sort(() => (Math.round(Math.random()) - 0.5));
          $this
            .empty()
            .append($slide);
        }

        // Add ID's to each slide
        $slide.each((k) => {
          // $(elem).id = slideClassPrefix + k;
          this.id = slideClassPrefix + k;
        });

        // Add max-width and classes
        $this.addClass(`${namespace} ${namespaceIdx}`);
        if (options && options.maxwidth) {
          $this.css('max-width', maxw);
        }

        // Hide all slides, then show first one
        $slide
          .hide()
          .css(hidden)
          .eq(0)
          .addClass(visibleClass)
          .css(visible)
          .show();

        // CSS transitions
        if (supportsTransitions) {
          $slide
            .show()
            .css({
              // -ms prefix isn't needed as IE10 uses prefix free version
              '-webkit-transition': `opacity ${fadeTime}ms ease-in-out`,
              '-moz-transition': `opacity ${fadeTime}ms ease-in-out`,
              '-o-transition': `opacity ${fadeTime}ms ease-in-out`,
              transition: `opacity ${fadeTime}ms ease-in-out`,
            });
        }

        // Only run if there's more than one slide
        if ($slide.size() > 1) {
          // Make sure the timeout is at least 100ms longer than the fade
          if (waitTime < fadeTime + 100) {
            return;
          }

          // Pager
          if (settings.pager && !settings.manualControls) {
            let tabMarkup = [];
            $slide.each((k) => {
              const n = k + 1;
              tabMarkup +=
                `<li><a href='#' class='${slideClassPrefix}${n}'>${n}</a></li>`;
            });
            $pager.append(tabMarkup);

            // Inject pager
            if (options.navContainer) {
              $(settings.navContainer).append($pager);
            } else {
              $this.after($pager);
            }
          }

          // Manual pager controls
          if (settings.manualControls) {
            $pager = $(settings.manualControls);
            $pager.addClass(`${namespace}_tabs ${namespaceIdx}_tabs`);
          }

          // Add pager slide class prefixes
          if (settings.pager || settings.manualControls) {
            $pager.find('li').each((k, elem) => {
              $(elem).addClass(slideClassPrefix + (k + 1));
            });
          }

          // If we have a pager, we need to set up the selectTab function
          if (settings.pager || settings.manualControls) {
            $tabs = $pager.find('a');

            // Select pager item
            selectTab = function (idx) {
              $tabs
                .closest('li')
                .removeClass(activeClass)
                .eq(idx)
                .addClass(activeClass);
            };
          }

          // Auto cycle
          if (settings.auto) {
            startCycle = function () {
              rotate = setInterval(() => {
                // Clear the event queue
                $slide.stop(true, true);

                const idx = index + 1 < length ? index + 1 : 0;

                // Remove active state and set new if pager is set
                if (settings.pager || settings.manualControls) {
                  selectTab(idx);
                }

                slideTo(idx);
              }, waitTime);
            };

            // Init cycle
            startCycle();
          }

          // Restarting cycle
          restartCycle = function () {
            if (settings.auto) {
              // Stop
              clearInterval(rotate);
              // Restart
              startCycle();
            }
          };

          // Pause on hover
          if (settings.pause) {
            $this.hover(() => {
              clearInterval(rotate);
            }, () => {
              restartCycle();
            });
          }

          // Pager click event handler
          if (settings.pager || settings.manualControls) {
            $tabs.bind('click', function (e) {
              e.preventDefault();

              if (!settings.pauseControls) {
                restartCycle();
              }

              // Get index of clicked tab
              const idx = $tabs.index(this);

              // Break if element is already active or currently animated
              if (index === idx || $(`.${visibleClass}`).queue('fx').length) {
                return;
              }

              // Remove active state from old tab and set new one
              selectTab(idx);

              // Do the animation
              slideTo(idx);
            })
              .eq(0)
              .closest('li')
              .addClass(activeClass);

            // Pause when hovering pager
            if (settings.pauseControls) {
              $tabs.hover(() => {
                clearInterval(rotate);
              }, () => {
                restartCycle();
              });
            }
          }

          // Navigation
          if (settings.nav) {
            const navMarkup =
              `<a href='#' class='${navClass} prev'>${settings.prevText}</a>` +
              `<a href='#' class='${navClass} next'>${settings.nextText}</a>`;

            // Inject navigation
            if (options.navContainer) {
              $(settings.navContainer).append(navMarkup);
            } else {
              $this.after(navMarkup);
            }

            const $trigger = $(`.${namespaceIdx}_nav`);
            const $prev = $trigger.filter('.prev');

            // Click event handler
            $trigger.bind('click', function (e) {
              e.preventDefault();

              const $visibleClass = $(`.${visibleClass}`);

              // Prevent clicking if currently animated
              if ($visibleClass.queue('fx').length) {
                return;
              }

              //  Adds active class during slide animation
              //  $(this)
              //    .addClass(namespace + "_active")
              //    .delay(fadeTime)
              //    .queue(function (next) {
              //      $(this).removeClass(namespace + "_active");
              //      next();
              //  });

              // Determine where to slide
              const idx = $slide.index($visibleClass);
              const prevIdx = idx - 1;
              const nextIdx = idx + 1 < length ? index + 1 : 0;

              // Go to slide
              slideTo($(this)[0] === $prev[0] ? prevIdx : nextIdx);
              if (settings.pager || settings.manualControls) {
                selectTab($(this)[0] === $prev[0] ? prevIdx : nextIdx);
              }

              if (!settings.pauseControls) {
                restartCycle();
              }
            });

            // Pause when hovering navigation
            if (settings.pauseControls) {
              $trigger.hover(() => {
                clearInterval(rotate);
              }, () => {
                restartCycle();
              });
            }
          }
        }

        // Max-width fallback
        if (typeof document.body.style.maxWidth === 'undefined' && options.maxwidth) {
          const widthSupport = function widthSupport() {
            $this.css('width', '100%');
            if ($this.width() > maxw) {
              $this.css('width', maxw);
            }
          };

          // Init fallback
          widthSupport();
          $(window).bind('resize', () => {
            widthSupport();
          });
        }
      });
    };
  }(jQuery, this, 0));


  return jQuery;
};
