import { TimelineLite, TweenLite, Power1, Power2, Power3, Linear } from 'gsap';
import getSplitText from './extension.splittext';

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

export default ($) => {
  const SplitText = getSplitText($);
  const _R = $.fn.revolution;

  // ///////////////////////////////////////////////////////////////////////
  // ////////////// HELPER FUNCTIONS FOR LAYER TRANSFORMS  /////////////////
  // ///////////////////////////////////////////////////////////////////////

  // ///////////////////////////////////
  // // CREATE ANIMATION OBJECT ////////
  // ///////////////////////////////////

  const newAnimObject = function newAnimObject() {
    const a = {};
    a.anim = {};
    a.anim.x = 0;
    a.anim.y = 0;
    a.anim.z = 0;
    a.anim.rotationX = 0;
    a.anim.rotationY = 0;
    a.anim.rotationZ = 0;
    a.anim.scaleX = 1;
    a.anim.scaleY = 1;
    a.anim.skewX = 0;
    a.anim.skewY = 0;
    a.anim.opacity = 1;
    a.anim.transformOrigin = '50% 50%';
    a.anim.transformPerspective = 600;
    a.anim.rotation = 0;
    a.anim.ease = Power3.easeOut;
    a.anim.force3D = 'auto';
    a.speed = 0.3;
    a.anim.autoAlpha = 1;
    a.anim.visibility = 'visible';
    a.anim.overwrite = 'all';
    return a;
  };

  const newSVGHoverAnimObject = function newSVGHoverAnimObject() {
    const a = {};
    a.anim = {};

    a.anim.stroke = 'none';
    a.anim.strokeWidth = 0;
    a.anim.strokeDasharray = 'none';
    a.anim.strokeDashoffset = '0';
    return a;
  };

  const setSVGAnimObject = function setSVGAnimObject(data, a) {
    const customarray = data.split(';');
    if (customarray) {
      $.each(customarray, (index, pa) => {
        const p = pa.split(':');
        const w = p[0];
        const v = p[1];

        if (w === 'sc') a.anim.stroke = v;
        if (w === 'sw') a.anim.strokeWidth = v;
        if (w === 'sda') a.anim.strokeDasharray = v;
        if (w === 'sdo') a.anim.strokeDashoffset = v;
      });
    }
    return a;
  };


  const newEndAnimObject = function newEndAnimObject() {
    const a = {};
    a.anim = {};
    a.anim.x = 0;
    a.anim.y = 0;
    a.anim.z = 0;
    return a;
  };

  const newHoverAnimObject = function newHoverAnimObject() {
    const a = {};
    a.anim = {};
    a.speed = 0.2;
    return a;
  };

  const animDataTranslator = function animDataTranslator(val, defval) {
    if ($.isNumeric(parseFloat(val))) {
      return parseFloat(val);
    } else
      if (val === undefined || val === 'inherit') {
        return defval;
      } else
        if (val.split('{').length > 1) {
          let min = val.split(',');
          const max = parseFloat(min[1].split('}')[0]);
          min = parseFloat(min[0].split('{')[1]);
          val = Math.random() * (max - min) + min;
        }
    return val;
  };

  const getBorderDirections = function getBorderDirections(x, o, w, h, top, left, direction) {
    if (!$.isNumeric(x) && x.match(/%]/g)) {
      x = x.split('[')[1].split(']')[0];
      if (direction === 'horizontal') { x = (w + 2) * parseInt(x, 0) / 100; } else
        if (direction === 'vertical') { x = (h + 2) * parseInt(x, 0) / 100; }
    } else {
      x = x === 'layer_left' ? (0 - w) : x === 'layer_right' ? w : x;
      x = x === 'layer_top' ? (0 - h) : x === 'layer_bottom' ? h : x;
      x = x === 'left' || x === 'stage_left' ? (0 - w - left) : x === 'right' || x === 'stage_right' ? o.conw - left : x === 'center' || x === 'stage_center' ? (o.conw / 2 - w / 2) - left : x;
      x = x === 'top' || x === 'stage_top' ? (0 - h - top) : x === 'bottom' || x === 'stage_bottom' ? o.conh - top : x === 'middle' || x === 'stage_middle' ? (o.conh / 2 - h / 2) - top : x;
    }

    return x;
  };

  // /////////////////////////////////////////////////
  // ANALYSE AND READ OUT DATAS FROM HTML CAPTIONS //
  // /////////////////////////////////////////////////

  const getAnimDatas = function getAnimDatas(frm, data, reversed) {
    let o = {};
    o = $.extend(true, {}, o, frm);
    if (data === undefined) { return o; }

    const customarray = data.split(';');
    if (customarray) {
      $.each(customarray, (index, pa) => {
        const p = pa.split(':');
        const w = p[0];
        let v = p[1];


        if (reversed && v !== undefined && v.length > 0 && v.match(/\(R\)/)) {
          v = v.replace('(R)', '');
          v = v === 'right' ? 'left' : v === 'left' ? 'right' : v === 'top' ? 'bottom' : v === 'bottom' ? 'top' : v;
          if (v[0] === '[' && v[1] === '-') v = v.replace('[-', '[');
          else
            if (v[0] === '[' && v[1] !== '-') v = v.replace('[', '[-');
            else
              if (v[0] === '-') v = v.replace('-', '');
              else
                if (v[0].match(/[1-9]/)) v = `-${v}`;
        }

        if (v !== undefined) {
          v = v.replace(/\(R\)/, '');
          if (w === 'rotationX' || w === 'rX') o.anim.rotationX = `${animDataTranslator(v, o.anim.rotationX)}deg`;
          if (w === 'rotationY' || w === 'rY') o.anim.rotationY = `${animDataTranslator(v, o.anim.rotationY)}deg`;
          if (w === 'rotationZ' || w === 'rZ') o.anim.rotation = `${animDataTranslator(v, o.anim.rotationZ)}deg`;
          if (w === 'scaleX' || w === 'sX') o.anim.scaleX = animDataTranslator(v, o.anim.scaleX);
          if (w === 'scaleY' || w === 'sY') o.anim.scaleY = animDataTranslator(v, o.anim.scaleY);
          if (w === 'opacity' || w === 'o') o.anim.opacity = animDataTranslator(v, o.anim.opacity);
          if (w === 'skewX' || w === 'skX') o.anim.skewX = animDataTranslator(v, o.anim.skewX);
          if (w === 'skewY' || w === 'skY') o.anim.skewY = animDataTranslator(v, o.anim.skewY);
          if (w === 'x') o.anim.x = animDataTranslator(v, o.anim.x);
          if (w === 'y') o.anim.y = animDataTranslator(v, o.anim.y);
          if (w === 'z') o.anim.z = animDataTranslator(v, o.anim.z);
          if (w === 'transformOrigin' || w === 'tO') o.anim.transformOrigin = v.toString();
          if (w === 'transformPerspective' || w === 'tP') o.anim.transformPerspective = parseInt(v, 0);
          if (w === 'speed' || w === 's') o.speed = parseFloat(v) / 1000;
          if (w === 'ease' || w === 'e') o.anim.ease = v;
        }
      });
    }

    return o;
  };

  // ///////////////////////////////
  // BUILD MASK ANIMATION OBJECT //
  // ///////////////////////////////
  const getMaskDatas = function getMaskDatas(d) {
    if (d === undefined) { return false; }

    const o = {};
    o.anim = {};
    const s = d.split(';');
    if (s) {
      $.each(s, (index, param) => {
        param = param.split(':');
        const w = param[0];
        const v = param[1];
        if (w === 'x') o.anim.x = v;
        if (w === 'y') o.anim.y = v;
        if (w === 's') o.speed = parseFloat(v) / 1000;
        if (w === 'e' || w === 'ease') o.anim.ease = v;
      });
    }

    return o;
  };

  // //////////////////////
  // SHOW THE CAPTION  //
  // /////////////////////

  const makeArray = function makeArray(obj, opt) {
    if (obj === undefined) obj = 0;

    if (!$.isArray(obj) && $.type(obj) === 'string' && (obj.split(',').length > 1 || obj.split('[').length > 1)) {
      obj = obj.replace('[', '');
      obj = obj.replace(']', '');
      const newobj = obj.match(/'/g) ? obj.split('\',') : obj.split(',');
      obj = [];
      if (newobj) {
        $.each(newobj, (index, element) => {
          element = element.replace('\'', '');
          element = element.replace('\'', '');
          obj.push(element);
        });
      }
    } else {
      const tempw = obj;
      if (!$.isArray(obj)) {
        obj = [];
        obj.push(tempw);
      }
    }

    const tempw = obj[obj.length - 1];

    if (obj.length < opt.rle) {
      for (let i = 1; i <= opt.curWinRange; i += 1) {
        obj.push(tempw);
      }
    }
    return obj;
  };

  // /////////////////////////
  // CREATE SHARP CORNERS  ///
  // /////////////////////////

  const sharpCorners = function sharpCorners(nc, $class, $side, $borderh, $borderv, ncch, bgcol) {
    const a = nc.find($class);
    a.css('borderWidth', `${ncch}px`);
    a.css($side, `${0 - ncch}px`);
    a.css($borderh, '0px solid transparent');
    a.css($borderv, bgcol);
  };

  const staticLayerStatus = function staticLayerStatus(_nc, opt, dir, dontmod) {
    let a = -1;
    if (_nc.hasClass('tp-static-layer')) {
      _nc.data('staticlayer', true);
      const s = parseInt(_nc.data('startslide'), 0);
      const e = parseInt(_nc.data('endslide'), 0);
      const pi = opt.c.find('.processing-revslide').index();
      let ai = pi !== -1 ? pi : opt.c.find('.active-revslide').index();

      ai = ai === -1 ? 0 : ai;


      if (dir === 'in') {
        // IF STATIC ITEM CURRENTLY NOT VISIBLE
        if (!_nc.hasClass('rev-static-visbile')) {
          // IF ITEM SHOULD BECOME VISIBLE

          if ((s <= ai && e >= ai) || (s === ai) || (e === ai)) {
            if (!dontmod) {
              _nc.addClass('rev-static-visbile');
              _nc.removeClass('rev-static-hidden');
            }
            a = 1;
          } else { a = 0; }

          // IF STATIC ITEM ALREADY VISIBLE
        } else if ((e === ai) || (s > ai) || (e < ai)) { a = 2; } else { a = 0; }
      } else if (_nc.hasClass('rev-static-visbile')) {
        if ((s > ai) ||
          (e < ai)) {
          a = 2;
          if (!dontmod) {
            _nc.removeClass('rev-static-visbile');
            _nc.addClass('rev-static-hidden');
          }
        } else {
          a = 0;
        }
      } else {
        a = 2;
      }
    }

    return a; // 1 -> In,  2-> Out  0-> Ignore  -1-> Not Static
  };

  const convertHoverStyle = function convertHoverStyle(t, s) {
    if (s === undefined) return t;
    s = s.replace('c:', 'color:');
    s = s.replace('bg:', 'background-color:');
    s = s.replace('bw:', 'border-width:');
    s = s.replace('bc:', 'border-color:');
    s = s.replace('br:', 'borderRadius:');
    s = s.replace('bs:', 'border-style:');
    s = s.replace('td:', 'text-decoration:');
    const sp = s.split(';');
    if (sp) {
      $.each(sp, (key, cont) => {
        const attr = cont.split(':');
        if (attr[0].length > 0) { t.anim[attr[0]] = attr[1]; }
      });
    }

    return t;
  };

  // ////////////////////////////////////
  // // GET CSS ATTRIBUTES OF ELEMENT ///
  // ////////////////////////////////////
  const getcssParams = function getcssParamsnc(nc, level) {
    const obj = {};
    let gp = false;
    let pc;

    // CHECK IF CURRENT ELEMENT SHOULD RESPECT REKURSICVE RESIZES,
    // AND SHOULD OWN THE SAME ATTRIBUTES FROM PARRENT ELEMENT
    if (level === 'rekursive') {
      pc = nc.closest('.tp-caption');
      if (pc && nc.css('fontSize') === pc.css('fontSize')) { gp = true; }
    }

    obj.basealign = nc.data('basealign') || 'grid';
    obj.fontSize = gp ? pc.data('fontsize') === undefined ? parseInt(pc.css('fontSize'), 0) || 0 : pc.data('fontsize') : nc.data('fontsize') === undefined ? parseInt(nc.css('fontSize'), 0) || 0 : nc.data('fontsize');
    obj.fontWeight = gp ? pc.data('fontweight') === undefined ? parseInt(pc.css('fontWeight'), 0) || 0 : pc.data('fontweight') : nc.data('fontweight') === undefined ? parseInt(nc.css('fontWeight'), 0) || 0 : nc.data('fontweight');
    obj.whiteSpace = gp ? pc.data('whitespace') === undefined ? pc.css('whitespace') || 'normal' : pc.data('whitespace') : nc.data('whitespace') === undefined ? nc.css('whitespace') || 'normal' : nc.data('whitespace');


    if ($.inArray(nc.data('layertype'), ['video', 'image', 'audio']) === -1 && !nc.is('img')) { obj.lineHeight = gp ? pc.data('lineheight') === undefined ? parseInt(pc.css('lineHeight'), 0) || 0 : pc.data('lineheight') : nc.data('lineheight') === undefined ? parseInt(nc.css('lineHeight'), 0) || 0 : nc.data('lineheight'); } else { obj.lineHeight = 0; }

    obj.letterSpacing = gp ? pc.data('letterspacing') === undefined ? parseFloat(pc.css('letterSpacing'), 0) || 0 : pc.data('letterspacing') : nc.data('letterspacing') === undefined ? parseFloat(nc.css('letterSpacing')) || 0 : nc.data('letterspacing');

    obj.paddingTop = nc.data('paddingtop') === undefined ? parseInt(nc.css('paddingTop'), 0) || 0 : nc.data('paddingtop');
    obj.paddingBottom = nc.data('paddingbottom') === undefined ? parseInt(nc.css('paddingBottom'), 0) || 0 : nc.data('paddingbottom');
    obj.paddingLeft = nc.data('paddingleft') === undefined ? parseInt(nc.css('paddingLeft'), 0) || 0 : nc.data('paddingleft');
    obj.paddingRight = nc.data('paddingright') === undefined ? parseInt(nc.css('paddingRight'), 0) || 0 : nc.data('paddingright');

    obj.marginTop = nc.data('margintop') === undefined ? parseInt(nc.css('marginTop'), 0) || 0 : nc.data('margintop');
    obj.marginBottom = nc.data('marginbottom') === undefined ? parseInt(nc.css('marginBottom'), 0) || 0 : nc.data('marginbottom');
    obj.marginLeft = nc.data('marginleft') === undefined ? parseInt(nc.css('marginLeft'), 0) || 0 : nc.data('marginleft');
    obj.marginRight = nc.data('marginright') === undefined ? parseInt(nc.css('marginRight'), 0) || 0 : nc.data('marginright');

    obj.borderTopWidth = nc.data('bordertopwidth') === undefined ? parseInt(nc.css('borderTopWidth'), 0) || 0 : nc.data('bordertopwidth');
    obj.borderBottomWidth = nc.data('borderbottomwidth') === undefined ? parseInt(nc.css('borderBottomWidth'), 0) || 0 : nc.data('borderbottomwidth');
    obj.borderLeftWidth = nc.data('borderleftwidth') === undefined ? parseInt(nc.css('borderLeftWidth'), 0) || 0 : nc.data('borderleftwidth');
    obj.borderRightWidth = nc.data('borderrightwidth') === undefined ? parseInt(nc.css('borderRightWidth'), 0) || 0 : nc.data('borderrightwidth');

    if (level !== 'rekursive') {
      obj.color = nc.data('color') === undefined ? 'nopredefinedcolor' : nc.data('color');

      obj.whiteSpace = gp ? pc.data('whitespace') === undefined ? pc.css('whiteSpace') || 'nowrap' : pc.data('whitespace') : nc.data('whitespace') === undefined ? nc.css('whiteSpace') || 'nowrap' : nc.data('whitespace');

      obj.minWidth = nc.data('width') === undefined ? parseInt(nc.css('minWidth'), 0) || 0 : nc.data('width');
      obj.minHeight = nc.data('height') === undefined ? parseInt(nc.css('minHeight'), 0) || 0 : nc.data('height');

      if (nc.data('videowidth') !== undefined && nc.data('videoheight') !== undefined) {
        let vwid = nc.data('videowidth');
        let vhei = nc.data('videoheight');
        vwid = vwid === '100%' ? 'none' : vwid;
        vhei = vhei === '100%' ? 'none' : vhei;
        nc.data('width', vwid);
        nc.data('height', vhei);
      }

      obj.maxWidth = nc.data('width') === undefined ? parseInt(nc.css('maxWidth'), 0) || 'none' : nc.data('width');
      obj.maxHeight = nc.data('height') === undefined ? parseInt(nc.css('maxHeight'), 0) || 'none' : nc.data('height');

      obj.wan = nc.data('wan') === undefined ? parseInt(nc.css('-webkit-transition'), 0) || 'none' : nc.data('wan');
      obj.moan = nc.data('moan') === undefined ? parseInt(nc.css('-moz-animation-transition'), 0) || 'none' : nc.data('moan');
      obj.man = nc.data('man') === undefined ? parseInt(nc.css('-ms-animation-transition'), 0) || 'none' : nc.data('man');
      obj.ani = nc.data('ani') === undefined ? parseInt(nc.css('transition'), 0) || 'none' : nc.data('ani');
    }


    obj.styleProps = nc.css(['background-color',
      'border-top-color',
      'border-bottom-color',
      'border-right-color',
      'border-left-color',
      'border-top-style',
      'border-bottom-style',
      'border-left-style',
      'border-right-style',
      'border-left-width',
      'border-right-width',
      'border-bottom-width',
      'border-top-width',
      'color',
      'text-decoration',
      'font-style',
      'borderTopLeftRadius',
      'borderTopRightRadius',
      'borderBottomLeftRadius',
      'borderBottomRightRadius',
    ]);
    return obj;
  };

  // READ SINGLE OR ARRAY VALUES OF OBJ CSS ELEMENTS
  const setResponsiveCSSValues = function setResponsiveCSSValues(obj, opt) {
    const newobj = {};
    if (obj) {
      $.each(obj, (key, val) => {
        newobj[key] = makeArray(val, opt)[opt.curWinRange] || obj[key];
      });
    }
    return newobj;
  };

  const minmaxconvert = function minmaxconvert(a, m, r, fr) {
    a = $.isNumeric(a) ? `${a * m}px` : a;
    a = a === 'full' ? fr : a === 'auto' || a === 'none' ? r : a;
    return a;
  };

  // ////////////////////////////////////////////////////
  // // CALCULATE THE RESPONSIVE SIZES OF THE CAPTIONS //
  // ////////////////////////////////////////////////////

  const calcCaptionResponsive = function calcCaptionResponsive(nc, opt, level, responsive) {
    let getobj;
    try {
      if (nc[0].nodeName === 'BR' || nc[0].tagName === 'br') { return false; }
    } catch (e) {
      console.log(e);
    }

    if (nc.data('cssobj') === undefined) {
      getobj = getcssParams(nc, level);
      nc.data('cssobj', getobj);
    } else { getobj = nc.data('cssobj'); }

    const obj = setResponsiveCSSValues(getobj, opt);

    let bw = opt.bw;
    let bh = opt.bh;

    if (responsive === 'off') {
      bw = 1;
      bh = 1;
    }

    // IE8 FIX FOR AUTO LINEHEIGHT
    if (obj.lineHeight === 'auto') obj.lineHeight = obj.fontSize + 4;


    if (!nc.hasClass('tp-splitted')) {
      nc.css('-webkit-transition', 'none');
      nc.css('-moz-transition', 'none');
      nc.css('-ms-transition', 'none');
      nc.css('transition', 'none');

      const hashover = nc.data('transform_hover') !== undefined || nc.data('style_hover') !== undefined;
      if (hashover) TweenLite.set(nc, obj.styleProps);

      TweenLite.set(nc, {

        fontSize: `${Math.round((obj.fontSize * bw))}px`,
        fontWeight: obj.fontWeight,
        letterSpacing: `${Math.floor((obj.letterSpacing * bw))}px`,
        paddingTop: `${Math.round((obj.paddingTop * bh))}px`,
        paddingBottom: `${Math.round((obj.paddingBottom * bh))}px`,
        paddingLeft: `${Math.round((obj.paddingLeft * bw))}px`,
        paddingRight: `${Math.round((obj.paddingRight * bw))}px`,
        marginTop: `${obj.marginTop * bh}px`,
        marginBottom: `${obj.marginBottom * bh}px`,
        marginLeft: `${obj.marginLeft * bw}px`,
        marginRight: `${obj.marginRight * bw}px`,
        borderTopWidth: `${Math.round(obj.borderTopWidth * bh)}px`,
        borderBottomWidth: `${Math.round(obj.borderBottomWidth * bh)}px`,
        borderLeftWidth: `${Math.round(obj.borderLeftWidth * bw)}px`,
        borderRightWidth: `${Math.round(obj.borderRightWidth * bw)}px`,
        lineHeight: `${Math.round(obj.lineHeight * bh)}px`,
        overwrite: 'auto',
      });


      if (level !== 'rekursive') {
        const winw = obj.basealign === 'slide' ? opt.ulw : opt.gridwidth[opt.curWinRange];
        const winh = obj.basealign === 'slide' ? opt.ulh : opt.gridheight[opt.curWinRange];
        const maxw = minmaxconvert(obj.maxWidth, bw, 'none', winw);
        const maxh = minmaxconvert(obj.maxHeight, bh, 'none', winh);
        const minw = minmaxconvert(obj.minWidth, bw, '0px', winw);
        const minh = minmaxconvert(obj.minHeight, bh, '0px', winh);

        TweenLite.set(nc, {
          maxWidth: maxw,
          maxHeight: maxh,
          minWidth: minw,
          minHeight: minh,
          whiteSpace: obj.whiteSpace,
          overwrite: 'auto',
        });

        if (obj.color !== 'nopredefinedcolor') { TweenLite.set(nc, { color: obj.color, overwrite: 'auto' }); }

        if (nc.data('svg_src') !== undefined) {
          if (obj.color !== 'nopredefinedcolor') { TweenLite.set(nc.find('svg'), { fill: obj.color, overwrite: 'auto' }); } else { TweenLite.set(nc.find('svg'), { fill: obj.styleProps.color, overwrite: 'auto' }); }
        }
      }

      setTimeout(() => {
        nc.css('-webkit-transition', nc.data('wan'));
        nc.css('-moz-transition', nc.data('moan'));
        nc.css('-ms-transition', nc.data('man'));
        nc.css('transition', nc.data('ani'));
      }, 30);
    }
    return true;
  };

  // ////////////////////
  // CAPTION LOOPS //
  // ////////////////////

  const callCaptionLoops = function callCaptionLoops(el, factor) {
    // SOME LOOPING ANIMATION ON INTERNAL ELEMENTS
    if (el.hasClass('rs-pendulum')) {
      if (el.data('loop-timeline') === undefined) {
        el.data('loop-timeline', new TimelineLite);
        let startdeg = el.data('startdeg') === undefined ? -20 : el.data('startdeg');
        let enddeg = el.data('enddeg') === undefined ? 20 : el.data('enddeg');
        const speed = el.data('speed') === undefined ? 2 : el.data('speed');
        const origin = el.data('origin') === undefined ? '50% 50%' : el.data('origin');
        const easing = el.data('easing') === undefined ? Power2.easeInOut : el.data('ease');


        startdeg = startdeg * factor;
        enddeg = enddeg * factor;
        el.data('loop-timeline').append(new TweenLite.fromTo(el, speed, { force3D: 'auto', rotation: startdeg, transformOrigin: origin }, { rotation: enddeg, ease: easing }));
        el.data('loop-timeline').append(new TweenLite.fromTo(el, speed, { force3D: 'auto', rotation: enddeg, transformOrigin: origin }, {
          rotation: startdeg,
          ease: easing,
          onComplete() {
            el.data('loop-timeline').restart();
          },
        }));
      }
    }

    // SOME LOOPING ANIMATION ON INTERNAL ELEMENTS
    if (el.hasClass('rs-rotate')) {
      if (el.data('loop-timeline') === undefined) {
        el.data('loop-timeline', new TimelineLite);
        let startdeg = el.data('startdeg') === undefined ? 0 : el.data('startdeg');
        let enddeg = el.data('enddeg') === undefined ? 360 : el.data('enddeg');
        const speed = el.data('speed') === undefined ? 2 : el.data('speed');
        const origin = el.data('origin') === undefined ? '50% 50%' : el.data('origin');
        const easing = el.data('easing') === undefined ? Power2.easeInOut : el.data('easing');

        startdeg = startdeg * factor;
        enddeg = enddeg * factor;

        el.data('loop-timeline').append(new TweenLite.fromTo(el, speed, { force3D: 'auto', rotation: startdeg, transformOrigin: origin }, {
          rotation: enddeg,
          ease: easing,
          onComplete() {
            el.data('loop-timeline').restart();
          },
        }));
      }
    }

    // SOME LOOPING ANIMATION ON INTERNAL ELEMENTS
    if (el.hasClass('rs-slideloop')) {
      if (el.data('loop-timeline') === undefined) {
        el.data('loop-timeline', new TimelineLite);
        let xs = el.data('xs') === undefined ? 0 : el.data('xs');
        let ys = el.data('ys') === undefined ? 0 : el.data('ys');
        let xe = el.data('xe') === undefined ? 0 : el.data('xe');
        let ye = el.data('ye') === undefined ? 0 : el.data('ye');
        const speed = el.data('speed') === undefined ? 2 : el.data('speed');
        const easing = el.data('easing') === undefined ? Power2.easeInOut : el.data('easing');

        xs = xs * factor;
        ys = ys * factor;
        xe = xe * factor;
        ye = ye * factor;

        el.data('loop-timeline').append(new TweenLite.fromTo(el, speed, { force3D: 'auto', x: xs, y: ys }, { x: xe, y: ye, ease: easing }));
        el.data('loop-timeline').append(new TweenLite.fromTo(el, speed, { force3D: 'auto', x: xe, y: ye }, {
          x: xs,
          y: ys,
          onComplete() {
            el.data('loop-timeline').restart();
          },
        }));
      }
    }

    // SOME LOOPING ANIMATION ON INTERNAL ELEMENTS
    if (el.hasClass('rs-pulse')) {
      if (el.data('loop-timeline') === undefined) {
        el.data('loop-timeline', new TimelineLite);
        const zoomstart = el.data('zoomstart') === undefined ? 0 : el.data('zoomstart');
        const zoomend = el.data('zoomend') === undefined ? 0 : el.data('zoomend');
        const speed = el.data('speed') === undefined ? 2 : el.data('speed');
        const easing = el.data('easing') === undefined ? Power2.easeInOut : el.data('easing');

        el.data('loop-timeline').append(new TweenLite.fromTo(el, speed, { force3D: 'auto', scale: zoomstart }, { scale: zoomend, ease: easing }));
        el.data('loop-timeline').append(new TweenLite.fromTo(el, speed, { force3D: 'auto', scale: zoomend }, {
          scale: zoomstart,
          onComplete() {
            el.data('loop-timeline').restart();
          },
        }));
      }
    }

    if (el.hasClass('rs-wave')) {
      if (el.data('loop-timeline') === undefined) {
        el.data('loop-timeline', new TimelineLite);

        let angle = el.data('angle') === undefined ? 10 : parseInt(el.data('angle'), 0);
        let radius = el.data('radius') === undefined ? 10 : parseInt(el.data('radius'), 0);
        const speed = el.data('speed') === undefined ? -20 : el.data('speed');
        const origin = el.data('origin') === undefined ? '50% 50%' : el.data('origin');
        const ors = origin.split(' ');
        const oo = {};

        if (ors.length >= 1) {
          oo.x = ors[0];
          oo.y = ors[1];
        } else {
          oo.x = '50%';
          oo.y = '50%';
        }

        angle = angle * factor;
        radius = radius * factor;

        const yo = (0 - el.height() / 2) + (radius * (-1 + (parseInt(oo.y, 0) / 100)));
        const xo = (el.width()) * (-0.5 + (parseInt(oo.x, 0) / 100));
        const angobj = { a: 0, ang: angle, element: el, unit: radius, xoffset: xo, yoffset: yo };

        const tl = new TweenLite();
        el.data('loop-timeline').append(tl.fromTo(angobj, speed,
          { a: 360 },
          {
            a: 0,
            force3D: 'auto',
            ease: Linear.easeNone,
            onUpdate() {
              const rad = angobj.a * (Math.PI / 180);
              TweenLite.to(angobj.element, 0.1, { force3D: 'auto', x: angobj.xoffset + Math.cos(rad) * angobj.unit, y: angobj.yoffset + angobj.unit * (1 - Math.sin(rad)) });
            },
            onComplete() {
              el.data('loop-timeline').restart();
            },
          },
        ));
      }
    }
  };

  const killCaptionLoops = function killCaptionLoops(nextcaption) {
    // SOME LOOPING ANIMATION ON INTERNAL ELEMENTS
    nextcaption.find('.rs-pendulum, .rs-slideloop, .rs-pulse, .rs-wave').each((i, ele) => {
      const el = $(ele);
      if (el.data('loop-timeline') !== undefined) {
        el.data('loop-timeline').pause();
        el.data('loop-timeline', null);
      }
    });
  };
  // /////////////////////////////////////////
  //  EXTENDED FUNCTIONS AVAILABLE GLOBAL  //
  // /////////////////////////////////////////
  $.extend(true, _R, {

    // MAKE SURE THE ANIMATION ENDS WITH A CLEANING ON MOZ TRANSFORMS
    animcompleted: function animcompleted(_nc, opt) {
      const t = _nc.data('videotype');
      const ap = _nc.data('autoplay');
      const an = _nc.data('autoplayonlyfirsttime');


      if (t !== undefined && t !== 'none') {
        if (ap === true || ap === 'true' || ap === 'on' || ap === '1sttime' || an) {
          _R.playVideo(_nc, opt);

          _R.toggleState(_nc.data('videotoggledby'));
          if (an || ap === '1sttime') {
            _nc.data('autoplayonlyfirsttime', false);
            _nc.data('autoplay', 'off');
          }
        } else {
          if (ap === 'no1sttime') { _nc.data('autoplay', 'on'); }
          _R.unToggleState(_nc.data('videotoggledby'));
        }
      }
    },

    /** ******************************************************
      - PREPARE AND DEFINE STATIC LAYER DIRECTIONS -
    *********************************************************/
    handleStaticLayers: function handleStaticLayers(_nc, opt) {
      let s = parseInt(_nc.data('startslide'), 0);
      let e = parseInt(_nc.data('endslide'), 0);
      if (s < 0) { s = 0; }
      if (e < 0) { e = opt.slideamount; }
      if (s === 0 && e === opt.slideamount - 1) { e = opt.slideamount + 1; }
      _nc.data('startslide', s);
      _nc.data('endslide', e);
    },

    /** **********************************
      ANIMATE ALL CAPTIONS
    *************************************/
    animateTheCaptions: function animateTheCaptions(nextli, opt, recalled, mtl) {
      const baseOffsetx = opt.sliderType === 'carousel' ? 0 : opt.width / 2 - (opt.gridwidth[opt.curWinRange] * opt.bw) / 2;
      const baseOffsety = 0;
      const index = nextli.data('index');


      opt.layers = opt.layers || {};
      opt.layers[index] = opt.layers[index] || nextli.find('.tp-caption');
      opt.layers.static = opt.layers.static || opt.c.find('.tp-static-layers').find('.tp-caption');

      const allcaptions = [];

      opt.conh = opt.c.height();
      opt.conw = opt.c.width();
      opt.ulw = opt.ul.width();
      opt.ulh = opt.ul.height();


      /* ENABLE DEBUG MODE */
      if (opt.debugMode) {
        nextli.addClass('indebugmode');
        nextli.find('.helpgrid').remove();
        opt.c.find('.hglayerinfo').remove();
        nextli.append(`<div class="helpgrid" style="width:${opt.gridwidth[opt.curWinRange] * opt.bw}px;height:${opt.gridheight[opt.curWinRange] * opt.bw}px;"></div>`);
        const hg = nextli.find('.helpgrid');
        hg.append(`<div class="hginfo">Zoom:${Math.round(opt.bw * 100)}% &nbsp;&nbsp;&nbsp; Device Level:${opt.curWinRange}&nbsp;&nbsp;&nbsp; Grid Preset:${opt.gridwidth[opt.curWinRange]}x${opt.gridheight[opt.curWinRange]}</div>`);
        opt.c.append('<div class="hglayerinfo"></div>');
        hg.append('<div class="tlhg"></div>');
      }

      if (allcaptions) {
        $.each(allcaptions, (i, el) => {
          const _nc = $(el);
          TweenLite.set(_nc.find('.tp-videoposter'), { autoAlpha: 1 });
          TweenLite.set(_nc.find('iframe'), { autoAlpha: 0 });
        });
      }

      // COLLECT ALL CAPTIONS
      if (opt.layers[index]) { $.each(opt.layers[index], (i, a) => { allcaptions.push(a); }); }
      if (opt.layers.static) { $.each(opt.layers.static, (i, a) => { allcaptions.push(a); }); }

      // GO THROUGH ALL CAPTIONS, AND MANAGE THEM
      if (allcaptions) {
        $.each(allcaptions, (i, el) => {
          _R.animateSingleCaption($(el), opt, baseOffsetx, baseOffsety, i, recalled);
        });
      }

      const bt = $('body').find(`#${opt.c.attr('id')}`).find('.tp-bannertimer');
      bt.data('opt', opt);


      if (mtl !== undefined) {
        setTimeout(() => {
          mtl.resume();
        }, 30);
      }
    },

    /** *************************************
      - ANIMATE THE CAPTIONS   -
    ***************************************/
    animateSingleCaption: function animateSingleCaption(
      _nc, opt, offsetx, offsety, i, recalled, triggerforce) {
      let internrecalled = recalled;
      let staticdirection = staticLayerStatus(_nc, opt, 'in', true);
      const _pw = _nc.data('_pw') || _nc.closest('.tp-parallax-wrap');
      const _lw = _nc.data('_lw') || _nc.closest('.tp-loop-wrap');
      const _mw = _nc.data('_mw') || _nc.closest('.tp-mask-wrap');
      const _responsive = _nc.data('responsive') || 'on';
      const _respoffset = _nc.data('responsive_offset') || 'on';
      const _ba = _nc.data('basealign') || 'grid';
      const // opt.conw,
        _gw = _ba === 'grid' ? opt.width : opt.ulw;

      const // opt.conh;
        _gh = _ba === 'grid' ? opt.height : opt.ulh;

      const rtl = $('body').hasClass('rtl');


      if (!_nc.data('_pw')) {
        if (_nc.data('staticlayer')) { _nc.data('_li', _nc.closest('.tp-static-layers')); } else { _nc.data('_li', _nc.closest('.tp-revslider-slidesli')); }
        _nc.data('slidelink', _nc.hasClass('slidelink'));
        _nc.data('_pw', _pw);
        _nc.data('_lw', _lw);
        _nc.data('_mw', _mw);
      }

      if (opt.sliderLayout === 'fullscreen') { offsety = _gh / 2 - (opt.gridheight[opt.curWinRange] * opt.bh) / 2; }

      if (opt.autoHeight === 'on' || (opt.minHeight !== undefined && opt.minHeight > 0)) { offsety = opt.conh / 2 - (opt.gridheight[opt.curWinRange] * opt.bh) / 2; }

      if (offsety < 0) offsety = 0;


      // LAYER GRID FOR DEBUGGING
      if (opt.debugMode) {
        _nc.closest('li').find('.helpgrid').css({ top: `${offsety}px`, left: `${offsetx}px` });
        const linfo = opt.c.find('.hglayerinfo');
        _nc.on('hover, mouseenter', () => {
          let ltxt = '';
          if (_nc.data()) {
            $.each(_nc.data(), (key, val) => {
              if (typeof val !== 'object') {
                ltxt = `${ltxt}<span style="white-space:nowrap"><span style="color:#27ae60">${key}:</span>${val}</span>&nbsp; &nbsp; `;
              }
            });
          }
          linfo.html(ltxt);
        });
      }

      /* END OF DEBUGGING */

      const layervisible = makeArray(_nc.data('visibility'), opt)[opt.forcedWinRange] || makeArray(_nc.data('visibility'), opt) || 'on';


      // HIDE CAPTION IF RESOLUTION IS TOO LOW
      if (layervisible === 'off' || (_gw < opt.hideCaptionAtLimit && _nc.data('captionhidden') === 'on') || (_gw < opt.hideAllCaptionAtLimit)) { _nc.addClass('tp-hidden-caption'); } else { _nc.removeClass('tp-hidden-caption'); }


      _nc.data('layertype', 'html');

      if (offsetx < 0) offsetx = 0;

      // FALL BACK TO NORMAL IMAGES
      if (_nc.data('thumbimage') !== undefined && _nc.data('videoposter') === undefined) { _nc.data('videoposter', _nc.data('thumbimage')); }

      // FALL BACK TO NORMAL IMAGE IF NO VIDEO SHOULD BE PLAYED ON MOBILE DEVICES
      // IF IT IS AN IMAGE
      let im;
      if (_nc.find('img').length > 0) {
        im = _nc.find('img');
        _nc.data('layertype', 'image');
        if (im.width() === 0) im.css({ width: 'auto' });
        if (im.height() === 0) im.css({ height: 'auto' });


        if (im.data('ww') === undefined && im.width() > 0) im.data('ww', im.width());
        if (im.data('hh') === undefined && im.height() > 0) im.data('hh', im.height());

        let ww = im.data('ww');
        let hh = im.data('hh');
        const fuw = _ba === 'slide' ? opt.ulw : opt.gridwidth[opt.curWinRange];
        const fuh = _ba === 'slide' ? opt.ulh : opt.gridheight[opt.curWinRange];
        ww = makeArray(im.data('ww'), opt)[opt.curWinRange] || makeArray(im.data('ww'), opt) || 'auto';
        hh = makeArray(im.data('hh'), opt)[opt.curWinRange] || makeArray(im.data('hh'), opt) || 'auto';
        const wful = ww === 'full' || ww === 'full-proportional';
        const hful = hh === 'full' || hh === 'full-proportional';

        if (ww === 'full-proportional') {
          const ow = im.data('owidth');
          const oh = im.data('oheight');
          if (ow / fuw < oh / fuh) {
            ww = fuw;
            hh = oh * (fuw / ow);
          } else {
            hh = fuh;
            ww = ow * (fuh / oh);
          }
        } else {
          ww = wful ? fuw : parseFloat(ww);
          hh = hful ? fuh : parseFloat(hh);
        }


        if (ww === undefined) ww = 0;
        if (hh === undefined) hh = 0;

        if (_responsive !== 'off') {
          if (_ba !== 'grid' && wful) { im.width(ww); } else { im.width(ww * opt.bw); }
          if (_ba !== 'grid' && hful) { im.height(hh); } else { im.height(hh * opt.bh); }
        } else {
          im.width(ww);
          im.height(hh);
        }
      }

      if (_ba === 'slide') {
        offsetx = 0;
        offsety = 0;
      }

      const tag = _nc.data('audio') === 'html5' ? 'audio' : 'video';

      // IF IT IS A VIDEO LAYER
      if (_nc.hasClass('tp-videolayer') || _nc.hasClass('tp-audiolayer') || _nc.find('iframe').length > 0 || _nc.find(tag).length > 0) {
        _nc.data('layertype', 'video');
        if (_R.manageVideoLayer) _R.manageVideoLayer(_nc, opt, recalled, internrecalled);
        if (!recalled && !internrecalled) {
          if (_R.resetVideo) _R.resetVideo(_nc, opt);
        }

        const asprat = _nc.data('aspectratio');
        if (asprat !== undefined && asprat.split(':').length > 1) { _R.prepareCoveredVideo(asprat, opt, _nc); }

        im = _nc.find('iframe') ? _nc.find('iframe') : im = _nc.find(tag);
        /* eslint-disable no-unneeded-ternary */
        const html5vid = _nc.find('iframe') ? false : true;
        /* eslint-enable no-unneeded-ternary */
        const yvcover = _nc.hasClass('coverscreenvideo');

        im.css({ display: 'block' });

        // SET WIDTH / HEIGHT
        if (_nc.data('videowidth') === undefined) {
          _nc.data('videowidth', im.width());
          _nc.data('videoheight', im.height());
        }
        let ww = makeArray(_nc.data('videowidth'), opt)[opt.curWinRange] || makeArray(_nc.data('videowidth'), opt) || 'auto';
        let hh = makeArray(_nc.data('videoheight'), opt)[opt.curWinRange] || makeArray(_nc.data('videoheight'), opt) || 'auto';
        let getobj;

        ww = parseFloat(ww);
        hh = parseFloat(hh);


        // READ AND WRITE CSS SETTINGS OF IFRAME AND VIDEO FOR RESIZING ELEMENST ON DEMAND
        if (_nc.data('cssobj') === undefined) {
          getobj = getcssParams(_nc, 0);
          _nc.data('cssobj', getobj);
        }

        const ncobj = setResponsiveCSSValues(_nc.data('cssobj'), opt);


        // IE8 FIX FOR AUTO LINEHEIGHT
        if (ncobj.lineHeight === 'auto') ncobj.lineHeight = ncobj.fontSize + 4;


        if (!_nc.hasClass('fullscreenvideo') && !yvcover) {
          TweenLite.set(_nc, {
            paddingTop: `${Math.round((ncobj.paddingTop * opt.bh))}px`,
            paddingBottom: `${Math.round((ncobj.paddingBottom * opt.bh))}px`,
            paddingLeft: `${Math.round((ncobj.paddingLeft * opt.bw))}px`,
            paddingRight: `${Math.round((ncobj.paddingRight * opt.bw))}px`,
            marginTop: `${ncobj.marginTop * opt.bh}px`,
            marginBottom: `${ncobj.marginBottom * opt.bh}px`,
            marginLeft: `${ncobj.marginLeft * opt.bw}px`,
            marginRight: `${ncobj.marginRight * opt.bw}px`,
            borderTopWidth: `${Math.round(ncobj.borderTopWidth * opt.bh)}px`,
            borderBottomWidth: `${Math.round(ncobj.borderBottomWidth * opt.bh)}px`,
            borderLeftWidth: `${Math.round(ncobj.borderLeftWidth * opt.bw)}px`,
            borderRightWidth: `${Math.round(ncobj.borderRightWidth * opt.bw)}px`,
            width: `${ww * opt.bw}px`,
            height: `${hh * opt.bh}px`,
          });
        } else {
          offsetx = 0; offsety = 0;
          _nc.data('x', 0);
          _nc.data('y', 0);

          let ovhh = _gh;
          if (opt.autoHeight === 'on') ovhh = opt.conh;
          _nc.css({ width: _gw, height: ovhh });
        }

        if ((html5vid === false && !yvcover) || ((_nc.data('forcecover') !== 1 && !_nc.hasClass('fullscreenvideo') && !yvcover))) {
          im.width(ww * opt.bw);
          im.height(hh * opt.bh);
        }
      } // END OF POSITION AND STYLE READ OUTS OF VIDEO


      const slidelink = _nc.data('slidelink') || false;

      // ALL WRAPPED REKURSIVE ELEMENTS SHOULD BE RESPONSIVE HANDLED
      _nc.find('.tp-resizeme, .tp-resizeme *').each((j, el) => {
        calcCaptionResponsive($(el), opt, 'rekursive', _responsive);
      });

      // ALL ELEMENTS IF THE MAIN ELEMENT IS REKURSIVE RESPONSIVE SHOULD BE REPONSIVE HANDLED
      if (_nc.hasClass('tp-resizeme')) {
        _nc.find('*').each((j, el) => {
          calcCaptionResponsive($(el), opt, 'rekursive', _responsive);
        });
      }

      // RESPONIVE HANDLING OF CURRENT LAYER
      calcCaptionResponsive(_nc, opt, 0, _responsive);

      // _nc FRONTCORNER CHANGES
      const ncch = _nc.outerHeight();

      const bgcol = _nc.css('backgroundColor');
      sharpCorners(_nc, '.frontcorner', 'left', 'borderRight', 'borderTopColor', ncch, bgcol);
      sharpCorners(_nc, '.frontcornertop', 'left', 'borderRight', 'borderBottomColor', ncch, bgcol);
      sharpCorners(_nc, '.backcorner', 'right', 'borderLeft', 'borderBottomColor', ncch, bgcol);
      sharpCorners(_nc, '.backcornertop', 'right', 'borderLeft', 'borderTopColor', ncch, bgcol);


      if (opt.fullScreenAlignForce === 'on') {
        offsetx = 0;
        offsety = 0;
      }

      let arrobj = _nc.data('arrobj');
      if (arrobj === undefined) {
        arrobj = {};
        arrobj.voa = makeArray(_nc.data('voffset'), opt)[opt.curWinRange] || makeArray(_nc.data('voffset'), opt)[0];
        arrobj.hoa = makeArray(_nc.data('hoffset'), opt)[opt.curWinRange] || makeArray(_nc.data('hoffset'), opt)[0];
        arrobj.elx = makeArray(_nc.data('x'), opt)[opt.curWinRange] || makeArray(_nc.data('x'), opt)[0];
        arrobj.ely = makeArray(_nc.data('y'), opt)[opt.curWinRange] || makeArray(_nc.data('y'), opt)[0];
      }

      const voa = arrobj.voa.length === 0 ? 0 : arrobj.voa;

      const hoa = arrobj.hoa.length === 0 ? 0 : arrobj.hoa;
      let elx = arrobj.elx.length === 0 ? 0 : arrobj.elx;
      let ely = arrobj.ely.length === 0 ? 0 : arrobj.ely;
      let eow = _nc.outerWidth(true);
      let eoh = _nc.outerHeight(true);


      // NEED CLASS FOR FULLWIDTH AND FULLHEIGHT LAYER SETTING !!
      if (eow === 0 && eoh === 0) {
        eow = opt.ulw;
        eoh = opt.ulh;
      }

      const vofs = _respoffset !== 'off' ? parseInt(voa, 0) * opt.bw : parseInt(voa, 0);
      const hofs = _respoffset !== 'off' ? parseInt(hoa, 0) * opt.bw : parseInt(hoa, 0);
      let crw = _ba === 'grid' ? opt.gridwidth[opt.curWinRange] * opt.bw : _gw;
      let crh = _ba === 'grid' ? opt.gridheight[opt.curWinRange] * opt.bw : _gh;


      if (opt.fullScreenAlignForce === 'on') {
        crw = opt.ulw;
        crh = opt.ulh;
      }


      // ALIGN POSITIONED ELEMENTS


      elx = elx === 'center' || elx === 'middle' ? (crw / 2 - eow / 2) + hofs : elx === 'left' ? hofs : elx === 'right' ? (crw - eow) - hofs : _respoffset !== 'off' ? elx * opt.bw : elx;
      ely = ely === 'center' || ely === 'middle' ? (crh / 2 - eoh / 2) + vofs : ely === 'top' ? vofs : ely === 'bottom' ? (crh - eoh) - vofs : _respoffset !== 'off' ? ely * opt.bw : ely;


      if (rtl && !slidelink) { elx = elx + eow; }


      // THE TRANSITIONS OF CAPTIONS
      // MDELAY AND MSPEED


      const $lts = _nc.data('lasttriggerstate');

      let $cts = _nc.data('triggerstate');
      const $start = _nc.data('start') || 100;
      const $end = _nc.data('end');
      let mdelay = triggerforce ? 0 : $start === 'bytrigger' || $start === 'sliderenter' ? 0 : parseFloat($start) / 1000;
      const calcx = (elx + offsetx);
      const calcy = (ely + offsety);
      const tpcapindex = _nc.css('z-Index');

      if (!triggerforce) {
        if ($lts === 'reset' && $start !== 'bytrigger') {
          _nc.data('triggerstate', 'on');
          _nc.data('animdirection', 'in');
          $cts = 'on';
        } else
          if ($lts === 'reset' && $start === 'bytrigger') {
            _nc.data('triggerstate', 'off');
            _nc.data('animdirection', 'out');
            $cts = 'off';
          }
      }


      // SET TOP/LEFT POSITION OF LAYER
      TweenLite.set(_pw, { zIndex: tpcapindex, top: calcy, left: calcx, overwrite: 'auto' });

      if (staticdirection === 0) internrecalled = true;

      // STATIC LAYER, THINK ON THIS !!!
      if (_nc.data('timeline') !== undefined && !internrecalled) {
        if (staticdirection !== 2) { _nc.data('timeline').gotoAndPlay(0); }
        internrecalled = true;
      }

      // KILL OUT ANIMATION

      if (!recalled && _nc.data('timeline_out') && staticdirection !== 2 && staticdirection !== 0) {
        _nc.data('timeline_out').kill();
        _nc.data('outstarted', 0);
      }

      // TRIGGERED ELEMENTS SHOULD
      if (triggerforce && _nc.data('timeline') !== undefined) {
        _nc.removeData('$anims');
        _nc.data('timeline').pause(0);
        _nc.data('timeline').kill();
        if (_nc.data('newhoveranim') !== undefined) {
          _nc.data('newhoveranim').progress(0);
          _nc.data('newhoveranim').kill();
        }
        _nc.removeData('timeline');
        TweenLite.killTweensOf(_nc);
        _nc.unbind('hover');
        _nc.removeClass('rs-hover-ready');

        _nc.removeData('newhoveranim');
      }

      const $time = _nc.data('timeline') ? _nc.data('timeline').time() : 0;
      let $progress = _nc.data('timeline') !== undefined ? _nc.data('timeline').progress() : 0;
      let tl = _nc.data('timeline') || new TimelineLite({ smoothChildTiming: true });

      $progress = $.isNumeric($progress) ? $progress : 0;

      tl.pause();
      // LAYER IS TRIGGERED ??

      // CHECK FOR SVG
      const $svg = {};
      $svg.svg = _nc.data('svg_src') !== undefined ? _nc.find('svg') : false;


      // GO FOR ANIMATION
      if ($progress < 1 && _nc.data('outstarted') !== 1 || staticdirection === 2 || triggerforce) {
        let animobject = _nc;

        if (_nc.data('mySplitText') !== undefined) _nc.data('mySplitText').revert();

        if (_nc.data('splitin') !== undefined && _nc.data('splitin').match(/chars|words|lines/g) || _nc.data('splitout') !== undefined && _nc.data('splitout').match(/chars|words|lines/g)) {
          const splittarget = _nc.find('a').length > 0 ? _nc.find('a') : _nc;
          _nc.data('mySplitText', new SplitText(splittarget, { type: 'lines,words,chars', charsClass: 'tp-splitted tp-charsplit', wordsClass: 'tp-splitted tp-wordsplit', linesClass: 'tp-splitted tp-linesplit' }));
          _nc.addClass('splitted');
        }

        if (_nc.data('mySplitText') !== undefined && _nc.data('splitin') && _nc.data('splitin').match(/chars|words|lines/g)) animobject = _nc.data('mySplitText')[_nc.data('splitin')];

        let $a = {};

        // PRESET SVG STYLE
        if ($svg.svg) {
          $svg.idle = setSVGAnimObject(_nc.data('svg_idle'), newSVGHoverAnimObject());
          // $svg.idle.anim.css.color =
          TweenLite.set($svg.svg, $svg.idle.anim);
        }

        const reverseanim = _nc.data('transform_in') !== undefined ? _nc.data('transform_in').match(/\(R\)/gi) : false;

        // BUILD ANIMATION LIBRARY AND HOVER ANIMATION
        let $from = {};
        if (!_nc.data('$anims') || triggerforce || reverseanim) {
          $from = newAnimObject();
          let $result = newAnimObject();
          let $hover = newHoverAnimObject();
          const hashover = _nc.data('transform_hover') !== undefined || _nc.data('style_hover') !== undefined;

          // WHICH ANIMATION TYPE SHOULD BE USED
          $result = getAnimDatas($result, _nc.data('transform_idle'));

          $from = getAnimDatas($result, _nc.data('transform_in'), opt.sdir === 1);

          if (hashover) {
            $hover = getAnimDatas($hover, _nc.data('transform_hover'));
            $hover = convertHoverStyle($hover, _nc.data('style_hover'));
            if ($svg.svg) {
              const $svghover = setSVGAnimObject(_nc.data('svg_hover'), newSVGHoverAnimObject());
              if ($hover.anim.color !== undefined) {
                $svghover.anim.fill = $hover.anim.color;
              }
              _nc.data('hoversvg', $svghover);
            }
            _nc.data('hover', $hover);
          }

          // DELAYS
          $from.elemdelay = (_nc.data('elementdelay') === undefined) ? 0 : _nc.data('elementdelay');
          $result.anim.ease = $from.anim.ease = $from.anim.ease || Power1.easeInOut;


          // HOVER ANIMATION
          if (hashover && !_nc.hasClass('rs-hover-ready')) {
            _nc.addClass('rs-hover-ready');
            _nc.hover((e) => {
              const nc = $(e.currentTarget);
              const t = nc.data('hover');
              const intl = nc.data('timeline');

              if (intl && intl.progress() === 1) {
                if (nc.data('newhoveranim') === undefined || nc.data('newhoveranim') === 'none') {
                  nc.data('newhoveranim', TweenLite.to(nc, t.speed, t.anim));
                  if ($svg.svg) { nc.data('newsvghoveranim', TweenLite.to($svg.svg, t.speed, nc.data('hoversvg').anim)); }
                } else {
                  nc.data('newhoveranim').progress(0);
                  nc.data('newhoveranim').play();
                  if ($svg.svg) nc.data('newsvghoveranim').progress(0).play();
                }
              }
            },
              (e) => {
                const nc = $(e.currentTarget);
                const intl = nc.data('timeline');

                if (intl && intl.progress() === 1 && nc.data('newhoveranim') !== undefined) {
                  nc.data('newhoveranim').reverse();
                  if ($svg.svg) nc.data('newsvghoveranim').reverse();
                }
              });
          }
          $a = {};
          $a.f = $from;
          $a.r = $result;
          _nc.data('$anims');
        } else {
          $a = _nc.data('$anims');
        }


        // SET WRAPPING CONTAINER SIZES
        const $maskFrm = getMaskDatas(_nc.data('mask_in'));

        const newtl = new TimelineLite();

        $a.f.anim.x = $a.f.anim.x * opt.bw || getBorderDirections($a.f.anim.x, opt, eow, eoh, calcy, calcx, 'horizontal');
        $a.f.anim.y = $a.f.anim.y * opt.bw || getBorderDirections($a.f.anim.y, opt, eow, eoh, calcy, calcx, 'vertical');


        // IF LAYER IS NOT STATIC, OR STATIC AND NOT ANIMATED IN AT THIS LOOP
        if (staticdirection !== 2 || triggerforce) {
          // SPLITED ANIMATION IS IN GAME
          if (animobject !== _nc) {
            const oldease = $a.r.anim.ease;
            tl.add(TweenLite.set(_nc, $a.r.anim));
            $a.r = newAnimObject();
            $a.r.anim.ease = oldease;
          }

          $a.f.anim.visibility = 'hidden';

          _nc.data('eow', eow);
          _nc.data('eoh', eoh);
          _nc.data('speed', $a.f.speed);
          _nc.data('ease', $a.r.anim.ease);

          newtl.eventCallback('onStart', () => {
            TweenLite.set(_nc, { visibility: 'visible' });
            // FIX VISIBLE IFRAME BUG IN SAFARI
            if (_nc.data('iframes')) {
              _nc.find('iframe').each((j, el) => {
                TweenLite.set($(el), { autoAlpha: 1 });
              });
            }
            TweenLite.set(_pw, { visibility: 'visible' });
            const data = {};
            data.layer = _nc;
            data.eventtype = 'enterstage';
            data.layertype = _nc.data('layertype');
            _nc.data('active', true);
            data.layersettings = _nc.data();
            opt.c.trigger('revolution.layeraction', [data]);
          });

          newtl.eventCallback('onComplete', () => {
            const data = {};
            data.layer = _nc;
            data.eventtype = 'enteredstage';
            data.layertype = _nc.data('layertype');
            data.layersettings = _nc.data();
            opt.c.trigger('revolution.layeraction', [data]);
            _R.animcompleted(_nc, opt);
          });

          // SHOW ELEMENTS WITH SLIDEENTER A BIT LATER FIRST !
          if (($start === 'sliderenter' && opt.overcontainer)) { mdelay = 0.6; }


          tl.add(newtl.staggerFromTo(
            animobject,
            $a.f.speed,
            $a.f.anim,
            $a.r.anim,
            $a.f.elemdelay,
          ), mdelay);

          // MASK ANIMATION
          if ($maskFrm) {
            const $maskRsl = {};
            $maskRsl.ease = $a.r.anim.ease;
            $maskRsl.overflow = $maskFrm.anim.overflow = 'hidden';
            $maskRsl.overwrite = 'all';
            $maskRsl.x = $maskRsl.y = 0;

            $maskFrm.anim.x = $maskFrm.anim.x * opt.bw || getBorderDirections($maskFrm.anim.x, opt, eow, eoh, calcy, calcx, 'horizontal');
            $maskFrm.anim.y = $maskFrm.anim.y * opt.bw || getBorderDirections($maskFrm.anim.y, opt, eow, eoh, calcy, calcx, 'vertical');

            tl.add(TweenLite.fromTo(
              _mw,
              $a.f.speed,
              $maskFrm.anim,
              $maskRsl,
              $from.elemdelay,
            ), mdelay);
          } else {
            tl.add(TweenLite.set(_mw, { overflow: 'visible' }, $from.elemdelay), 0);
          }
        }

        // SAVE IT TO NCAPTION BEFORE NEW STEPS WILL BE ADDED
        _nc.data('timeline', tl);

        opt.sliderscrope = opt.sliderscrope === undefined
          ? Math.round(Math.random() * 99999)
          : opt.sliderscrope;

        // IF THERE IS ANY EXIT ANIM DEFINED
        // For Static Layers -> 1 -> In,  2-> Out  0-> Ignore  -1-> Not Static
        staticdirection = staticLayerStatus(_nc, opt, 'in');


        if (opt.endtimeouts === undefined) opt.endtimeouts = [];
        if (($progress === 0 || staticdirection === 2) && $end !== 'bytrigger' && !triggerforce && $end !== 'sliderleave') {
          let tot;
          if (($end !== undefined) && (staticdirection === -1 || staticdirection === 2) && ($end !== 'bytriger')) {
            tot = setTimeout(() => {
              _R.endMoveCaption(_nc, _mw, _pw, opt);
            }, parseInt(_nc.data('end'), 0));
          } else {
            tot = setTimeout(() => {
              _R.endMoveCaption(_nc, _mw, _pw, opt);
            }, 999999);
          }
          opt.endtimeouts.push(tot);
        }
        // SAVE THE TIMELINE IN DOM ELEMENT

        tl = _nc.data('timeline');

        if (_nc.data('loopanimation') === 'on') callCaptionLoops(_lw, opt.bw);


        if (($start !== 'sliderenter' || ($start === 'sliderenter' && opt.overcontainer)) && (staticdirection === -1 || staticdirection === 1 || triggerforce || (staticdirection === 0 && $progress < 1 && _nc.hasClass('rev-static-visbile')))) {
          if (($progress < 1 && $progress > 0) ||
            ($progress === 0 && $start !== 'bytrigger' && $lts !== 'keep') ||
            ($progress === 0 && $start !== 'bytrigger' && $lts === 'keep' && $cts === 'on') ||
            ($start === 'bytrigger' && $lts === 'keep' && $cts === 'on')) {
            tl.resume($time);
            _R.toggleState(_nc.data('layertoggledby'));
          }
        }
      }

      // TweenLite.set(_mw,{width:eow, height:eoh});
      if (_nc.data('loopanimation') === 'on') TweenLite.set(_lw, { minWidth: eow, minHeight: eoh });

      if (_nc.data('slidelink') !== 0 && (_nc.data('slidelink') === 1 || _nc.hasClass('slidelink'))) {
        TweenLite.set(_mw, { width: '100%', height: '100%' });
        _nc.data('slidelink', 1);
      } else {
        TweenLite.set(_mw, { width: 'auto', height: 'auto' });
        _nc.data('slidelink', 0);
      }
    },

    // ////////////////////////////
    // MOVE OUT THE CAPTIONS  //
    // //////////////////////////
    endMoveCaption: function endMoveCaption(nc, mw, pw, opt) {
      const _nc = nc || $(nc);
      const _mw = mw || _nc.data('_mw');
      const _pw = pw || _nc.data('_pw');
      // Kill TimeLine of "in Animation"
      _nc.data('outstarted', 1);


      if (_nc.data('timeline')) { _nc.data('timeline').pause(); } else
        if (_nc.data('_pw') === undefined) return;

      const tl = new TimelineLite();
      const subtl = new TimelineLite();
      const newmasktl = new TimelineLite();
      const $from = getAnimDatas(newAnimObject(), _nc.data('transform_in'), opt.sdir === 1);
      let $to = _nc.data('transform_out') ? getAnimDatas(newEndAnimObject(), _nc.data('transform_out'), opt.sdir === 1) : getAnimDatas(newEndAnimObject(), _nc.data('transform_in'), opt.sdir === 1);
      const animobject = _nc.data('splitout') && _nc.data('splitout').match(/words|chars|lines/g) ? _nc.data('mySplitText')[_nc.data('splitout')] : _nc;
      const elemdelay = (_nc.data('endelementdelay') === undefined) ? 0 : _nc.data('endelementdelay');
      const iw = _nc.innerWidth();
      const ih = _nc.innerHeight();
      const p = _pw.position();

      // IF REVERSE AUTO ANIMATION ENABLED
      if (_nc.data('transform_out') && _nc.data('transform_out').match(/auto:auto/g)) {
        $from.speed = $to.speed;
        $from.anim.ease = $to.anim.ease;
        $to = $from;
      }

      const $maskTo = getMaskDatas(_nc.data('mask_out'));

      $to.anim.x = $to.anim.x * opt.bw || getBorderDirections($to.anim.x, opt, iw, ih, p.top, p.left, 'horizontal');
      $to.anim.y = $to.anim.y * opt.bw || getBorderDirections($to.anim.y, opt, iw, ih, p.top, p.left, 'vertical');

      subtl.eventCallback('onStart', () => {
        const data = {};
        data.layer = _nc;
        data.eventtype = 'leavestage';
        data.layertype = _nc.data('layertype');
        data.layersettings = _nc.data();
        _nc.data('active', false);
        opt.c.trigger('revolution.layeraction', [data]);
      });

      subtl.eventCallback('onComplete', () => {
        TweenLite.set(_nc, { visibility: 'hidden' });
        TweenLite.set(_pw, { visibility: 'hidden' });
        const data = {};
        data.layer = _nc;
        data.eventtype = 'leftstage';
        _nc.data('active', false);
        data.layertype = _nc.data('layertype');
        data.layersettings = _nc.data();
        opt.c.trigger('revolution.layeraction', [data]);
        if (_R.stopVideo) _R.stopVideo(_nc, opt);
      });


      tl.add(subtl.staggerTo(animobject, $to.speed, $to.anim, elemdelay), 0);

      // MASK ANIMATION
      if ($maskTo) {
        $maskTo.anim.ease = $to.anim.ease;
        $maskTo.anim.overflow = 'hidden';

        $maskTo.anim.x = $maskTo.anim.x * opt.bw || getBorderDirections($maskTo.anim.x, opt, iw, ih, p.top, p.left, 'horizontal');
        $maskTo.anim.y = $maskTo.anim.y * opt.bw || getBorderDirections($maskTo.anim.y, opt, iw, ih, p.top, p.left, 'vertical');


        tl.add(newmasktl.to(_mw, $to.speed, $maskTo.anim, elemdelay), 0);
      } else {
        tl.add(newmasktl.set(_mw, { overflow: 'visible', overwrite: 'auto' }, elemdelay), 0);
      }

      _nc.data('timeline_out', tl);
    },

    // ////////////////////////
    // REMOVE THE CAPTIONS //
    // ///////////////////////
    removeTheCaptions: function removeTheCaptions(actli, opt) {
      const index = actli.data('index');
      const allcaptions = [];

      // COLLECT ALL CAPTIONS
      if (opt.layers[index]) { $.each(opt.layers[index], (i, a) => { allcaptions.push(a); }); }
      if (opt.layers.static) { $.each(opt.layers.static, (i, a) => { allcaptions.push(a); }); }


      // TweenLite.killDelayedCallsTo(_R.endMoveCaption,false,opt.sliderscrope);

      if (opt.endtimeouts && opt.endtimeouts.length > 0) {
        $.each(opt.endtimeouts, (i, timeo) => { clearTimeout(timeo); });
      }
      opt.endtimeouts = [];

      // GO THROUGH ALL CAPTIONS, AND MANAGE THEM
      if (allcaptions) {
        $.each(allcaptions, function () {
          const _nc = $(this);
          const stat = staticLayerStatus(_nc, opt, 'out');
          if (stat !== 0) {  // 0 === ignore
            killCaptionLoops(_nc);
            clearTimeout(_nc.data('videoplaywait'));
            if (_R.stopVideo) _R.stopVideo(_nc, opt);
            _R.endMoveCaption(_nc, null, null, opt);
            // opt.playingvideos = [];
            if (_R.removeMediaFromList) _R.removeMediaFromList(_nc, opt);
            opt.lastplayedvideos = [];
          }
        });
      }
    },
  });
};
