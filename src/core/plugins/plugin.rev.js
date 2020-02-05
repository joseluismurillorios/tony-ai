/* eslint-disable no-restricted-syntax */
/* eslint-disable no-restricted-globals */
/* eslint-disable prefer-destructuring */
import {
  TimelineLite, TweenLite, Power3, Linear,
} from 'gsap';
import getLayeranimation from './extension.layeranimation';
import getNavigation from './extension.navigation';
import getParallax from './extension.parallax';
import getSlidesAnims from './extension.slideanims';

// import getCarousel from './extension.carousel';
// import getVideo from './extension.video';
// import getActions from './extension.actions';
// import getKenburn from './extension.kenburn';
// import getMigration from './extension.migration';


/* global YT */
/* eslint-disable no-param-reassign */
/* eslint-disable operator-assignment */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-mixed-operators */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-eval */
/* eslint-disable no-continue */
/* eslint-disable max-lenght */
/* eslint-disable no-cond-assign */
/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */


export default ($) => {
  const removeArray = function removeArray(arr, i) {
    const newarr = [];
    $.each(arr, (a, b) => {
      if (a !== i) newarr.push(b);
    });
    return newarr;
  };

  const removeNavWithLiref = function removeNavWithLiref(a, ref, opt) {
    opt.c.find(a).each((i, el) => {
      const e = $(el);
      if (e.data('liref') === ref) { e.remove(); }
    });
  };

  const lAjax = function lAjax(s) {
    if ($('body').data(s)) return false;
    switch (s) {
      case 'slideanims':
        getSlidesAnims($);
        break;
      case 'layeranimation':
        getLayeranimation($);
        break;
      case 'navigation':
        getNavigation($);
        break;
      case 'parallax':
        getParallax($);
        break;
      case 'video':
        // getVideo($);
        break;
      case 'carousel':
        // getCarousel($);
        break;
      case 'actions':
        // getActions($);
        break;
      case 'kenburn':
        // getKenburn($);
        break;
      case 'migration':
        // getMigration($);
        break;
      default:
        break;
    }

    // console.log(s);
    // console.log(o);
    return true;
  };

  const getNeededScripts = function getNeededScripts(o, c) {
    const n = {};
    const _n = o.navigation;

    n.kenburns = false;
    n.parallax = false;
    n.carousel = false;
    n.navigation = false;
    n.videos = false;
    n.actions = false;
    n.layeranim = false;
    n.migration = false;


    // MIGRATION EXTENSION
    if (!c.data('version') || !c.data('version').toString().match(/5./gi)) {
      n.kenburns = true;
      n.parallax = true;
      n.carousel = false;
      n.navigation = true;
      n.videos = true;
      n.actions = true;
      n.layeranim = true;
      n.migration = true;
    } else {
      // KEN BURN MODUL
      c.find('img').each((i, el) => {
        if ($(el).data('kenburns') === 'on') n.kenburns = true;
      });

      // NAVIGATION EXTENSTION
      if (o.sliderType === 'carousel'
      || _n.keyboardNavigation === 'on'
      || _n.mouseScrollNavigation === 'on'
      || _n.touch.touchenabled === 'on'
      || _n.arrows.enable
      || _n.bullets.enable
      || _n.thumbnails.enable
      || _n.tabs.enable) {
        n.navigation = true;
      }
      // console.log('needed extensions: ', n);

      // LAYERANIM, VIDEOS, ACTIONS EXTENSIONS
      c.find('.tp-caption, .tp-static-layer, .rs-background-video-layer').each((i, el) => {
        const _nc = $(el);
        if ((_nc.data('ytid') !== undefined || _nc.find('iframe').length > 0 && _nc.find('iframe').attr('src').toLowerCase().indexOf('youtube') > 0)) {
          n.videos = true;
        }
        if ((_nc.data('vimeoid') !== undefined || _nc.find('iframe').length > 0 && _nc.find('iframe').attr('src').toLowerCase().indexOf('vimeo') > 0)) {
          n.videos = true;
        }
        if (_nc.data('actions') !== undefined) {
          n.actions = true;
        }
        n.layeranim = true;
      });

      c.find('li').each((i, el) => {
        if ($(el).data('link') && $(el).data('link') !== undefined) {
          n.layeranim = true;
          n.actions = true;
        }
      });

      // VIDEO EXTENSION
      if (!n.videos && (c.find('.rs-background-video-layer').length > 0
      || c.find('.tp-videolayer').length > 0
      || c.find('.tp-audiolayer').length > 0
      || c.find('iframe').length > 0
      || c.find('video').length > 0)) {
        n.videos = true;
      }

      // VIDEO EXTENSION
      if (o.sliderType === 'carousel') { n.carousel = true; }


      if (o.parallax.type !== 'off' || o.viewPort.enable || o.viewPort.enable === 'true') { n.parallax = true; }
    }

    if (o.sliderType === 'hero') {
      n.carousel = false;
      n.navigation = false;
    }

    if (window.location.href.match(/file:/gi)) {
      n.filesystem = true;
      o.filesystem = true;
    } else {
      n.filesystem = false;
      o.filesystem = false;
    }


    // LOAD THE NEEDED LIBRARIES
    if (n.videos && typeof _R.isVideoPlaying === 'undefined') lAjax('video', o);
    if (n.carousel && typeof _R.prepareCarousel === 'undefined') lAjax('carousel', o);
    if (!n.carousel && typeof _R.animateSlide === 'undefined') lAjax('slideanims', o);
    if (n.actions && typeof _R.checkActions === 'undefined') lAjax('actions', o);
    if (n.layeranim && typeof _R.handleStaticLayers === 'undefined') lAjax('layeranimation', o);
    if (n.kenburns && typeof _R.stopKenBurn === 'undefined') lAjax('kenburn', o);
    if (n.navigation && typeof _R.createNavigation === 'undefined') lAjax('navigation', o);
    if (n.migration && typeof _R.migration === 'undefined') lAjax('migration', o);
    if (n.parallax && typeof _R.checkForParallax === 'undefined') lAjax('parallax', o);

    if (o.addons !== undefined && o.addons.length > 0) {
      $.each(o.addons, (i, obj) => {
        if (typeof obj === 'object' && obj.fileprefix !== undefined) {
          lAjax(obj.fileprefix, o);
        }
      });
    }


    return n;
  };

  const cArray = function cArray(b, l) {
    if (!$.isArray(b)) {
      const t = b;
      b = [];
      b.push(t);
    }
    if (b.length < l) {
      const t = b[b.length - 1];
      for (let i = 0; i < (l - b.length) + 2; i += 1) { b.push(t); }
    }
    return b;
  };

  const checkHoverDependencies = function checkHoverDependencies(_nc, opt) {
    if (_nc.data('start') === 'sliderenter') {
      if (opt.layersonhover === undefined) {
        opt.c.on('tp-mouseenter', () => {
          if (opt.layersonhover) {
            $.each(opt.layersonhover, (i, tnc) => {
              tnc.data('animdirection', 'in');
              const otl = tnc.data('timeline_out');
              const baseOffsetx = opt.sliderType === 'carousel' ? 0 : opt.width / 2 - (opt.gridwidth[opt.curWinRange] * opt.bw) / 2;
              const baseOffsety = 0;
              const cli = tnc.closest('.tp-revslider-slidesli');
              const stl = tnc.closest('.tp-static-layers');

              if ((cli.length > 0 && (cli.hasClass('active-revslide')) || cli.hasClass('processing-revslide')) || (stl.length > 0)) {
                if (otl !== undefined) {
                  otl.pause(0);
                  otl.kill();
                }
                _R.animateSingleCaption(tnc, opt, baseOffsetx, baseOffsety, 0, false, true);
                const tl = tnc.data('timeline');
                tnc.data('triggerstate', 'on');
                tl.play(0);
              }
            });
          }
        });
        opt.c.on('tp-mouseleft', () => {
          if (opt.layersonhover) {
            $.each(opt.layersonhover, (i, tnc) => {
              tnc.data('animdirection', 'out');
              tnc.data('triggered', true);
              tnc.data('triggerstate', 'off');
              if (_R.stopVideo) _R.stopVideo(tnc, opt);
              if (_R.endMoveCaption) _R.endMoveCaption(tnc, null, null, opt);
            });
          }
        });
        opt.layersonhover = [];
      }
      opt.layersonhover.push(_nc);
    }
  };


  const contWidthManager = function contWidthManager(opt) {
    const rl = _R.getHorizontalOffset(opt.c, 'left');

    if (opt.sliderLayout !== 'auto' && (opt.sliderLayout !== 'fullscreen' || opt.fullScreenAutoWidth !== 'on')) {
      const loff = Math.ceil(opt.c.closest('.forcefullwidth_wrapper_tp_banner').offset().left - rl);
      TweenLite.set(opt.c.parent(), { left: `${0 - loff}px`, width: $(window).width() - _R.getHorizontalOffset(opt.c, 'both') });
    } else if (opt.sliderLayout === 'fullscreen' && opt.fullScreenAutoWidth === 'on') {
      TweenLite.set(opt.ul, { left: 0, width: opt.c.width() });
    } else {
      TweenLite.set(opt.ul, { left: rl, width: opt.c.width() - _R.getHorizontalOffset(opt.c, 'both') });
    }


    // put Static Layer Wrapper in Position
    if (opt.slayers && (opt.sliderLayout !== 'fullwidth' && opt.sliderLayout !== 'fullscreen')) { TweenLite.set(opt.slayers, { left: rl }); }
  };

  const hideSliderUnder = function hideSliderUnder(container, opt, resized) {
    // FIRST TIME STOP/START HIDE / SHOW SLIDER
    // REMOVE AND SHOW SLIDER ON DEMAND
    const contpar = container.parent();
    if ($(window).width() < opt.hideSliderAtLimit) {
      container.trigger('stoptimer');
      if (contpar.css('display') !== 'none') { contpar.data('olddisplay', contpar.css('display')); }
      contpar.css({ display: 'none' });
    } else if (container.is(':hidden') && resized) {
      if (contpar.data('olddisplay') !== undefined && contpar.data('olddisplay') !== 'undefined' && contpar.data('olddisplay') !== 'none') {
        contpar.css({ display: contpar.data('olddisplay') });
      } else {
        contpar.css({ display: 'block' });
      }
      container.trigger('restarttimer');
      setTimeout(() => {
        containerResized(container, opt);
      }, 150);
    }
    if (_R.hideUnHideNav) _R.hideUnHideNav(opt);
  };

  // /////////////////////////////////
  //   -  WAIT FOR SCRIPT LOADS  - //
  // /////////////////////////////////
  const waitForScripts = function waitForScripts(c, o) {
    // CHECK KEN BURN DEPENDENCIES
    let addonsloaded = true;

    const n = o.scriptsneeded;

    // CHECK FOR ADDONS
    if (o.addons !== undefined && o.addons.length > 0) {
      $.each(o.addons, (i, obj) => {
        if (typeof obj === 'object' && obj.init !== undefined) {
          if (_R[obj.init] === undefined) addonsloaded = false;
        }
      });
    }

    if (n.filesystem
      || ((addonsloaded)
        && (!n.kenburns || (n.kenburns && typeof _R.stopKenBurn !== 'undefined'))
        && (!n.navigation || (n.navigation && typeof _R.createNavigation !== 'undefined'))
        && (!n.carousel || (n.carousel && typeof _R.prepareCarousel !== 'undefined'))
        && (!n.videos || (n.videos && typeof _R.resetVideo !== 'undefined'))
        && (!n.actions || (n.actions && typeof _R.checkActions !== 'undefined'))
        && (!n.layeranim || (n.layeranim && typeof _R.handleStaticLayers !== 'undefined'))
        && (!n.migration || (n.migration && typeof _R.migration !== 'undefined'))
        && (!n.parallax || (n.parallax && typeof _R.checkForParallax !== 'undefined'))
        && (n.carousel || (!n.carousel && typeof _R.animateSlide !== 'undefined'))
      )) { c.trigger('scriptsloaded'); } else {
      setTimeout(() => {
        waitForScripts(c, o);
      }, 50);
    }
  };

  // ////////////////////////////////////////
  // - ADVANCED RESPONSIVE LEVELS - //
  // ////////////////////////////////////////
  const setCurWinRange = function setCurWinRange(opt, vis) {
    let curwidth = 9999;
    let lastmaxlevel = 0;
    let lastmaxid = 0;
    let curid = 0;
    const winw = $(window).width();
    const l = vis && opt.responsiveLevels === 9999 ? opt.visibilityLevels : opt.responsiveLevels;

    if (l && l.length) {
      $.each(l, (index, level) => {
        if (winw < level) {
          if (lastmaxlevel === 0 || lastmaxlevel > level) {
            curwidth = level;
            curid = index;
            lastmaxlevel = level;
          }
        }

        if (winw > level && lastmaxlevel < level) {
          lastmaxlevel = level;
          lastmaxid = index;
        }
      });
    }

    if (lastmaxlevel < curwidth) { curid = lastmaxid; }


    if (!vis) { opt.curWinRange = curid; } else { opt.forcedWinRange = curid; }
  };

  // ////////////////////////////////////////
  // - INITIALISATION OF OPTIONS  - //
  // ////////////////////////////////////////
  const prepareOptions = function prepareOptions(container, opt) {
    opt.carousel.maxVisibleItems = opt.carousel.maxVisibleItems < 1
      ? 999
      : opt.carousel.maxVisibleItems;

    opt.carousel.vertical_align = opt.carousel.vertical_align === 'top'
      ? '0%'
      : opt.carousel.vertical_align === 'bottom' ? '100%' : '50%';
  };

  const gWiderOut = function gWiderOut(c, cl) {
    let r = 0;
    c.find(cl).each((i, el) => {
      const a = $(el);
      if (!a.hasClass('tp-forcenotvisible') && r < a.outerWidth()) { r = a.outerWidth(); }
    });
    return r;
  };

  // ////////////////////////////////////////
  // - INITIALISATION OF SLIDER - //
  // ////////////////////////////////////////

  const runSlider = function runSlider(container, opt) {
    opt.sliderisrunning = true;
    // Save Original Index of Slides
    opt.ul.find('>li').each((i, el) => {
      $(el).data('originalindex', i);
    });


    // RANDOMIZE THE SLIDER SHUFFLE MODE
    if (opt.shuffle === 'on') {
      const fsa = {};
      const fli = opt.ul.find('>li:first-child');
      fsa.fstransition = fli.data('fstransition');
      fsa.fsmasterspeed = fli.data('fsmasterspeed');
      fsa.fsslotamount = fli.data('fsslotamount');

      for (let u = 0; u < opt.slideamount; u += 1) {
        const it = Math.round(Math.random() * opt.slideamount);
        opt.ul.find(`>li:eq(${it})`).prependTo(opt.ul);
      }

      const newfli = opt.ul.find('>li:first-child');
      newfli.data('fstransition', fsa.fstransition);
      newfli.data('fsmasterspeed', fsa.fsmasterspeed);
      newfli.data('fsslotamount', fsa.fsslotamount);

      // COLLECT ALL LI INTO AN ARRAY
      opt.li = opt.ul.find('>li').not('.tp-invisible-slide');
    }

    opt.allli = opt.ul.find('>li');
    opt.li = opt.ul.find('>li').not('.tp-invisible-slide');
    opt.inli = opt.ul.find('>li.tp-invisible-slide');


    opt.thumbs = [];

    opt.slots = 4;
    opt.act = -1;
    opt.firststart = 1;
    opt.loadqueue = [];
    opt.syncload = 0;
    opt.conw = container.width();
    opt.conh = container.height();

    if (opt.responsiveLevels.length > 1) {
      opt.responsiveLevels[0] = 9999;
    } else {
      opt.responsiveLevels = 9999;
    }

    // RECORD THUMBS AND SET INDEXES
    $.each(opt.allli, (index, lii) => {
      const li = $(lii);
      const img = li.find('.rev-slidebg') || li.find('img').first();


      li.addClass('tp-revslider-slidesli');
      if (li.data('index') === undefined) li.data('index', `rs-${Math.round(Math.random() * 999999)}`);

      const obj = {};
      obj.params = [];

      obj.id = li.data('index');
      obj.src = li.data('thumb') !== undefined ? li.data('thumb') : img.data('lazyload') !== undefined ? img.data('lazyload') : img.attr('src');
      if (li.data('title') !== undefined) obj.params.push({ from: RegExp('\\{\\{title\\}\\}', 'g'), to: li.data('title') });
      if (li.data('description') !== undefined) obj.params.push({ from: RegExp('\\{\\{description\\}\\}', 'g'), to: li.data('description') });
      for (let i = 1; i <= 10; i += 1) {
        if (li.data(`param${i}`) !== undefined) { obj.params.push({ from: RegExp(`\\{\\{param${i}\\}\\}`, 'g'), to: li.data(`param${i}`) }); }
      }
      opt.thumbs.push(obj);

      li.data('origindex', li.index());

      // IF LINK ON SLIDE EXISTS, NEED TO CREATE A PROPER LAYER FOR IT.
      if (li.data('link') !== undefined) {
        const link = li.data('link');
        const target = li.data('target') || '_self';
        const zindex = li.data('slideindex') === 'back' ? 0 : 60;
        let linktoslide = li.data('linktoslide');
        const checksl = linktoslide;

        if (linktoslide !== undefined) {
          if (linktoslide !== 'next' && linktoslide !== 'prev') {
            opt.allli.each((i, el) => {
              const t = $(el);
              if (t.data('origindex') + 1 === checksl) linktoslide = t.data('index');
            });
          }
        }


        if (link !== 'slide') linktoslide = 'no';

        let apptxt = `<div class="tp-caption slidelink" style="cursor:pointer;width:100%;height:100%;z-index:${zindex};" data-x="center" data-y="center" data-basealign="slide" `;

        const jts = linktoslide === 'scroll_under' ? '[{"event":"click","action":"scrollbelow","offset":"100px","delay":"0"}]'
          : linktoslide === 'prev' ? '[{"event":"click","action":"jumptoslide","slide":"prev","delay":"0.2"}]'
            : linktoslide === 'next' ? '[{"event":"click","action":"jumptoslide","slide":"next","delay":"0.2"}]' : `[{"event":"click","action":"jumptoslide","slide":"${linktoslide}","delay":"0.2"}]`;

        apptxt = linktoslide === 'no' ? `${apptxt} data-start="0">` : `${apptxt}data-actions='${jts}' data-start="0">`;
        apptxt = `${apptxt}<a style="width:100%;height:100%;display:block"`;
        apptxt = link !== 'slide' ? `${apptxt} target="${target}" href="${link}"` : apptxt;
        apptxt = `${apptxt}><span style="width:100%;height:100%;display:block"></span></a></div>`;
        li.append(apptxt);
      }
    });


    // CREATE GRID WIDTH AND HEIGHT ARRAYS
    opt.rle = opt.responsiveLevels.length || 1;
    opt.gridwidth = cArray(opt.gridwidth, opt.rle);
    opt.gridheight = cArray(opt.gridheight, opt.rle);
    // END OF VERSION 5.0 INIT MODIFICATION


    // SIMPLIFY ANIMATIONS ON OLD IOS AND IE8 IF NEEDED
    if (opt.simplifyAll === 'on' && (_R.isIE(8) || _R.iOSVersion())) {
      container.find('.tp-caption').each((i, el) => {
        const tc = $(el);
        tc.removeClass('customin customout').addClass('fadein fadeout');
        tc.data('splitin', '');
        tc.data('speed', 400);
      });
      opt.allli.each((i, el) => {
        const li = $(el);
        li.data('transition', 'fade');
        li.data('masterspeed', 500);
        li.data('slotamount', 1);
        const img = li.find('.rev-slidebg') || li.find('>img').first();
        img.data('kenburns', 'off');
      });
    }

    opt.desktop = !navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|BB10|mobi|tablet|opera mini|nexus 7)/i);

    // SOME OPTIONS WHICH SHOULD CLOSE OUT SOME OTHER SETTINGS
    opt.autoHeight = opt.sliderLayout === 'fullscreen' ? 'on' : opt.autoHeight;

    if (opt.sliderLayout === 'fullwidth' && opt.autoHeight === 'off') container.css({ maxHeight: `${opt.gridheight[opt.curWinRange]}px` });

    // BUILD A FORCE FULLWIDTH CONTAINER, TO SPAN THE FULL SLIDER TO THE FULL WIDTH OF BROWSER
    if (opt.sliderLayout !== 'auto' && container.closest('.forcefullwidth_wrapper_tp_banner').length === 0) {
      if (opt.sliderLayout !== 'fullscreen' || opt.fullScreenAutoWidth !== 'on') {
        const cp = container.parent();
        let mb = cp.css('marginBottom');
        let mt = cp.css('marginTop');
        mb = mb === undefined ? 0 : mb;
        mt = mt === undefined ? 0 : mt;

        cp.wrap(`<div class="forcefullwidth_wrapper_tp_banner" style="position:relative;width:100%;height:auto;margin-top:${mt};margin-bottom:${mb}"></div>`);
        container.closest('.forcefullwidth_wrapper_tp_banner').append(`<div class="tp-fullwidth-forcer" style="width:100%;height:${container.height()}px"></div>`);
        container.parent().css({ marginTop: '0px', marginBottom: '0px' });
        container.parent().css({ position: 'absolute' });
      }
    }


    // SHADOW ADD ONS
    if (opt.shadow !== undefined && opt.shadow > 0) {
      container.parent().addClass(`tp-shadow${opt.shadow}`);
      container.parent().append('<div class="tp-shadowcover"></div>');
      container.parent().find('.tp-shadowcover').css({ backgroundColor: container.parent().css('backgroundColor'), backgroundImage: container.parent().css('backgroundImage') });
    }

    // ESTIMATE THE CURRENT WINDOWS RANGE INDEX
    setCurWinRange(opt);
    setCurWinRange(opt, true);

    // IF THE CONTAINER IS NOT YET INITIALISED, LETS GO FOR IT
    if (!container.hasClass('revslider-initialised')) {
      // MARK THAT THE CONTAINER IS INITIALISED WITH SLIDER REVOLUTION ALREADY
      container.addClass('revslider-initialised');

      // FOR BETTER SELECTION, ADD SOME BASIC CLASS
      container.addClass('tp-simpleresponsive');

      // WE DONT HAVE ANY ID YET ? WE NEED ONE ! LETS GIVE ONE RANDOMLY FOR RUNTIME
      if (container.attr('id') === undefined) container.attr('id', `revslider-${Math.round(Math.random() * 1000 + 5)}`);

      // CHECK IF FIREFOX 13 IS ON WAY.. IT HAS A STRANGE BUG, CSS ANIMATE SHOULD NOT BE USED
      opt.firefox13 = false;
      opt.ie = !$.support.opacity;
      opt.ie9 = (document.documentMode === 9);

      opt.origcd = opt.delay;


      // CHECK THE jQUERY VERSION
      const version = $.fn.jquery.split('.');

      const versionTop = parseFloat(version[0]);
      const versionMinor = parseFloat(version[1]);
      if (versionTop === 1 && versionMinor < 7) { container.html(`<div style="text-align:center; padding:40px 0px; font-size:20px; color:#992222;"> The Current Version of $:${version} <br>Please update your $ Version to min. 1.7 in Case you wish to use the Revolution Slider Plugin</div>`); }
      if (versionTop > 1) opt.ie = false;


      // PREPARE VIDEO PLAYERS
      let addedApis = {};
      addedApis.addedyt = 0;
      addedApis.addedvim = 0;
      addedApis.addedvid = 0;

      container.find('.tp-caption, .rs-background-video-layer').each((i, el) => {
        const _nc = $(el);
        let an = _nc.data('autoplayonlyfirsttime');
        let ap = _nc.data('autoplay');
        const al = _nc.hasClass('tp-audiolayer');
        let loop = _nc.data('videoloop');


        if (_nc.hasClass('tp-static-layer') && _R.handleStaticLayers) { _R.handleStaticLayers(_nc, opt); }

        const pom = _nc.data('noposteronmobile') || _nc.data('noPosterOnMobile') || _nc.data('posteronmobile') || _nc.data('posterOnMobile') || _nc.data('posterOnMObile');
        _nc.data('noposteronmobile', pom);

        // FIX VISIBLE IFRAME BUG IN SAFARI
        let iff = 0;
        _nc.find('iframe').each((j, ele) => {
          TweenLite.set($(ele), { autoAlpha: 0 });
          iff += 1;
        });
        if (iff > 0) { _nc.data('iframes', true); }

        if (_nc.hasClass('tp-caption')) {
          // PREPARE LAYERS AND WRAP THEM WITH PARALLAX, LOOP, MASK HELP CONTAINERS
          const ec = _nc.hasClass('slidelink') ? 'width:100% !important;height:100% !important;' : '';
          _nc.wrap(`<div class="tp-parallax-wrap" style="${ec}position:absolute;visibility:hidden"><div class="tp-loop-wrap" style="${ec}position:absolute;"><div class="tp-mask-wrap" style="${ec}position:absolute" ></div></div></div>`);
          const lar = ['pendulum', 'rotate', 'slideloop', 'pulse', 'wave'];
          const _lc = _nc.closest('.tp-loop-wrap');

          $.each(lar, (j, k) => {
            const lw = _nc.find(`.rs-${k}`);
            const f = lw.data() || '';
            if (f !== '') {
              _lc.data(f);
              _lc.addClass(`rs-${k}`);
              lw.children(0).unwrap();
              _nc.data('loopanimation', 'on');
            }
          });
          TweenLite.set(_nc, { visibility: 'hidden' });
        }

        const as = _nc.data('actions');
        if (as !== undefined) _R.checkActions(_nc, opt, as);

        checkHoverDependencies(_nc, opt);

        if (_R.checkVideoApis) { addedApis = _R.checkVideoApis(_nc, opt, addedApis); }

        // REMOVE VIDEO AUTOPLAYS FOR MOBILE DEVICES
        if (_ISM) {
          if (an === true || an === 'true') {
            _nc.data('autoplayonlyfirsttime', 'false');
            an = false;
          }
          if (ap === true || ap === 'true' || ap === 'on' || ap === '1sttime') {
            _nc.data('autoplay', 'off');
            ap = 'off';
          }
        }

        loop = loop === 'none' && _nc.hasClass('rs-background-video-layer') ? 'loopandnoslidestop' : loop;

        _nc.data('videoloop', loop);


        // PREPARE TIMER BEHAVIOUR BASED ON AUTO PLAYED VIDEOS IN SLIDES
        if (!al && (an === true || an === 'true' || ap === '1sttime') && loop !== 'loopandnoslidestop') { _nc.closest('li.tp-revslider-slidesli').addClass('rs-pause-timer-once'); }


        if (!al && (ap === true || ap === 'true' || ap === 'on' || ap === 'no1sttime') && loop !== 'loopandnoslidestop') { _nc.closest('li.tp-revslider-slidesli').addClass('rs-pause-timer-always'); }
      });

      container.hover(
        () => {
          container.trigger('tp-mouseenter');
          opt.overcontainer = true;
        },
        () => {
          container.trigger('tp-mouseleft');
          opt.overcontainer = false;
        },
      );


      container.on('mouseover', () => {
        container.trigger('tp-mouseover');
        opt.overcontainer = true;
      });

      // REMOVE ANY VIDEO JS SETTINGS OF THE VIDEO  IF NEEDED
      // (OLD FALL BACK, AND HELP FOR 3THD PARTY PLUGIN CONFLICTS)
      container.find('.tp-caption video').each((i, el) => {
        const v = $(el);
        v.removeClass('video-js vjs-default-skin');
        v.attr('preload', '');
        v.css({ display: 'none' });
      });

      // PREPARE LOADINGS ALL IN SEQUENCE
      if (opt.sliderType !== 'standard') opt.lazyType = 'all';


      // PRELOAD STATIC LAYERS
      loadImages(container.find('.tp-static-layers'), opt, 0);

      waitForCurrentImages(container.find('.tp-static-layers'), opt, () => {
        container.find('.tp-static-layers img').each((i, el) => {
          const e = $(el);
          const src = e.data('lazyload') !== undefined ? e.data('lazyload') : e.attr('src');
          const loadobj = getLoadObj(opt, src);
          e.attr('src', loadobj.src);
        });
      });


      // SET ALL LI AN INDEX AND INIT LAZY LOADING
      opt.allli.each((i, el) => {
        const li = $(el);

        if (opt.lazyType === 'all' || (opt.lazyType === 'smart' && (i === 0 || i === 1 || i === opt.slideamount || i === opt.slideamount - 1))) {
          loadImages(li, opt, i);
          waitForCurrentImages(li, opt, () => {
            if (opt.sliderType === 'carousel') { TweenLite.to(li, 1, { autoAlpha: 1, ease: Power3.easeInOut }); }
          });
        }
      });


      // IF DEEPLINK HAS BEEN SET
      const deeplink = getUrlVars('#')[0];
      if (deeplink.length < 9) {
        if (deeplink.split('slide').length > 1) {
          let dslide = parseInt(deeplink.split('slide')[1], 0);
          if (dslide < 1) dslide = 1;
          if (dslide > opt.slideamount) dslide = opt.slideamount;
          opt.startWithSlide = dslide - 1;
        }
      }

      // PREPARE THE SPINNER
      container.append(`<div class="tp-loader ${opt.spinner}"><div class="dot1"></div><div class="dot2"></div><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>`);


      // RESET THE TIMER
      if (container.find('.tp-bannertimer').length === 0) container.append('<div class="tp-bannertimer" style="visibility:hidden"></div>');
      container.find('.tp-bannertimer').css({ width: '0%' });
      container.find('.tp-bannertimer').data('opt', opt);


      // PREPARE THE SLIDES
      opt.ul.css({ display: 'block' });
      prepareSlides(container, opt);
      if (opt.parallax.type !== 'off') _R.checkForParallax(container, opt);


      // PREPARE SLIDER SIZE
      _R.setSize(opt);


      // Call the Navigation Builder
      if (opt.sliderType !== 'hero') _R.createNavigation(container, opt);
      if (_R.resizeThumbsTabs) _R.resizeThumbsTabs(opt);
      contWidthManager(opt);
      const _v = opt.viewPort;
      opt.inviewport = false;

      if (_v !== undefined && _v.enable) {
        if (!$.isNumeric(_v.visible_area)) {
          if (_v.visible_area.includes('%')) { _v.visible_area = parseInt(_v.visible_area, 10) / 100; }
        }

        if (_R.scrollTicker) _R.scrollTicker(opt, container);
      }


      // START THE SLIDER
      setTimeout(() => {
        if (opt.sliderType === 'carousel') _R.prepareCarousel(opt);

        if (!_v.enable || (_v.enable && opt.inviewport) || (_v.enable && !opt.inviewport && !_v.outof === 'wait')) {
          swapSlide(container, opt);
        } else { opt.waitForFirstSlide = true; }

        if (_R.manageNavigation) _R.manageNavigation(opt);


        // START COUNTDOWN
        if (opt.slideamount > 1) {
          if (!_v.enable || (_v.enable && opt.inviewport)) {
            countDown(container, opt);
          } else {
            opt.waitForCountDown = true;
          }
        }
        setTimeout(() => {
          container.trigger('revolution.slide.onloaded');
        }, 100);
      }, opt.startDelay);
      opt.startDelay = 0;


      /** ****************************
        - FULLSCREEN CHANGE -
      ******************************* */
      // FULLSCREEN MODE TESTING
      $('body').data('rs-fullScreenMode', false);
      $(window).on('mozfullscreenchange webkitfullscreenchange fullscreenchange', () => {
        $('body').data('rs-fullScreenMode', !$('body').data('rs-fullScreenMode'));
        if ($('body').data('rs-fullScreenMode')) {
          setTimeout(() => {
            $(window).trigger('resize');
          }, 200);
        }
      });

      const resizid = `resize.revslider-${container.attr('id')}`;

      // IF RESIZED, NEED TO STOP ACTUAL TRANSITION AND RESIZE ACTUAL IMAGES
      $(window).on(resizid, () => {
        if (container === undefined) return false;

        if ($('body').find(container) !== 0) { contWidthManager(opt); }

        if (container.outerWidth(true) !== opt.width || container.is(':hidden') || (opt.sliderLayout === 'fullscreen' && $(window).height() !== opt.lastwindowheight)) {
          opt.lastwindowheight = $(window).height();
          containerResized(container, opt);
        }
        return true;
      });

      hideSliderUnder(container, opt);
      contWidthManager(opt);
      if (!opt.fallbacks.disableFocusListener && opt.fallbacks.disableFocusListener !== 'true' && opt.fallbacks.disableFocusListener !== true) tabBlurringCheck(container, opt);
    }
  };

  const initSlider = function initSlider(container, opt) {
    if (container === undefined) return false;

    // CHECK FOR ALTERNATIVE IMAGE, AND IFRAM EXIST, AND WE ARE IN IE8, MOBILE, DRAW IT SIMPLE
    if (container.data('aimg') !== undefined) {
      if ((container.data('aie8') === 'enabled' && _R.isIE(8)) || (container.data('amobile') === 'enabled' && _ISM)) {
        container.html(`<img class="tp-slider-alternative-image" src="${container.data('aimg')}">`);
      }
    }

    // PREPRARE SOME CLASSES AND VARIABLES
    container.find('>ul').addClass('tp-revslider-mainul');


    // CREATE SOME DEFAULT OPTIONS FOR LATER
    opt.c = container;
    opt.ul = container.find('.tp-revslider-mainul');

    // Remove Not Needed Slides for Mobile Devices
    opt.ul.find('>li').each((i, el) => {
      const li = $(el);
      if (li.data('hideslideonmobile') === 'on' && _ISM) li.remove();
      if (li.data('invisible') || li.data('invisible') === true) {
        li.addClass('tp-invisible-slide');
        li.appendTo(opt.ul);
      }
    });


    if (opt.addons !== undefined && opt.addons.length > 0) {
      $.each(opt.addons, (i, obj) => {
        if (typeof obj === 'object' && obj.init !== undefined) {
          _R[obj.init](eval(obj.params));
        }
      });
    }


    opt.cid = container.attr('id');
    opt.ul.css({ visibility: 'visible' });
    opt.slideamount = opt.ul.find('>li').not('.tp-invisible-slide').length;
    opt.slayers = container.find('.tp-static-layers');

    if (opt.waitForInit === true) {
      return false;
    }
    container.data('opt', opt);
    runSlider(container, opt);
    return true;
  };

  // ////////////////////////
  // CONTAINER RESIZED //
  // ///////////////////////
  const containerResized = function containerResized(c, opt) {
    if (opt.infullscreenmode === true) { opt.minHeight = $(window).height(); }


    setCurWinRange(opt);
    setCurWinRange(opt, true);
    if (!_R.resizeThumbsTabs || _R.resizeThumbsTabs(opt) === true) {
      hideSliderUnder(c, opt, true);
      contWidthManager(opt);

      if (opt.sliderType === 'carousel') _R.prepareCarousel(opt, true);

      if (c === undefined) return false;

      _R.setSize(opt);

      opt.conw = opt.c.width();
      opt.conh = opt.infullscreenmode ? opt.minHeight : opt.c.height();


      const actsh = c.find('.active-revslide .slotholder');
      const nextsh = c.find('.processing-revslide .slotholder');

      removeSlots(c, opt, c, 2);

      if (opt.sliderType === 'standard') {
        TweenLite.set(nextsh.find('.defaultimg'), { opacity: 0 });
        actsh.find('.defaultimg').css({ opacity: 1 });
      }


      if (opt.sliderType === 'carousel' && opt.lastconw !== opt.conw) {
        clearTimeout(opt.pcartimer);
        opt.pcartimer = setTimeout(() => {
          _R.prepareCarousel(opt, true);
        }, 100);
        opt.lastconw = opt.conw;
      }

      if (_R.manageNavigation) _R.manageNavigation(opt);


      if (_R.animateTheCaptions) _R.animateTheCaptions(c.find('.active-revslide'), opt, true);

      if (nextsh.data('kenburns') === 'on') { _R.startKenBurn(nextsh, opt, nextsh.data('kbtl').progress()); }

      if (actsh.data('kenburns') === 'on') { _R.startKenBurn(actsh, opt, actsh.data('kbtl').progress()); }

      // DOUBLE CALL FOR SOME FUNCTION TO AVOID PORTRAIT/LANDSCAPE ISSUES,
      // AND TO AVOID FULLSCREEN/NORMAL SWAP ISSUES
      if (_R.animateTheCaptions) _R.animateTheCaptions(nextsh.closest('li'), opt, true);
      if (_R.manageNavigation) _R.manageNavigation(opt);
    }
    return false;
  };

  // /////////////////////////////////////////////////////
  // /////////       PREPARING / REMOVING  ///////////
  // /////////////////////////////////////////////////////
  const setScale = function setScale(opt) {
    opt.bw = (opt.width / opt.gridwidth[opt.curWinRange]);
    opt.bh = (opt.height / opt.gridheight[opt.curWinRange]);


    if (opt.bh > opt.bw) { opt.bh = opt.bw; } else { opt.bw = opt.bh; }

    if (opt.bh > 1 || opt.bw > 1) { opt.bw = 1; opt.bh = 1; }
  };

  // ///////////////////////////////////////
  // - PREPARE THE SLIDES / SLOTS -  //
  // /////////////////////////////////////
  const prepareSlides = function prepareSlides(container, opt) {
    container.find('.tp-caption').each((i, el) => {
      const c = $(el);
      if (c.data('transition') !== undefined) c.addClass(c.data('transition'));
    });

    // PREPARE THE UL CONTAINER TO HAVEING MAX HEIGHT AND HEIGHT FOR ANY SITUATION
    opt.ul.css({
      overflow: 'hidden', width: '100%', height: '100%', maxHeight: container.parent().css('maxHeight'),
    });
    if (opt.autoHeight === 'on') {
      opt.ul.css({
        overflow: 'hidden', width: '100%', height: '100%', maxHeight: 'none',
      });
      container.css({ maxHeight: 'none' });
      container.parent().css({ maxHeight: 'none' });
    }
    // _R.setSize("",opt);
    opt.allli.each((j, el) => {
      const li = $(el);
      const originalIndex = li.data('originalindex');

      // START WITH CORRECT SLIDE
      if ((opt.startWithSlide !== undefined && originalIndex === opt.startWithSlide) || opt.startWithSlide === undefined && j === 0) { li.addClass('next-revslide'); }


      // MAKE LI OVERFLOW HIDDEN FOR FURTHER ISSUES
      li.css({ width: '100%', height: '100%', overflow: 'hidden' });
    });

    if (opt.sliderType === 'carousel') {
      // SET CAROUSEL
      opt.ul.css({ overflow: 'visible' }).wrap('<div class="tp-carousel-wrapper" style="width:100%;height:100%;position:absolute;top:0px;left:0px;overflow:hidden;"></div>');
      const apt = '<div style="clear:both;display:block;width:100%;height:1px;position:relative;margin-bottom:-1px"></div>';
      opt.c.parent().prepend(apt);
      opt.c.parent().append(apt);
      _R.prepareCarousel(opt);
    }

    // RESOLVE OVERFLOW HIDDEN OF MAIN CONTAINER
    container.parent().css({ overflow: 'visible' });

    opt.allli.find('>img').each((j, el) => {
      let img = $(el);
      const bgvid = img.closest('li').find('.rs-background-video-layer');

      bgvid.addClass('defaultvid').css({ zIndex: 30 });

      img.addClass('defaultimg');

      // TURN OF KEN BURNS IF WE ARE ON MOBILE AND IT IS WISHED SO
      if (opt.fallbacks.panZoomDisableOnMobile === 'on' && _ISM) {
        img.data('kenburns', 'off');
        img.data('bgfit', 'cover');
      }

      img.wrap('<div class="slotholder" style="position:absolute; top:0px; left:0px; z-index:0;width:100%;height:100%;"></div>');
      bgvid.appendTo(img.closest('li').find('.slotholder'));
      const dts = img.data();
      img.closest('.slotholder').data(dts);

      if (bgvid.length > 0 && dts.bgparallax !== undefined) { bgvid.data('bgparallax', dts.bgparallax); }

      if (opt.dottedOverlay !== 'none' && opt.dottedOverlay !== undefined) { img.closest('.slotholder').append(`<div class="tp-dottedoverlay ${opt.dottedOverlay}"></div>`); }

      const src = img.attr('src');
      dts.src = src;
      dts.bgfit = dts.bgfit || 'cover';
      dts.bgrepeat = dts.bgrepeat || 'no-repeat';
      dts.bgposition = dts.bgposition || 'center center';

      const pari = img.closest('.slotholder');
      img.parent().append(`<div class="tp-bgimg defaultimg" style="background-color:${img.css('backgroundColor')};background-repeat:${dts.bgrepeat};background-image:url(${src});background-size:${dts.bgfit};background-position:${dts.bgposition};width:100%;height:100%;"></div>`);
      const comment = document.createComment(`Runtime Modification - Img tag is Still Available for SEO Goals in Source - ${img.get(0).outerHTML}`);
      img.replaceWith(comment);
      img = pari.find('.tp-bgimg');
      img.data(dts);
      img.attr('src', src);

      if (opt.sliderType === 'standard' || opt.sliderType === 'undefined') { img.css({ opacity: 0 }); }
    });
  };

  // REMOVE SLOTS //
  const removeSlots = function removeSlots(container, opt, where, addon) {
    opt.removePrepare = opt.removePrepare + addon;
    where.find('.slot, .slot-circle-wrapper').each((i, el) => {
      $(el).remove();
    });
    opt.transition = 0;
    opt.removePrepare = 0;
  };

  // /////////////////////////////////////////////////////
  // /////////       SLIDE SWAPS   ///////////////
  // /////////////////////////////////////////////////////

  // THE IMAGE IS LOADED, WIDTH, HEIGHT CAN BE SAVED
  const cutParams = function cutParams(a) {
    let b = a;
    if (a !== undefined && a.length > 0) { b = a.split('?')[0]; }
    return b;
  };

  const abstorel = function abstorel(base, relative) {
    const stack = base.split('/');
    const parts = relative.split('/');
    stack.pop(); // remove current file name (or empty string)
    // (omit if "base" is the current folder without trailing slash)
    for (let i = 0; i < parts.length; i += 1) {
      if (parts[i] === '.') { continue; }
      if (parts[i] === '..') { stack.pop(); } else { stack.push(parts[i]); }
    }
    return stack.join('/');
  };

  const imgLoaded = function imgLoaded(img, opt, progress) {
    opt.syncload -= 1;
    if (opt.loadqueue) {
      $.each(opt.loadqueue, (index, queue) => {
        const mqsrc = queue.src.replace(/\.\.\/\.\.\//gi, '');
        let fullsrc = self.location.href;
        let origin = document.location.origin;
        const fullsrcB = `${fullsrc.substring(0, fullsrc.length - 1)}/${mqsrc}`;
        const originB = `${origin}/${mqsrc}`;
        const absolute = abstorel(self.location.href, queue.src);

        fullsrc = fullsrc.substring(0, fullsrc.length - 1) + mqsrc;
        origin = origin + mqsrc;

        if (cutParams(origin) === cutParams(decodeURIComponent(img.src))
          || cutParams(fullsrc) === cutParams(decodeURIComponent(img.src))
          || cutParams(absolute) === cutParams(decodeURIComponent(img.src))
          || cutParams(originB) === cutParams(decodeURIComponent(img.src))
          || cutParams(fullsrcB) === cutParams(decodeURIComponent(img.src))
          || cutParams(queue.src) === cutParams(decodeURIComponent(img.src))
          || cutParams(queue.src).replace(/^.*\/\/[^/]+/, '') === cutParams(decodeURIComponent(img.src)).replace(/^.*\/\/[^/]+/, '')
          || (window.location.origin === 'file://' && cutParams(img.src).match(new RegExp(mqsrc)))) {
          queue.progress = progress;
          queue.width = img.width;
          queue.height = img.height;
        }
      });
    }
    progressImageLoad(opt);
  };

  // PRELOAD IMAGES 3 PIECES ON ONE GO, CHECK LOAD PRIORITY
  const progressImageLoad = function progressImageLoad(opt) {
    if (opt.syncload === 3) return;
    if (opt.loadqueue) {
      $.each(opt.loadqueue, (index, queue) => {
        if (queue.progress.match(/prepared/g)) {
          if (opt.syncload <= 3) {
            opt.syncload += 1;
            if (queue.type === 'img') {
              const img = new Image();

              img.onload = function () {
                imgLoaded(this, opt, 'loaded');
              };
              img.onerror = function () {
                imgLoaded(this, opt, 'failed');
              };

              img.src = queue.src;
            } else {
              $.get(queue.src, (data) => {
                queue.innerHTML = new XMLSerializer().serializeToString(data.documentElement);
                queue.progress = 'loaded';
                opt.syncload -= 1;
                progressImageLoad(opt);
              }).fail(() => {
                queue.progress = 'failed';
                opt.syncload -= 1;
                progressImageLoad(opt);
              });
            }
            queue.progress = 'inload';
          }
        }
      });
    }
  };


  // ADD TO QUEUE THE NOT LOADED IMAGES YES
  const addToLoadQueue = function addToLoadQueue(src, opt, prio, type) {
    let alreadyexist = false;
    if (opt.loadqueue) {
      $.each(opt.loadqueue, (index, queue) => {
        if (queue.src === src) alreadyexist = true;
      });
    }


    if (!alreadyexist) {
      const loadobj = {};
      loadobj.src = src;
      loadobj.type = type || 'img';
      loadobj.prio = prio;
      loadobj.progress = 'prepared';
      opt.loadqueue.push(loadobj);
    }
  };

  // LOAD THE IMAGES OF THE PREDEFINED CONTAINER
  const loadImages = function loadImages(container, opt, prio) {
    container.find('img,.defaultimg, .tp-svg-layer').each((i, el) => {
      const element = $(el);
      const src = element.data('lazyload') !== undefined && element.data('lazyload') !== 'undefined' ? element.data('lazyload') : element.data('svg_src') !== undefined ? element.data('svg_src') : element.attr('src');
      const type = element.data('svg_src') !== undefined ? 'svg' : 'img';

      element.data('start-to-load', $.now());
      addToLoadQueue(src, opt, prio, type);
    });
    progressImageLoad(opt);
  };


  // FIND SEARCHED IMAGE/SRC IN THE LOAD QUEUE
  const getLoadObj = function getLoadObj(opt, src) {
    let obj = {};
    if (opt.loadqueue) {
      $.each(opt.loadqueue, (index, queue) => {
        if (queue.src === src) obj = queue;
      });
    }
    return obj;
  };

  // WAIT PROGRESS TILL THE PREDEFINED CONTAINER HAS ALL IMAGES LOADED INSIDE
  const waitForCurrentImages = function waitForCurrentImages(nextli, opt, callback) {
    let waitforload = false;


    // PRELOAD ALL IMAGES
    nextli.find('img,.defaultimg, .tp-svg-layer').each((i, el) => {
      const element = $(el);
      const src = element.data('lazyload') !== undefined ? element.data('lazyload') : element.data('svg_src') !== undefined ? element.data('svg_src') : element.attr('src');
      const loadobj = getLoadObj(opt, src);


      // IF ELEMENTS IS NOT LOADED YET, AND IT IS NOW LOADED
      if (element.data('loaded') === undefined && loadobj !== undefined && loadobj.progress && loadobj.progress.match(/loaded/g)) {
        element.attr('src', loadobj.src);


        // IF IT IS A DEFAULT IMG, WE NEED TO ASSIGN SOME SPECIAL VALUES TO IT
        if (loadobj.type === 'img') {
          if (element.hasClass('defaultimg')) {
            if (!_R.isIE(8)) { element.css({ backgroundImage: `url("${loadobj.src}")` }); } else {
              opt.defimg.attr('src', loadobj.src);
            }
            nextli.data('owidth', loadobj.width);
            nextli.data('oheight', loadobj.height);
            nextli.find('.slotholder').data('owidth', loadobj.width);
            nextli.find('.slotholder').data('oheight', loadobj.height);
          } else {
            let w = element.data('ww');
            let h = element.data('hh');

            element.data('owidth', loadobj.width);
            element.data('oheight', loadobj.height);

            w = w === undefined || w === 'auto' || w === '' ? loadobj.width : w;
            h = h === undefined || h === 'auto' || h === '' ? loadobj.height : h;


            element.data('ww', w);
            element.data('hh', h);
          }
        } else

        if (loadobj.type === 'svg' && loadobj.progress === 'loaded') {
          element.append('<div class="tp-svg-innercontainer"></div>');
          element.find('.tp-svg-innercontainer').append(loadobj.innerHTML);
        }
        // ELEMENT IS NOW FULLY LOADED
        element.data('loaded', true);
      }


      if (loadobj && loadobj.progress && loadobj.progress.match(/inprogress|inload|prepared/g)) {
        if ($.now() - element.data('start-to-load') < 5000) { waitforload = true; } else { console.error(`${src}  Could not be loaded !`); }
      }

      // WAIT FOR VIDEO API'S
      if (opt.youtubeapineeded === true && (!window.YT || YT.Player === undefined)) {
        waitforload = true;
        if ($.now() - opt.youtubestarttime > 5000 && opt.youtubewarning !== true) {
          opt.youtubewarning = true;
          let txt = 'YouTube Api Could not be loaded !';
          if (location.protocol === 'https:') txt = `${txt} Please Check and Renew SSL Certificate !`;
          console.error(txt);
          opt.c.append(`<div style="position:absolute;top:50%;width:100%;color:#e74c3c;  font-size:16px; text-align:center; padding:15px;background:#000; display:block;"><strong>${txt}</strong></div>`);
        }
      }

      if (opt.vimeoapineeded === true && !window.Froogaloop) {
        waitforload = true;
        if ($.now() - opt.vimeostarttime > 5000 && opt.vimeowarning !== true) {
          opt.vimeowarning = true;
          let txt = 'Vimeo Froogaloop Api Could not be loaded !';
          if (location.protocol === 'https:') txt = `${txt} Please Check and Renew SSL Certificate !`;
          console.error(txt);
          opt.c.append(`<div style="position:absolute;top:50%;width:100%;color:#e74c3c;  font-size:16px; text-align:center; padding:15px;background:#000; display:block;"><strong>${txt}</strong></div>`);
        }
      }
    });

    if (!_ISM && opt.audioqueue && opt.audioqueue.length > 0) {
      $.each(opt.audioqueue, (i, obj) => {
        if (obj.status && obj.status === 'prepared') {
          if ($.now() - obj.start < obj.waittime) { waitforload = true; }
        }
      });
    }


    if (waitforload) {
      setTimeout(() => {
        waitForCurrentImages(nextli, opt, callback);
      }, 19);
    } else { callback(); }
  };

  // ////////////////////////////////////
  // - CALL TO SWAP THE SLIDES -  //
  // ///////////////////////////////////
  const swapSlide = function swapSlide(container, opt) {
    clearTimeout(opt.waitWithSwapSlide);


    if (container.find('.processing-revslide').length > 0) {
      opt.waitWithSwapSlide = setTimeout(() => {
        swapSlide(container, opt);
      }, 150);
      return false;
    }

    const actli = container.find('.active-revslide');
    const nextli = container.find('.next-revslide');
    const defimg = nextli.find('.defaultimg');


    if (nextli.index() === actli.index()) {
      nextli.removeClass('next-revslide');
      return false;
    }


    nextli.removeClass('next-revslide').addClass('processing-revslide');

    nextli.data('slide_on_focus_amount', (nextli.data('slide_on_focus_amount') + 1) || 1);
    // CHECK IF WE ARE ALREADY AT LAST ITEM TO PLAY IN REAL LOOP SESSION
    if (opt.stopLoop === 'on' && nextli.index() === opt.lastslidetoshow - 1) {
      container.find('.tp-bannertimer').css({ visibility: 'hidden' });
      container.trigger('revolution.slide.onstop');
      opt.noloopanymore = 1;
    }

    // INCREASE LOOP AMOUNTS
    if (nextli.index() === opt.slideamount - 1) {
      opt.looptogo = opt.looptogo - 1;
      if (opt.looptogo <= 0) { opt.stopLoop = 'on'; }
    }

    opt.tonpause = true;
    container.trigger('stoptimer');
    opt.cd = 0;
    if (opt.spinner === 'off') { container.find('.tp-loader').css({ display: 'none' }); } else { container.find('.tp-loader').css({ display: 'block' }); }


    loadImages(nextli, opt, 1);
    if (_R.preLoadAudio) _R.preLoadAudio(nextli, opt, 1);

    // WAIT FOR SWAP SLIDE PROGRESS
    waitForCurrentImages(nextli, opt, () => {
      // MANAGE BG VIDEOS
      nextli.find('.rs-background-video-layer').each((i, el) => {
        const _nc = $(el);
        if (!_nc.hasClass('HasListener')) {
          _nc.data('bgvideo', 1);
          if (_R.manageVideoLayer) _R.manageVideoLayer(_nc, opt);
        }
        if (_nc.find('.rs-fullvideo-cover').length === 0) { _nc.append('<div class="rs-fullvideo-cover"></div>'); }
      });
      swapSlideProgress(opt, defimg, container);
    });
    return true;
  };

  // ////////////////////////////////////
  // - PROGRESS SWAP THE SLIDES -  //
  // ///////////////////////////////////
  const swapSlideProgress = function swapSlideProgress(opt, defimg, container) {
    const actli = container.find('.active-revslide');
    const nextli = container.find('.processing-revslide');
    const actsh = actli.find('.slotholder');
    const nextsh = nextli.find('.slotholder');


    opt.tonpause = false;

    opt.cd = 0;


    container.find('.tp-loader').css({ display: 'none' });
    // if ( opt.sliderType =="carousel") _R.prepareCarousel(opt);
    _R.setSize(opt);
    _R.slotSize(defimg, opt);

    if (_R.manageNavigation) _R.manageNavigation(opt);
    const data = {};
    data.nextslide = nextli;
    data.currentslide = actli;
    container.trigger('revolution.slide.onbeforeswap', data);

    opt.transition = 1;
    opt.videoplaying = false;

    // IF DELAY HAS BEEN SET VIA THE SLIDE, WE TAKE THE NEW VALUE, OTHER WAY THE OLD ONE...
    if (nextli.data('delay') !== undefined) {
      opt.cd = 0;
      opt.delay = nextli.data('delay');
    } else { opt.delay = opt.origcd; }


    if (nextli.data('ssop') === 'true' || nextli.data('ssop') === true) { opt.ssop = true; } else { opt.ssop = false; }


    container.trigger('nulltimer');

    const ai = actli.index();
    const ni = nextli.index();
    opt.sdir = ni < ai ? 1 : 0;

    if (opt.sc_indicator === 'arrow') {
      if (ai === 0 && ni === opt.slideamount - 1) opt.sdir = 1;
      if (ai === opt.slideamount - 1 && ni === 0) opt.sdir = 0;
    }

    opt.lsdir = opt.lsdir === undefined ? opt.sdir : opt.lsdir;
    opt.dirc = opt.lsdir !== opt.sdir;
    opt.lsdir = opt.sdir;

    // /////////////////////////
    // REMOVE THE CAPTIONS //
    // /////////////////////////

    if (actli.index() !== nextli.index() && opt.firststart !== 1) {
      if (_R.removeTheCaptions) _R.removeTheCaptions(actli, opt);
    }

    if (!nextli.hasClass('rs-pause-timer-once') && !nextli.hasClass('rs-pause-timer-always')) {
      container.trigger('restarttimer');
    } else {
      opt.videoplaying = true;
    }

    nextli.removeClass('rs-pause-timer-once');

    let nexttrans;
    let mtl;

    // SELECT SLIDER TYPE
    if (opt.sliderType === 'carousel') {
      mtl = new TimelineLite();
      _R.prepareCarousel(opt, mtl);
      letItFree(container, opt, nextsh, actsh, nextli, actli, mtl);
      opt.transition = 0;
      opt.firststart = 0;
    } else {
      mtl = new TimelineLite({
        onComplete() {
          letItFree(container, opt, nextsh, actsh, nextli, actli, mtl);
        },
      });
      mtl.add(TweenLite.set(nextsh.find('.defaultimg'), { opacity: 0 }));
      mtl.pause();

      if (opt.firststart === 1) {
        TweenLite.set(actli, { autoAlpha: 0 });
        opt.firststart = 0;
      }


      TweenLite.set(actli, { zIndex: 18 });
      TweenLite.set(nextli, { autoAlpha: 0, zIndex: 20 });


      // IF THERE IS AN OTHER FIRST SLIDE START HAS BEED SELECTED
      if (nextli.data('differentissplayed') === 'prepared') {
        nextli.data('differentissplayed', 'done');
        nextli.data('transition', nextli.data('savedtransition'));
        nextli.data('slotamount', nextli.data('savedslotamount'));
        nextli.data('masterspeed', nextli.data('savedmasterspeed'));
      }


      if (nextli.data('fstransition') !== undefined && nextli.data('differentissplayed') !== 'done') {
        nextli.data('savedtransition', nextli.data('transition'));
        nextli.data('savedslotamount', nextli.data('slotamount'));
        nextli.data('savedmasterspeed', nextli.data('masterspeed'));
        nextli.data('transition', nextli.data('fstransition'));
        nextli.data('slotamount', nextli.data('fsslotamount'));
        nextli.data('masterspeed', nextli.data('fsmasterspeed'));
        nextli.data('differentissplayed', 'prepared');
      }

      if (nextli.data('transition') === undefined) nextli.data('transition', 'random');

      nexttrans = 0;
      const transtext = nextli.data('transition') !== undefined ? nextli.data('transition').split(',') : 'fade';
      let curtransid = nextli.data('nexttransid') === undefined ? -1 : nextli.data('nexttransid');
      if (nextli.data('randomtransition') === 'on') { curtransid = Math.round(Math.random() * transtext.length); } else { curtransid = curtransid + 1; }

      if (curtransid === transtext.length) curtransid = 0;
      nextli.data('nexttransid', curtransid);

      let comingtransition = transtext[curtransid];

      if (opt.ie) {
        if (comingtransition === 'boxfade') comingtransition = 'boxslide';
        if (comingtransition === 'slotfade-vertical') comingtransition = 'slotzoom-vertical';
        if (comingtransition === 'slotfade-horizontal') comingtransition = 'slotzoom-horizontal';
      }

      if (_R.isIE(8)) { comingtransition = 11; }


      mtl = _R.animateSlide(
        nexttrans,
        comingtransition,
        container,
        opt,
        nextli,
        actli,
        nextsh,
        actsh,
        mtl,
      );
      if (nextsh.data('kenburns') === 'on') {
        _R.startKenBurn(nextsh, opt);
        mtl.add(TweenLite.set(nextsh, { autoAlpha: 0 }));
      }

      // SHOW FIRST LI && ANIMATE THE CAPTIONS
      mtl.pause();
    }

    if (_R.scrollHandling) {
      _R.scrollHandling(opt, true);
      mtl.eventCallback('onUpdate', () => {
        _R.scrollHandling(opt, true);
      });
    }

    // START PARALLAX IF NEEDED
    if (opt.parallax.type !== 'off' && opt.parallax.firstgo === undefined && _R.scrollHandling) {
      opt.parallax.firstgo = true;
      opt.lastscrolltop = -999;
      _R.scrollHandling(opt, true);
      setTimeout(() => {
        opt.lastscrolltop = -999;
        _R.scrollHandling(opt, true);
      }, 210);
      setTimeout(() => {
        opt.lastscrolltop = -999;
        _R.scrollHandling(opt, true);
      }, 420);
    }


    if (_R.animateTheCaptions) {
      _R.animateTheCaptions(nextli, opt, null, mtl);
    } else if (mtl !== undefined) {
      setTimeout(() => {
        mtl.resume();
      }, 30);
    }
    TweenLite.to(nextli, 0.001, { autoAlpha: 1 });


    // if (_R.callStaticDDDParallax) _R.callStaticDDDParallax(container,opt,nextli);
  };


  // ////////////////////////////////////////
  // GIVE FREE THE TRANSITIOSN   //
  // ////////////////////////////////////////
  const letItFree = function letItFree(container, opt, nextsh, actsh, nextli, actli, mtl) {
    if (opt.sliderType === 'carousel') {
      // CAROUSEL SLIDER
    } else {
      opt.removePrepare = 0;
      TweenLite.to(nextsh.find('.defaultimg'), 0.001, {
        zIndex: 20,
        autoAlpha: 1,
        onComplete() {
          removeSlots(container, opt, nextli, 1);
        },
      });
      if (nextli.index() !== actli.index()) {
        TweenLite.to(actli, 0.2, {
          zIndex: 18,
          autoAlpha: 0,
          onComplete() {
            removeSlots(container, opt, actli, 1);
          },
        });
      }
    }


    container.find('.active-revslide').removeClass('active-revslide');
    container.find('.processing-revslide').removeClass('processing-revslide').addClass('active-revslide');
    opt.act = nextli.index();

    opt.c.attr('data-slideactive', container.find('.active-revslide').data('index'));


    if (opt.parallax.type === 'scroll' || opt.parallax.type === 'scroll+mouse' || opt.parallax.type === 'mouse+scroll') {
      opt.lastscrolltop = -999;
      _R.scrollHandling(opt);
    }

    mtl.clear();


    if (actsh.data('kbtl') !== undefined) {
      actsh.data('kbtl').reverse();
      actsh.data('kbtl').timeScale(25);
    }
    if (nextsh.data('kenburns') === 'on') {
      if (nextsh.data('kbtl') !== undefined) {
        nextsh.data('kbtl').timeScale(1);
        nextsh.data('kbtl').play();
      } else { _R.startKenBurn(nextsh, opt); }
    }

    nextli.find('.rs-background-video-layer').each((i, el) => {
      if (_ISM) return false;
      const _nc = $(el);
      _R.resetVideo(_nc, opt);

      TweenLite.fromTo(_nc, 1, { autoAlpha: 0 }, {
        autoAlpha: 1,
        ease: Power3.easeInOut,
        delay: 0.2,
        onComplete() {
          if (_R.animcompleted) _R.animcompleted(_nc, opt);
        },
      });
      return true;
    });


    actli.find('.rs-background-video-layer').each((i, el) => {
      if (_ISM) return false;
      const _nc = $(el);
      if (_R.stopVideo) {
        _R.resetVideo(_nc, opt);
        _R.stopVideo(_nc, opt);
      }
      TweenLite.to(_nc, 1, { autoAlpha: 0, ease: Power3.easeInOut, delay: 0.2 });
      return true;
    });
    // TIRGGER THE ON CHANGE EVENTS
    const data = {};
    data.slideIndex = nextli.index() + 1;
    data.slideLIIndex = nextli.index();
    data.slide = nextli;
    data.currentslide = nextli;
    data.prevslide = actli;
    opt.last_shown_slide = actli.index();

    container.trigger('revolution.slide.onchange', data);
    container.trigger('revolution.slide.onafterswap', data);

    opt.duringslidechange = false;

    const lastSlideLoop = actli.data('slide_on_focus_amount');
    const lastSlideMaxLoop = actli.data('hideafterloop');
    if (lastSlideMaxLoop !== 0 && lastSlideMaxLoop <= lastSlideLoop) {
      opt.c.revremoveslide(actli.index());
    }
    // if (_R.callStaticDDDParallax) _R.callStaticDDDParallax(container,opt,nextli);
  };


  // /////////////////////////
  // REMOVE THE LISTENERS //
  // /////////////////////////
  const removeAllListeners = function removeAllListeners(container, opt) {
    container.children().each((i, el) => {
      try { $(el).die('click'); } catch (e) { console.log(e); }
      try { $(el).die('mouseenter'); } catch (e) { console.log(e); }
      try { $(el).die('mouseleave'); } catch (e) { console.log(e); }
      try { $(el).unbind('hover'); } catch (e) { console.log(e); }
    });
    try { container.die('click', 'mouseenter', 'mouseleave'); } catch (e) { console.log(e); }
    clearInterval(opt.cdint);
    container = null;
  };

  // /////////////////////////
  // - countDown - //
  // ///////////////////////
  const countDown = function countDown(container, opt) {
    opt.cd = 0;
    opt.loop = 0;
    if (opt.stopAfterLoops !== undefined && opt.stopAfterLoops > -1) {
      opt.looptogo = opt.stopAfterLoops;
    } else {
      opt.looptogo = 9999999;
    }

    if (opt.stopAtSlide !== undefined && opt.stopAtSlide > -1) {
      opt.lastslidetoshow = opt.stopAtSlide;
    } else {
      opt.lastslidetoshow = 999;
    }

    opt.stopLoop = 'off';

    if (opt.looptogo === 0) opt.stopLoop = 'on';


    // LISTENERS  //container.trigger('stoptimer');
    container.on('stoptimer', (e) => {
      const bt = $(e.currentTarget).find('.tp-bannertimer');
      bt.data('tween').pause();
      if (opt.disableProgressBar === 'on') bt.css({ visibility: 'hidden' });
      opt.sliderstatus = 'paused';
      _R.unToggleState(opt.slidertoggledby);
    });


    container.on('starttimer', () => {
      if (opt.forcepause_viatoggle) return;
      if (opt.conthover !== 1
        && opt.videoplaying !== true
        && opt.width > opt.hideSliderAtLimit
        && opt.tonpause !== true
        && opt.overnav !== true
        && opt.ssop !== true) {
        if (opt.noloopanymore !== 1 && (!opt.viewPort.enable || opt.inviewport)) {
          bt.css({ visibility: 'visible' });
          bt.data('tween').resume();
          opt.sliderstatus = 'playing';
        }
      }

      if (opt.disableProgressBar === 'on') bt.css({ visibility: 'hidden' });
      _R.toggleState(opt.slidertoggledby);
    });


    container.on('restarttimer', (e) => {
      if (opt.forcepause_viatoggle) return;
      const bt = $(e.currentTarget).find('.tp-bannertimer');
      if (opt.mouseoncontainer && opt.navigation.onHoverStop === 'on' && (!_ISM)) return;
      if (opt.noloopanymore !== 1
        && (!opt.viewPort.enable || opt.inviewport) && opt.ssop !== true) {
        bt.css({ visibility: 'visible' });
        bt.data('tween').kill();

        bt.data('tween', TweenLite.fromTo(bt, opt.delay / 1000, { width: '0%' }, {
          force3D: 'auto', width: '100%', ease: Linear.easeNone, onComplete: countDownNext, delay: 1,
        }));
        opt.sliderstatus = 'playing';
      }
      if (opt.disableProgressBar === 'on') bt.css({ visibility: 'hidden' });
      _R.toggleState(opt.slidertoggledby);
    });

    container.on('nulltimer', () => {
      bt.data('tween').kill();
      bt.data('tween', TweenLite.fromTo(bt, opt.delay / 1000, { width: '0%' }, {
        force3D: 'auto', width: '100%', ease: Linear.easeNone, onComplete: countDownNext, delay: 1,
      }));
      bt.data('tween').pause(0);
      if (opt.disableProgressBar === 'on') bt.css({ visibility: 'hidden' });
      opt.sliderstatus = 'paused';
    });

    const countDownNext = () => {
      if ($('body').find(container).length === 0) {
        removeAllListeners(container, opt);
        clearInterval(opt.cdint);
      }

      container.trigger('revolution.slide.slideatend');

      // STATE OF API CHANGED -> MOVE TO AIP BETTER
      if (container.data('conthover-changed') === 1) {
        opt.conthover = container.data('conthover');
        container.data('conthover-changed', 0);
      }

      _R.callingNewSlide(opt, container, 1);
    };

    const bt = container.find('.tp-bannertimer');
    bt.data('tween', TweenLite.fromTo(bt, opt.delay / 1000, { width: '0%' }, {
      force3D: 'auto', width: '100%', ease: Linear.easeNone, onComplete: countDownNext, delay: 1,
    }));
    bt.data('opt', opt);

    if (opt.slideamount > 1 && !(opt.stopAfterLoops === 0 && opt.stopAtSlide === 1)) {
      container.trigger('starttimer');
    } else {
      opt.noloopanymore = 1;

      container.trigger('nulltimer');
    }

    container.on('tp-mouseenter', () => {
      opt.mouseoncontainer = true;
      if (opt.navigation.onHoverStop === 'on' && (!_ISM)) {
        container.trigger('stoptimer');
        container.trigger('revolution.slide.onpause');
      }
    });
    container.on('tp-mouseleft', () => {
      opt.mouseoncontainer = false;
      if (container.data('conthover') !== 1 && opt.navigation.onHoverStop === 'on' && ((opt.viewPort.enable === true && opt.inviewport) || opt.viewPort.enable === false)) {
        container.trigger('revolution.slide.onresume');
        container.trigger('starttimer');
      }
    });
  };

  //  - BLUR / FOXUS FUNCTIONS ON BROWSER

  const restartOnFocus = function restartOnFocus(opt) {
    if (opt === undefined || opt.c === undefined) return false;
    if (opt.windowfocused !== true) {
      opt.windowfocused = true;
      TweenLite.delayedCall(0.3, () => {
        // TAB IS ACTIVE, WE CAN START ANY PART OF THE SLIDER
        if (opt.fallbacks.nextSlideOnWindowFocus === 'on') opt.c.revnext();
        opt.c.revredraw();
        if (opt.lastsliderstatus === 'playing') { opt.c.revresume(); }
      });
    }
    return true;
  };

  const lastStatBlur = function lastStatBlur(opt) {
    opt.windowfocused = false;
    opt.lastsliderstatus = opt.sliderstatus;
    opt.c.revpause();
    const actsh = opt.c.find('.active-revslide .slotholder');
    const nextsh = opt.c.find('.processing-revslide .slotholder');

    if (nextsh.data('kenburns') === 'on') { _R.stopKenBurn(nextsh, opt); }

    if (actsh.data('kenburns') === 'on') { _R.stopKenBurn(actsh, opt); }
  };

  const tabBlurringCheck = function tabBlurringCheck(container, opt) {
    const notIE = (document.documentMode === undefined);
    const isChromium = window.chrome;

    if (notIE && !isChromium) {
      // checks for Firefox and other  NON IE Chrome versions
      $(window).on('focusin', () => {
        restartOnFocus(opt);
      }).on('focusout', () => {
        lastStatBlur(opt);
      });
    } else if (window.addEventListener) {
      // bind focus event
      window.addEventListener('focus', () => {
        restartOnFocus(opt);
      }, false);
      // bind blur event
      window.addEventListener('blur', () => {
        lastStatBlur(opt);
      }, false);
    } else {
      // bind focus event
      window.attachEvent('focus', () => {
        restartOnFocus(opt);
      });
      // bind focus event
      window.attachEvent('blur', () => {
        lastStatBlur(opt);
      });
    }
  };


  //  - GET THE URL PARAMETER //
  const getUrlVars = function getUrlVars(hashdivider) {
    const vars = [];
    let hash;
    const hashes = window.location.href.slice(window.location.href.indexOf(hashdivider) + 1).split('_');
    for (let i = 0; i < hashes.length; i += 1) {
      hashes[i] = hashes[i].replace('%3D', '=');
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  };

  $.fn.extend({

    revolution: function revolution(options) {
      // SET DEFAULT VALUES OF ITEM //
      const defaults = {
        delay: 9000,
        responsiveLevels: 4064,
        visibilityLevels: [2048, 1024, 778, 480],
        gridwidth: 960,
        gridheight: 500,
        minHeight: 0,
        autoHeight: 'off',
        sliderType: 'standard',
        sliderLayout: 'auto',

        fullScreenAutoWidth: 'off',
        fullScreenAlignForce: 'off',
        fullScreenOffsetContainer: '',
        fullScreenOffset: '0',

        hideCaptionAtLimit: 0,
        hideAllCaptionAtLimit: 0,
        hideSliderAtLimit: 0,
        disableProgressBar: 'off',
        stopAtSlide: -1,
        stopAfterLoops: -1,
        shadow: 0,
        dottedOverlay: 'none',
        startDelay: 0,
        lazyType: 'smart',
        spinner: 'spinner0',
        shuffle: 'off',


        viewPort: {
          enable: false,
          outof: 'wait',
          visible_area: '60%',
        },

        fallbacks: {
          isJoomla: false,
          panZoomDisableOnMobile: 'on',
          simplifyAll: 'on',
          nextSlideOnWindowFocus: 'off',
          disableFocusListener: true,
        },

        parallax: {
          type: 'off', // off, mouse, scroll, mouse+scroll
          levels: [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85],
          origo: 'slidercenter', // slidercenter or enterpoint
          speed: 400,
          bgparallax: 'off',
          opacity: 'on',
          disable_onmobile: 'off',
          ddd_shadow: 'on',
          ddd_bgfreeze: 'off',
          ddd_overflow: 'visible',
          ddd_layer_overflow: 'visible',
          ddd_z_correction: 65,
          ddd_path: 'mouse',

        },

        carousel: {
          horizontal_align: 'center',
          vertical_align: 'center',
          infinity: 'on',
          space: 0,
          maxVisibleItems: 3,
          stretch: 'off',
          fadeout: 'on',
          maxRotation: 0,
          minScale: 0,
          vary_fade: 'off',
          vary_rotation: 'on',
          vary_scale: 'off',
          border_radius: '0px',
          padding_top: 0,
          padding_bottom: 0,
        },

        navigation: {
          keyboardNavigation: 'off',
          keyboard_direction: 'horizontal',
          mouseScrollNavigation: 'off',
          onHoverStop: 'on',

          touch: {
            touchenabled: 'off',
            swipe_treshold: 75,
            swipe_min_touches: 1,
            drag_block_vertical: false,
            swipe_direction: 'horizontal',
          },
          arrows: {
            style: '',
            enable: false,
            hide_onmobile: false,
            hide_onleave: true,
            hide_delay: 200,
            hide_delay_mobile: 1200,
            hide_under: 0,
            hide_over: 9999,
            tmp: '',
            rtl: false,
            left: {
              h_align: 'left',
              v_align: 'center',
              h_offset: 20,
              v_offset: 0,
              container: 'slider',
            },
            right: {
              h_align: 'right',
              v_align: 'center',
              h_offset: 20,
              v_offset: 0,
              container: 'slider',
            },
          },
          bullets: {
            container: 'slider',
            rtl: false,
            style: '',
            enable: false,
            hide_onmobile: false,
            hide_onleave: true,
            hide_delay: 200,
            hide_delay_mobile: 1200,
            hide_under: 0,
            hide_over: 9999,
            direction: 'horizontal',
            h_align: 'left',
            v_align: 'center',
            space: 0,
            h_offset: 20,
            v_offset: 0,
            tmp: '<span class="tp-bullet-image"></span><span class="tp-bullet-title"></span>',
          },
          thumbnails: {
            container: 'slider',
            rtl: false,
            style: '',
            enable: false,
            width: 100,
            height: 50,
            min_width: 100,
            wrapper_padding: 2,
            wrapper_color: '#f5f5f5',
            wrapper_opacity: 1,
            tmp: '<span class="tp-thumb-image"></span><span class="tp-thumb-title"></span>',
            visibleAmount: 5,
            hide_onmobile: false,
            hide_onleave: true,
            hide_delay: 200,
            hide_delay_mobile: 1200,
            hide_under: 0,
            hide_over: 9999,
            direction: 'horizontal',
            span: false,
            position: 'inner',
            space: 2,
            h_align: 'left',
            v_align: 'center',
            h_offset: 20,
            v_offset: 0,
          },
          tabs: {
            container: 'slider',
            rtl: false,
            style: '',
            enable: false,
            width: 100,
            min_width: 100,
            height: 50,
            wrapper_padding: 10,
            wrapper_color: '#f5f5f5',
            wrapper_opacity: 1,
            tmp: '<span class="tp-tab-image"></span>',
            visibleAmount: 5,
            hide_onmobile: false,
            hide_onleave: true,
            hide_delay: 200,
            hide_delay_mobile: 1200,
            hide_under: 0,
            hide_over: 9999,
            direction: 'horizontal',
            span: false,
            space: 0,
            position: 'inner',
            h_align: 'left',
            v_align: 'center',
            h_offset: 20,
            v_offset: 0,
          },
        },
        debugMode: false,
      };

      // Merge of Defaults
      options = $.extend(true, {}, defaults, options);

      return this.each(() => {
        const c = $(this);
        // REMOVE SLIDES IF SLIDER IS HERO
        if (options.sliderType === 'hero') {
          c.find('>ul>li').each((i, el) => {
            if (i > 0) $(el).remove();
          });
        }
        options.scriptsneeded = getNeededScripts(options, c);
        options.curWinRange = 0;

        options.rtl = true; // $('body').hasClass("rtl");

        if (options.navigation !== undefined && options.navigation.touch !== undefined) {
          const touches_min = options.navigation.touch.swipe_min_touches;
          options.navigation.touch.swipe_min_touches = touches_min > 5
            ? 1
            : options.navigation.touch.swipe_min_touches;
        }


        $(this).on('scriptsloaded', () => {
          if (options.modulesfailing) {
            c.html(`<div style="margin:auto;line-height:40px;font-size:14px;color:#fff;padding:15px;background:#e74c3c;margin:20px 0px;">!! Error at loading Slider Revolution 5.0 Extrensions.${options.errorm}</div>`).show();
            return false;
          }

          // CHECK FOR MIGRATION
          // if (_R.migration !== undefined) options = _R.migration(c, options);
          // force3D = true;

          if (options.simplifyAll !== 'on') TweenLite.lagSmoothing(1000, 16);
          prepareOptions(c, options);
          initSlider(c, options);
          return true;
        });
        c.data('opt', options);
        waitForScripts(c, options);
      });
    },

    // Remove a Slide from the Slider
    revremoveslide: function revremoveslide(sindex) {
      return this.each(function () {
        const container = $(this);
        if (container !== undefined && container.length > 0 && $('body').find(`#${container.attr('id')}`).length > 0) {
          const bt = container.parent().find('.tp-bannertimer');
          const opt = bt.data('opt');
          if (opt && opt.li.length > 0) {
            if (sindex > 0 || sindex <= opt.li.length) {
              const li = $(opt.li[sindex]);
              const ref = li.data('index');
              let nextslideafter = false;

              opt.slideamount = opt.slideamount - 1;
              removeNavWithLiref('.tp-bullet', ref, opt);
              removeNavWithLiref('.tp-tab', ref, opt);
              removeNavWithLiref('.tp-thumb', ref, opt);
              if (li.hasClass('active-revslide')) { nextslideafter = true; }
              li.remove();
              opt.li = removeArray(opt.li, sindex);
              if (opt.carousel && opt.carousel.slides) {
                opt.carousel.slides = removeArray(opt.carousel.slides, sindex);
              }
              opt.thumbs = removeArray(opt.thumbs, sindex);
              if (_R.updateNavIndexes) _R.updateNavIndexes(opt);
              if (nextslideafter) container.revnext();
            }
          }
        }
      });
    },

    // Add a New Call Back to some Module
    revaddcallback: function revaddcallback(callback) {
      return this.each(function () {
        const container = $(this);
        if (container !== undefined && container.length > 0 && $('body').find(`#${container.attr('id')}`).length > 0) {
          const bt = container.parent().find('.tp-bannertimer');
          const opt = bt.data('opt');
          if (opt.callBackArray === undefined) { opt.callBackArray = []; }
          opt.callBackArray.push(callback);
        }
      });
    },

    // Get Current Parallax Proc
    revgetparallaxproc: function revgetparallaxproc() {
      const container = $(this);
      if (container !== undefined && container.length > 0 && $('body').find(`#${container.attr('id')}`).length > 0) {
        const bt = container.parent().find('.tp-bannertimer');
        const opt = bt.data('opt');
        return opt.scrollproc;
      }
      return false;
    },

    // ENABLE DEBUG MODE
    revdebugmode: function revdebugmode() {
      return this.each(() => {
        const container = $(this);
        if (container !== undefined && container.length > 0 && $('body').find(`#${container.attr('id')}`).length > 0) {
          const bt = container.parent().find('.tp-bannertimer');
          const opt = bt.data('opt');
          opt.debugMode = true;
          containerResized(container, opt);
        }
      });
    },

    // METHODE SCROLL
    revscroll: function revscroll(oy) {
      return this.each(() => {
        const container = $(this);
        if (container !== undefined && container.length > 0 && $('body').find(`#${container.attr('id')}`).length > 0) { $('body,html').animate({ scrollTop: `${container.offset().top + (container.height()) - oy}px` }, { duration: 400 }); }
      });
    },

    // METHODE PAUSE
    revredraw: function revredraw() {
      return this.each(() => {
        const container = $(this);
        if (container !== undefined && container.length > 0 && $('body').find(`#${container.attr('id')}`).length > 0) {
          const bt = container.parent().find('.tp-bannertimer');
          const opt = bt.data('opt');
          containerResized(container, opt);
        }
      });
    },
    // METHODE PAUSE
    revkill: function revkill() {
      const self = this;
      let container = $(this);
      const bt = container.parent().find('.tp-bannertimer');
      let opt = bt.data('opt');

      TweenLite.killDelayedCallsTo(_R.showHideNavElements);
      if (_R.endMoveCaption) {
        if (opt.endtimeouts && opt.endtimeouts.length > 0) {
          $.each(opt.endtimeouts, (i, timeo) => { clearTimeout(timeo); });
        }
      }

      // TweenLite.killDelayedCallsTo(_R.endMoveCaption);

      if (container !== undefined && container.length > 0 && $('body').find(`#${container.attr('id')}`).length > 0) {
        container.data('conthover', 1);
        container.data('conthover-changed', 1);
        container.trigger('revolution.slide.onpause');
        opt.tonpause = true;
        container.trigger('stoptimer');

        TweenLite.killTweensOf(container.find('*'), false);
        TweenLite.killTweensOf(container, false);
        container.unbind('hover, mouseover, mouseenter,mouseleave, resize');
        const resizid = `resize.revslider-${container.attr('id')}`;
        $(window).off(resizid);
        container.find('*').each((i, ele) => {
          let el = $(ele);

          el.unbind('on, hover, mouseenter,mouseleave,mouseover, resize,restarttimer, stoptimer');
          el.off('on, hover, mouseenter,mouseleave,mouseover, resize');
          el.data('mySplitText', null);
          el.data('ctl', null);
          if (el.data('tween') !== undefined) { el.data('tween').kill(); }
          if (el.data('kenburn') !== undefined) { el.data('kenburn').kill(); }
          if (el.data('timeline_out') !== undefined) { el.data('timeline_out').kill(); }
          if (el.data('timeline') !== undefined) { el.data('timeline').kill(); }

          el.remove();
          el.empty();
          el = null;
        });


        TweenLite.killTweensOf(container.find('*'), false);
        TweenLite.killTweensOf(container, false);
        bt.remove();
        try { container.closest('.forcefullwidth_wrapper_tp_banner').remove(); } catch (e) { console.log(e); }
        try { container.closest('.rev_slider_wrapper').remove(); } catch (e) { console.log(e); }
        try { container.remove(); } catch (e) { console.log(e); }
        container.empty();
        container.html();
        container = null;

        opt = null;
        delete (self.c);
        delete (self.opt);

        return true;
      }
      return false;
    },

    // METHODE PAUSE
    revpause: function revpause() {
      return this.each(() => {
        const c = $(this);
        if (c !== undefined && c.length > 0 && $('body').find(`#${c.attr('id')}`).length > 0) {
          c.data('conthover', 1);
          c.data('conthover-changed', 1);
          c.trigger('revolution.slide.onpause');
          const bt = c.parent().find('.tp-bannertimer');
          const opt = bt.data('opt');
          opt.tonpause = true;
          c.trigger('stoptimer');
        }
      });
    },

    // METHODE RESUME
    revresume: function revresume() {
      return this.each(() => {
        const c = $(this);
        if (c !== undefined && c.length > 0 && $('body').find(`#${c.attr('id')}`).length > 0) {
          c.data('conthover', 0);
          c.data('conthover-changed', 1);
          c.trigger('revolution.slide.onresume');
          const bt = c.parent().find('.tp-bannertimer');
          const opt = bt.data('opt');
          opt.tonpause = false;
          c.trigger('starttimer');
        }
      });
    },

    revstart: function revstart() {
      // return this.each(function() {
      const c = $(this);
      if (c !== undefined && c.length > 0 && $('body').find(`#${c.attr('id')}`).length > 0 && c.data('opt')) {
        if (!c.data('opt').sliderisrunning) {
          runSlider(c, c.data('opt'));
          return true;
        }
        console.log('Slider Is Running Already');
        return false;
      }
      return false;
      // })
    },

    // METHODE NEXT
    revnext: function revnext() {
      return this.each(() => {
        // CATCH THE CONTAINER
        const c = $(this);
        if (c !== undefined && c.length > 0 && $('body').find(`#${c.attr('id')}`).length > 0) {
          const bt = c.parent().find('.tp-bannertimer');
          const opt = bt.data('opt');
          _R.callingNewSlide(opt, c, 1);
        }
      });
    },

    // METHODE RESUME
    revprev: function revprev() {
      return this.each(() => {
        // CATCH THE CONTAINER
        const c = $(this);
        if (c !== undefined && c.length > 0 && $('body').find(`#${c.attr('id')}`).length > 0) {
          const bt = c.parent().find('.tp-bannertimer');
          const opt = bt.data('opt');
          _R.callingNewSlide(opt, c, -1);
        }
      });
    },

    // METHODE LENGTH
    revmaxslide: function revmaxslide() {
      // CATCH THE CONTAINER
      return $(this).find('.tp-revslider-mainul >li').length;
    },


    // METHODE CURRENT
    revcurrentslide: function revcurrentslide() {
      // CATCH THE CONTAINER
      const c = $(this);
      if (c !== undefined && c.length > 0 && $('body').find(`#${c.attr('id')}`).length > 0) {
        const bt = c.parent().find('.tp-bannertimer');
        const opt = bt.data('opt');
        return parseInt(opt.act, 0) + 1;
      }
      return false;
    },

    // METHODE CURRENT
    revlastslide: function revlastslide() {
      // CATCH THE CONTAINER
      return $(this).find('.tp-revslider-mainul >li').length;
    },


    // METHODE JUMP TO SLIDE
    revshowslide: function revshowslide(slide) {
      return this.each(() => {
        // CATCH THE CONTAINER
        const c = $(this);
        if (c !== undefined && c.length > 0 && $('body').find(`#${c.attr('id')}`).length > 0) {
          const bt = c.parent().find('.tp-bannertimer');
          const opt = bt.data('opt');
          _R.callingNewSlide(opt, c, `to${slide - 1}`);
        }
      });
    },

    revcallslidewithid: function revcallslidewithid(slide) {
      return this.each(() => {
        // CATCH THE CONTAINER
        const c = $(this);
        if (c !== undefined && c.length > 0 && $('body').find(`#${c.attr('id')}`).length > 0) {
          const bt = c.parent().find('.tp-bannertimer');
          const opt = bt.data('opt');
          _R.callingNewSlide(opt, c, slide);
        }
      });
    },
  });


  // ////////////////////////////////////////////////////////////
  // - REVOLUTION FUNCTION EXTENSIONS FOR GLOBAL USAGE  -  //
  // ////////////////////////////////////////////////////////////

  const _R = $.fn.revolution;

  $.extend(true, _R, {

    simp: function simp(a, b, basic) {
      const c = Math.abs(a) - (Math.floor(Math.abs(a / b)) * b);
      if (basic) { return c; } return a < 0 ? -1 * c : c;
    },

    // - IS IOS VERSION OLDER THAN 5 ??
    iOSVersion: function iOSVersion() {
      let oldios = false;
      if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i))) {
        if (navigator.userAgent.match(/OS 4_\d like Mac OS X/i)) {
          oldios = true;
        }
      } else {
        oldios = false;
      }
      return oldios;
    },


    // - CHECK IF BROWSER IS IE  -
    isIE: function isIE(version, comparison) {
      const $div = $('<div style="display:none;"/>').appendTo($('body'));
      $div.html(`<!--[if ${comparison || ''} IE ${version || ''}]><a>&nbsp;</a><![endif]-->`);
      const ieTest = $div.find('a').length;
      $div.remove();
      return ieTest;
    },

    //  - IS MOBILE ??
    is_mobile: function is_mobile() {
      const agents = ['android', 'webos', 'iphone', 'ipad', 'blackberry', 'Android', 'webos', 'iPod', 'iPhone', 'iPad', 'Blackberry', 'BlackBerry'];
      let ismobile = false;
      for (const i in agents) {
        if (navigator.userAgent.split(agents[i]).length > 1) {
          ismobile = true;
        }
      }
      return ismobile;
    },

    // -  CALL BACK HANDLINGS - //
    callBackHandling: function callBackHandling(opt, type, position) {
      try {
        if (opt.callBackArray) {
          $.each(opt.callBackArray, (i, c) => {
            if (c) {
              if (c.inmodule && c.inmodule === type) {
                if (c.atposition && c.atposition === position) {
                  if (c.callback) { c.callback.call(); }
                }
              }
            }
          });
        }
      } catch (e) {
        console.log('Call Back Failed');
      }
    },

    get_browser: function get_browser() {
      const N = navigator.appName;
      const ua = navigator.userAgent;
      let tem;
      let M = ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
      if (M && (tem = ua.match(/version\/([.\d]+)/i)) !== null) M[2] = tem[1];
      M = M ? [M[1], M[2]] : [N, navigator.appVersion, '-?'];
      return M[0];
    },

    get_browser_version: function get_browser_version() {
      const N = navigator.appName;
      const ua = navigator.userAgent;
      let tem;
      let M = ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
      if (M && (tem = ua.match(/version\/([.\d]+)/i)) !== null) M[2] = tem[1];
      M = M ? [M[1], M[2]] : [N, navigator.appVersion, '-?'];
      return M[1];
    },

    // GET THE HORIZONTAL OFFSET OF SLIDER BASED ON THE THU`MBNAIL AND TABS LEFT AND RIGHT SIDE
    getHorizontalOffset: function getHorizontalOffset(container, side) {
      const thumbloff = gWiderOut(container, '.outer-left');
      const thumbroff = gWiderOut(container, '.outer-right');

      switch (side) {
        case 'left':
          return thumbloff;
        case 'right':
          return thumbroff;
        case 'both':
          return thumbloff + thumbroff;
        default:
      }
      return false;
    },


    //  - CALLING THE NEW SLIDE  - //
    callingNewSlide: function callingNewSlide(opt, container, direction) {
      let aindex = container.find('.next-revslide').length > 0 ? container.find('.next-revslide').index() : container.find('.processing-revslide').length > 0 ? container.find('.processing-revslide').index() : container.find('.active-revslide').index();
      let nindex = 0;

      container.find('.next-revslide').removeClass('next-revslide');

      // IF WE ARE ON AN INVISIBLE SLIDE CURRENTLY
      if (container.find('.active-revslide').hasClass('tp-invisible-slide')) { aindex = opt.last_shown_slide; }

      // SET NEXT DIRECTION
      if (direction && $.isNumeric(direction) || direction.match(/to/g)) {
        if (direction === 1 || direction === -1) {
          nindex = aindex + direction;
          nindex = nindex < 0 ? opt.slideamount - 1 : nindex >= opt.slideamount ? 0 : nindex;
        } else {
          direction = $.isNumeric(direction) ? direction : parseInt(direction.split('to')[1], 0);
          nindex = direction < 0
            ? 0
            : direction > opt.slideamount - 1 ? opt.slideamount - 1 : direction;
        }
        container.find(`.tp-revslider-slidesli:eq(${nindex})`).addClass('next-revslide');
      } else
      if (direction) {
        container.find('.tp-revslider-slidesli').each((i, el) => {
          const li = $(el);
          if (li.data('index') === direction) li.addClass('next-revslide');
        });
      }


      nindex = container.find('.next-revslide').index();
      container.trigger('revolution.nextslide.waiting');


      if (nindex !== aindex && nindex !== -1) { swapSlide(container, opt); } else { container.find('.next-revslide').removeClass('next-revslide'); }
    },

    slotSize: function slotSize(img, opt) {
      opt.slotw = Math.ceil(opt.width / opt.slots);

      if (opt.sliderLayout === 'fullscreen') { opt.sloth = Math.ceil($(window).height() / opt.slots); } else { opt.sloth = Math.ceil(opt.height / opt.slots); }

      if (opt.autoHeight === 'on' && img !== undefined && img !== '') { opt.sloth = Math.ceil(img.height() / opt.slots); }
    },

    setSize: function slotSize(opt) {
      const ofh = (opt.top_outer || 0) + (opt.bottom_outer || 0);
      const cpt = parseInt((opt.carousel.padding_top || 0), 0);
      const cpb = parseInt((opt.carousel.padding_bottom || 0), 0);
      let maxhei = opt.gridheight[opt.curWinRange];

      opt.paddings = opt.paddings === undefined ? { top: (parseInt(opt.c.parent().css('paddingTop'), 0) || 0), bottom: (parseInt(opt.c.parent().css('paddingBottom'), 0) || 0) } : opt.paddings;

      maxhei = maxhei < opt.minHeight ? opt.minHeight : maxhei;
      if (opt.sliderLayout === 'fullwidth' && opt.autoHeight === 'off') TweenLite.set(opt.c, { maxHeight: `${maxhei}px` });
      opt.c.css({ marginTop: cpt, marginBottom: cpb });
      opt.width = opt.ul.width();
      opt.height = opt.ul.height();
      setScale(opt);

      opt.height = Math.round(
        opt.gridheight[opt.curWinRange] * (opt.width / opt.gridwidth[opt.curWinRange]),
      );

      if (opt.height > opt.gridheight[opt.curWinRange] && opt.autoHeight !== 'on') opt.height = opt.gridheight[opt.curWinRange];

      if (opt.sliderLayout === 'fullscreen' || opt.infullscreenmode) {
        opt.height = opt.bw * opt.gridheight[opt.curWinRange];
        let coh = $(window).height();

        if (opt.fullScreenOffsetContainer !== undefined) {
          try {
            const offcontainers = opt.fullScreenOffsetContainer.split(',');
            if (offcontainers) {
              $.each(offcontainers, (index, searchedcont) => {
                coh = $(searchedcont).length > 0 ? coh - $(searchedcont).outerHeight(true) : coh;
              });
            }
          } catch (e) { console.log(e); }
          try {
            if (opt.fullScreenOffset.split('%').length > 1 && opt.fullScreenOffset !== undefined && opt.fullScreenOffset.length > 0) {
              coh = coh - ($(window).height() * parseInt(opt.fullScreenOffset, 0) / 100);
            } else if (opt.fullScreenOffset !== undefined && opt.fullScreenOffset.length > 0) {
              coh = coh - parseInt(opt.fullScreenOffset, 0);
            }
          } catch (e) { console.log(e); }
        }

        coh = coh < opt.minHeight ? opt.minHeight : coh;
        coh = coh - ofh;
        opt.c.parent().height(coh);

        opt.c.closest('.rev_slider_wrapper').height(coh);
        opt.c.css({ height: '100%' });

        opt.height = coh;
        if (opt.minHeight !== undefined && opt.height < opt.minHeight) {
          opt.height = opt.minHeight;
        }
      } else {
        if (opt.minHeight !== undefined && opt.height < opt.minHeight) {
          opt.height = opt.minHeight;
        }
        opt.c.height(opt.height);
      }
      const si = {
        height: (cpt + cpb + ofh + opt.height + opt.paddings.top + opt.paddings.bottom),
      };

      opt.c.closest('.forcefullwidth_wrapper_tp_banner').find('.tp-fullwidth-forcer').css(si);
      opt.c.closest('.rev_slider_wrapper').css(si);
      setScale(opt);
    },

    enterInViewPort: function enterInViewPort(opt) {
      // START COUNTER IF VP ENTERED, AND COUNTDOWN WAS NOT ON YET
      if (opt.waitForCountDown) {
        countDown(opt.c, opt);
        opt.waitForCountDown = false;
      }
      // START FIRST SLIDE IF NOT YET STARTED AND VP ENTERED
      if (opt.waitForFirstSlide) {
        swapSlide(opt.c, opt);
        opt.waitForFirstSlide = false;
      }

      if (opt.sliderlaststatus === 'playing' || opt.sliderlaststatus === undefined) {
        opt.c.trigger('starttimer');
      }


      if (opt.lastplayedvideos !== undefined && opt.lastplayedvideos.length > 0) {
        $.each(opt.lastplayedvideos, (i, _nc) => {
          _R.playVideo(_nc, opt);
        });
      }
    },

    leaveViewPort: function leaveViewPort(opt) {
      opt.sliderlaststatus = opt.sliderstatus;
      opt.c.trigger('stoptimer');
      if (opt.playingvideos !== undefined && opt.playingvideos.length > 0) {
        opt.lastplayedvideos = $.extend(true, [], opt.playingvideos);
        if (opt.playingvideos) {
          $.each(opt.playingvideos, (i, _nc) => {
            if (_R.stopVideo) _R.stopVideo(_nc, opt);
          });
        }
      }
    },

    unToggleState: function unToggleState(a) {
      if (a !== undefined && a.length > 0) {
        $.each(a, (i, layer) => {
          layer.removeClass('rs-toggle-content-active');
        });
      }
    },

    toggleState: function toggleState(a) {
      if (a !== undefined && a.length > 0) {
        $.each(a, (i, layer) => {
          layer.addClass('rs-toggle-content-active');
        });
      }
    },
    lastToggleState: function lastToggleState(a) {
      let state = 0;
      if (a !== undefined && a.length > 0) {
        $.each(a, (i, layer) => {
          state = layer.hasClass('rs-toggle-content-active');
        });
      }
      return state;
    },

  });


  const _ISM = _R.is_mobile();
};
