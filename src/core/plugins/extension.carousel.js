import { TweenLite, Expo } from 'gsap';

/* global Hammer YT $f $ */
/* eslint-disable no-param-reassign */
/* eslint-disable operator-assignment */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-mixed-operators */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-eval */
/* eslint-disable no-continue */
/* eslint-disable new-parens */
/* eslint-disable new-cap */
/* eslint-disable no-cond-assign */
/* eslint-disable no-use-before-define */
/* eslint max-len: ["error", 150] */

export default ($) => {
  const _R = $.fn.revolution;


  // //////////////////////////
  // // CAROUSEL FUNCTIONS ////
  // //////////////////////////

  const defineCarouselElements = function defineCarouselElements(opt) {
    const _ = opt.carousel;

    _.infbackup = _.infinity;
    _.maxVisiblebackup = _.maxVisibleItems;
    // SET DEFAULT OFFSETS TO 0
    _.slide_globaloffset = 'none';
    _.slide_offset = 0;
    // SET UL REFERENCE
    _.wrap = opt.c.find('.tp-carousel-wrapper');
    // COLLECT SLIDES
    _.slides = opt.c.find('.tp-revslider-slidesli');

    // SET PERSPECTIVE IF ROTATION IS ADDED
    if (_.maxRotation !== 0) {
      if (opt.parallax.type !== '3D' && opt.parallax.type !== '3d') {
        TweenLite.set(_.wrap, { perspective: 1200, transformStyle: 'flat' });
      } else {
        TweenLite.set(_.wrap, { perspective: 1600, transformStyle: 'preserve-3d' });
      }
    }

    if (_.border_radius !== undefined && parseInt(_.border_radius, 0) > 0) {
      TweenLite.set(opt.c.find('.tp-revslider-slidesli'), { borderRadius: _.border_radius });
    }
  };

  const setCarouselDefaults = function setCarouselDefaults(opt) {
    if (opt.bw === undefined) _R.setSize(opt);
    const _ = opt.carousel;
    const loff = _R.getHorizontalOffset(opt.c, 'left');
    const roff = _R.getHorizontalOffset(opt.c, 'right');

    // IF NO DEFAULTS HAS BEEN DEFINED YET
    if (_.wrap === undefined) defineCarouselElements(opt);
    // DEFAULT LI WIDTH SHOULD HAVE THE SAME WIDTH OF TH OPT WIDTH
    _.slide_width = _.stretch !== 'on' ? opt.gridwidth[opt.curWinRange] * opt.bw : opt.c.width();

    // CALCULATE CAROUSEL WIDTH
    _.maxwidth = opt.slideamount * _.slide_width;
    if (_.maxVisiblebackup > _.slides.length + 1) { _.maxVisibleItems = _.slides.length + 2; }

    // SET MAXIMUM CAROUSEL WARPPER WIDTH (SHOULD BE AN ODD NUMBER)
    _.wrapwidth = (_.maxVisibleItems * _.slide_width) + ((_.maxVisibleItems - 1) * _.space);
    _.wrapwidth = opt.sliderLayout !== 'auto' ?
      _.wrapwidth > opt.c.closest('.tp-simpleresponsive').width() ? opt.c.closest('.tp-simpleresponsive').width() : _.wrapwidth :
      _.wrapwidth > opt.ul.width() ? opt.ul.width() : _.wrapwidth;


    // INFINITY MODIFICATIONS
    _.infinity = _.wrapwidth >= _.maxwidth ? 'off' : _.infbackup;


    // SET POSITION OF WRAP CONTAINER
    _.wrapoffset = _.horizontal_align === 'center' ? (opt.c.width() - roff - loff - _.wrapwidth) / 2 : 0;
    _.wrapoffset = opt.sliderLayout !== 'auto' && opt.outernav ? 0 : _.wrapoffset < loff ? loff : _.wrapoffset;

    let ovf = 'hidden';
    if ((opt.parallax.type === '3D' || opt.parallax.type === '3d')) { ovf = 'visible'; }


    if (_.horizontal_align === 'right') {
      TweenLite.set(_.wrap, { left: 'auto', right: `${_.wrapoffset}px`, width: _.wrapwidth, overflow: ovf });
    } else {
      TweenLite.set(_.wrap, { right: 'auto', left: `${_.wrapoffset}px`, width: _.wrapwidth, overflow: ovf });
    }


    // INNER OFFSET FOR RTL
    _.inneroffset = _.horizontal_align === 'right' ? _.wrapwidth - _.slide_width : 0;

    // THE REAL OFFSET OF THE WRAPPER
    _.realoffset = (Math.abs(_.wrap.position().left)); // + opt.c.width()/2);

    // THE SCREEN WIDTH/2
    _.windhalf = $(window).width() / 2;
  };


  // DIRECTION CHECK
  const dircheck = function dircheck(d, b) {
    return d === null || $.isEmptyObject(d) ? b : d === undefined ? 'right' : d;
  };

  // ANIMATE THE CAROUSEL WITH OFFSETS
  const animateCarousel = function animateCarousel(opt, direction, nsae) {
    const _ = opt.carousel;
    direction = _.lastdirection = dircheck(direction, _.lastdirection);

    const animobj = {};
    animobj.from = 0;
    animobj.to = _.slide_offset_target;
    if (_.positionanim !== undefined) { _.positionanim.pause(); }
    _.positionanim = TweenLite.to(animobj, 1.2, {
      from: animobj.to,
      onUpdate() {
        _.slide_offset = _.slide_globaloffset + animobj.from;
        _.slide_offset = _R.simp(_.slide_offset, _.maxwidth);
        _R.organiseCarousel(opt, direction, false, false);
      },
      onComplete() {
        _.slide_globaloffset = _.infinity === 'off'
          ? _.slide_globaloffset + _.slide_offset_target
          : _R.simp(_.slide_globaloffset + _.slide_offset_target, _.maxwidth);
        _.slide_offset = _R.simp(_.slide_offset, _.maxwidth);

        _R.organiseCarousel(opt, direction, false, true);
        const li = $(opt.li[_.focused]);
        opt.c.find('.next-revslide').removeClass('next-revslide');
        if (nsae) _R.callingNewSlide(opt, opt.c, li.data('index'));
      },
      ease: Expo.easeOut,
    });
  };

  const breduc = function breduc(a, m) {
    return Math.abs(a) > Math.abs(m) ? a > 0 ? a - Math.abs(Math.floor(a / (m)) * (m)) : a + Math.abs(Math.floor(a / (m)) * (m)) : a;
  };

  // CAROUSEL INFINITY MODE, DOWN OR UP ANIMATION
  const getBestDirection = function getBestDirection(a, b, max) {
    let dira = b - a;
    let dirb = (b - max) - a;
    dira = breduc(dira, max);
    dirb = breduc(dirb, max);
    return Math.abs(dira) > Math.abs(dirb) ? dirb : dira;
  };

  // GET OFFSETS BEFORE ANIMATION
  const getActiveCarouselOffset = function getActiveCarouselOffset(opt) {
    let ret = 0;
    const _ = opt.carousel;

    if (_.positionanim !== undefined) _.positionanim.kill();

    if (_.slide_globaloffset === 'none') {
      _.slide_globaloffset = ret = _.horizontal_align === 'center' ? (_.wrapwidth / 2 - _.slide_width / 2) : 0;
    } else {
      _.slide_globaloffset = _.slide_offset;
      _.slide_offset = 0;
      let ci = opt.c.find('.processing-revslide').index();
      let fi = _.horizontal_align === 'center'
        ? ((_.wrapwidth / 2 - _.slide_width / 2) - _.slide_globaloffset) / _.slide_width
        : (0 - _.slide_globaloffset) / _.slide_width;

      fi = _R.simp(fi, opt.slideamount, false);
      ci = ci >= 0 ? ci : opt.c.find('.active-revslide').index();
      ci = ci >= 0 ? ci : 0;

      ret = _.infinity === 'off' ? fi - ci : -getBestDirection(fi, ci, opt.slideamount);
      ret = ret * _.slide_width;
    }
    return ret;
  };

  // /////////////////////////////////////////
  // //EXTENDED FUNCTIONS AVAILABLE GLOBAL  //
  // /////////////////////////////////////////
  $.extend(true, _R, {

    // CALCULATE CAROUSEL POSITIONS
    prepareCarousel: function prepareCarousel(opt, a, direction) {
      direction = opt.carousel.lastdirection = dircheck(direction, opt.carousel.lastdirection);
      setCarouselDefaults(opt);

      opt.carousel.slide_offset_target = getActiveCarouselOffset(opt);

      if (a === undefined) { _R.carouselToEvalPosition(opt, direction); } else { animateCarousel(opt, direction, false); }
    },

    // MOVE FORWARDS/BACKWARDS DEPENDING ON THE OFFSET TO GET CAROUSEL IN EVAL POSITION AGAIN
    carouselToEvalPosition: function carouselToEvalPosition(opt, direction) {
      const _ = opt.carousel;
      direction = _.lastdirection = dircheck(direction, _.lastdirection);

      const bb = _.horizontal_align === 'center'
        ? ((_.wrapwidth / 2 - _.slide_width / 2) - _.slide_globaloffset) / _.slide_width
        : (0 - _.slide_globaloffset) / _.slide_width;
      const fi = _R.simp(bb, opt.slideamount, false);
      const cm = fi - Math.floor(fi);
      let calc = 0;
      const mc = -1 * (Math.ceil(fi) - fi);
      const mf = -1 * (Math.floor(fi) - fi);

      calc = cm >= 0.3 && direction === 'left' || cm >= 0.7 && direction === 'right'
        ? mc : cm < 0.3 && direction === 'left' || cm < 0.7 && direction === 'right' ? mf
          : calc;
      calc = _.infinity === 'off' ? fi < 0 ? fi : bb > opt.slideamount - 1 ? bb - (opt.slideamount - 1) : calc : calc;

      _.slide_offset_target = calc * _.slide_width;
      // LONGER "SMASH" +/- 1 to Calc

      if (Math.abs(_.slide_offset_target) !== 0) { animateCarousel(opt, direction, true); } else {
        _R.organiseCarousel(opt, direction);
      }
    },

    // ORGANISE THE CAROUSEL ELEMENTS IN POSITION AND TRANSFORMS
    organiseCarousel: function organiseCarousel(opt, direction, setmaind, unli) {
      direction = direction === undefined || direction === 'down' || direction === 'up' || direction === null || $.isEmptyObject(direction)
        ? 'left'
        : direction;
      const _ = opt.carousel;
      const slidepositions = [];
      const len = _.slides.length;

      for (let i = 0; i < len; i += 1) {
        let pos = (i * _.slide_width) + _.slide_offset;
        if (_.infinity === 'on') {
          pos = pos > _.wrapwidth - _.inneroffset && direction === 'right' ? _.slide_offset - ((_.slides.length - i) * _.slide_width) : pos;
          pos = pos < 0 - _.inneroffset - _.slide_width && direction === 'left' ? pos + _.maxwidth : pos;
        }
        slidepositions[i] = pos;
      }
      let maxd = 999;

      // SECOND RUN FOR NEGATIVE ADJUSTMENETS
      if (_.slides) {
        $.each(_.slides, (i, slide) => {
          let pos = slidepositions[i];
          if (_.infinity === 'on') {
            pos = pos > _.wrapwidth - _.inneroffset && direction === 'left' ? slidepositions[0] - ((len - i) * _.slide_width) : pos;
            pos = pos < 0 - _.inneroffset - _.slide_width
              ? direction === 'left'
                ? pos + _.maxwidth
                : direction === 'right'
                  ? slidepositions[len - 1] + ((i + 1) * _.slide_width)
                  : pos
              : pos;
          }

          const tr = {};

          tr.left = pos + _.inneroffset;

          // CHCECK DISTANCES FROM THE CURRENT FAKE FOCUS POSITION
          const d = _.horizontal_align === 'center'
            ? (Math.abs(_.wrapwidth / 2) - (tr.left + _.slide_width / 2)) / _.slide_width
            : (_.inneroffset - tr.left) / _.slide_width;

          const ha = _.horizontal_align === 'center' ? 2 : 1;


          if ((setmaind && Math.abs(d) < maxd) || d === 0) {
            maxd = Math.abs(d);
            _.focused = i;
          }

          tr.width = _.slide_width;
          tr.x = 0;
          tr.transformPerspective = 1200;
          tr.transformOrigin = `50% ${_.vertical_align}`;

          // SET VISIBILITY OF ELEMENT
          if (_.fadeout === 'on') {
            if (_.vary_fade === 'on') { tr.autoAlpha = 1 - Math.abs(((1 / Math.ceil(_.maxVisibleItems / ha)) * d)); } else {
              switch (_.horizontal_align) {
                case 'center': {
                  tr.autoAlpha = Math.abs(d) < Math.ceil((_.maxVisibleItems / ha) - 1) ? 1 : 1 - (Math.abs(d) - Math.floor(Math.abs(d)));
                  break;
                }
                case 'left': {
                  tr.autoAlpha = d < 1 && d > 0 ? 1 - d : Math.abs(d) > _.maxVisibleItems - 1 ? 1 - (Math.abs(d) - (_.maxVisibleItems - 1)) : 1;
                  break;
                }
                case 'right': {
                  tr.autoAlpha = d > -1 && d < 0 ? 1 - Math.abs(d) : d > _.maxVisibleItems - 1 ? 1 - (Math.abs(d) - (_.maxVisibleItems - 1)) : 1;
                  break;
                }
                default:
              }
            }
          } else { tr.autoAlpha = Math.abs(d) < Math.ceil((_.maxVisibleItems / ha)) ? 1 : 0; }


          // SET SCALE DOWNS
          // let sx;
          if (_.minScale !== undefined && _.minScale > 0) {
            if (_.vary_scale === 'on') {
              tr.scale = 1 - Math.abs(((_.minScale / 100 / Math.ceil(_.maxVisibleItems / ha)) * d));
              // sx = (_.slide_width - (_.slide_width * tr.scale)) * Math.abs(d);
            } else {
              tr.scale = d >= 1 || d <= -1 ? 1 - _.minScale / 100 : (100 - (_.minScale * Math.abs(d))) / 100;
              // sx = (_.slide_width - (_.slide_width * (1 - _.minScale / 100))) * Math.abs(d);
            }
          }

          // ROTATION FUNCTIONS
          if (_.maxRotation !== undefined && Math.abs(_.maxRotation) !== 0) {
            if (_.vary_rotation === 'on') {
              tr.rotationY = Math.abs(_.maxRotation) - Math.abs((1 - Math.abs(((1 / Math.ceil(_.maxVisibleItems / ha)) * d))) * _.maxRotation);
              tr.autoAlpha = Math.abs(tr.rotationY) > 90 ? 0 : tr.autoAlpha;
            } else {
              tr.rotationY = d >= 1 || d <= -1 ? _.maxRotation : Math.abs(d) * _.maxRotation;
            }
            tr.rotationY = d < 0 ? tr.rotationY * -1 : tr.rotationY;
          }

          // SET SPACES BETWEEN ELEMENTS
          tr.x = (-1 * _.space) * d;

          tr.left = Math.floor(tr.left);
          tr.x = Math.floor(tr.x);

          // ADD EXTRA SPACE ADJUSTEMENT IF COVER MODE IS SELECTED
          // tr.scale !== undefined ? d < 0 ? tr.x - sx : tr.x + sx : tr.x;

          // ZINDEX ADJUSTEMENT
          tr.zIndex = Math.round(100 - Math.abs(d * 5));

          // TRANSFORM STYLE
          tr.transformStyle = opt.parallax.type !== '3D' && opt.parallax.type !== '3d' ? 'flat' : 'preserve-3d';


          // ADJUST TRANSFORMATION OF SLIDE
          TweenLite.set(slide, tr);
        });
      }

      if (unli) {
        opt.c.find('.next-revslide').removeClass('next-revslide');
        $(_.slides[_.focused]).addClass('next-revslide');
        opt.c.trigger('revolution.nextslide.waiting');
      }
    },
  });
};
