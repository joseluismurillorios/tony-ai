import { TimelineLite, TweenLite } from 'gsap';

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
  const _R = $.fn.revolution;


  const getKBSides = function getKBSides(w, h, f, cw, ch, ho, vo) {
    const tw = w * f;
    const th = h * f;
    const hd = Math.abs(cw - tw);
    const vd = Math.abs(ch - th);
    const s = {};
    s.l = (0 - ho) * hd;
    s.r = s.l + tw;
    s.t = (0 - vo) * vd;
    s.b = s.t + th;
    s.h = ho;
    s.v = vo;
    return s;
  };

  const getKBCorners = function getKBCorners(d, cw, ch, ofs, o) {
    const p = d.bgposition.split(' ') || 'center center';
    let ho = p[0] === 'center' ? '50%' : p[0] === 'left' || p[1] === 'left' ? '0%' : p[0] === 'right' || p[1] === 'right' ? '100%' : p[0];
    let vo = p[1] === 'center' ? '50%' : p[0] === 'top' || p[1] === 'top' ? '0%' : p[0] === 'bottom' || p[1] === 'bottom' ? '100%' : p[1];

    ho = parseInt(ho, 0) / 100 || 0;
    vo = parseInt(vo, 0) / 100 || 0;


    const sides = {};


    sides.start = getKBSides(o.start.width, o.start.height, o.start.scale, cw, ch, ho, vo);
    sides.end = getKBSides(o.start.width, o.start.height, o.end.scale, cw, ch, ho, vo);

    return sides;
  };

  const kcalcL = function kcalcL(cw, ch, d) {
    const f = d.scalestart / 100;
    const fe = d.scaleend / 100;
    const ofs = d.oofsetstart !== undefined ? d.offsetstart.split(' ') || [0, 0] : [0, 0];
    const ofe = d.offsetend !== undefined ? d.offsetend.split(' ') || [0, 0] : [0, 0];
    d.bgposition = d.bgposition === 'center center' ? '50% 50%' : d.bgposition;


    const o = {};

    o.start = {};
    o.starto = {};
    o.end = {};
    o.endo = {};

    o.start.width = cw;
    o.start.height = o.start.width / d.owidth * d.oheight;

    if (o.start.height < ch) {
      const newf = ch / o.start.height;
      o.start.height = ch;
      o.start.width = o.start.width * newf;
    }
    o.start.transformOrigin = d.bgposition;
    o.start.scale = f;
    o.end.scale = fe;

    o.start.rotation = `${d.rotatestart}deg`;
    o.end.rotation = `${d.rotateend}deg`;

    // MAKE SURE THAT OFFSETS ARE NOT TOO HIGH
    const c = getKBCorners(d, cw, ch, ofs, o);


    ofs[0] = parseFloat(ofs[0]) + c.start.l;
    ofe[0] = parseFloat(ofe[0]) + c.end.l;

    ofs[1] = parseFloat(ofs[1]) + c.start.t;
    ofe[1] = parseFloat(ofe[1]) + c.end.t;

    const iws = c.start.r - c.start.l;
    const ihs = c.start.b - c.start.t;
    const iwe = c.end.r - c.end.l;
    const ihe = c.end.b - c.end.t;

    ofs[0] = ofs[0] > 0 ? 0 : iws + ofs[0] < cw ? cw - iws : ofs[0];
    ofe[0] = ofe[0] > 0 ? 0 : iwe + ofe[0] < cw ? cw - iwe : ofe[0];

    ofs[1] = ofs[1] > 0 ? 0 : ihs + ofs[1] < ch ? ch - ihs : ofs[1];
    ofe[1] = ofe[1] > 0 ? 0 : ihe + ofe[1] < ch ? ch - ihe : ofe[1];


    o.starto.x = `${ofs[0]}px`;
    o.starto.y = `${ofs[1]}px`;
    o.endo.x = `${ofe[0]}px`;
    o.endo.y = `${ofe[1]}px`;
    o.end.ease = o.endo.ease = d.ease;
    o.end.force3D = o.endo.force3D = true;
    return o;
  };

  // /////////////////////////////////////////
  // // EXTENDED FUNCTIONS AVAILABLE GLOBAL //
  // /////////////////////////////////////////
  $.extend(true, _R, {

    stopKenBurn: function stopKenBurn(l) {
      if (l.data('kbtl') !== undefined) { l.data('kbtl').pause(); }
    },

    startKenBurn: function startKenBurn(l, opt, prgs) {
      const d = l.data();
      const i = l.find('.defaultimg');
      const s = i.data('lazyload') || i.data('src');
      const cw = opt.sliderType === 'carousel' ? opt.carousel.slide_width : opt.ul.width();
      const ch = opt.ul.height();

      if (l.data('kbtl')) { l.data('kbtl').kill(); }

      prgs = prgs || 0;

      // NO KEN BURN IMAGE EXIST YET
      if (l.find('.tp-kbimg').length === 0) {
        l.append(`<div class="tp-kbimg-wrap" style="z-index:2;width:100%;height:100%;top:0px;left:0px;position:absolute;"><img class="tp-kbimg" src="${s}" style="position:absolute;" width="${d.owidth}" height="${d.oheight}"></div>`);
        l.data('kenburn', l.find('.tp-kbimg'));
      }

      if (l.data('kbtl') !== undefined) {
        l.data('kbtl').kill();
        l.removeData('kbtl');
      }

      const k = l.data('kenburn');
      const kw = k.parent();
      const anim = kcalcL(cw, ch, d);
      const kbtl = new TimelineLite();


      kbtl.pause();

      anim.start.transformOrigin = '0% 0%';
      anim.starto.transformOrigin = '0% 0%';

      kbtl.add(TweenLite.fromTo(k, d.duration / 1000, anim.start, anim.end), 0);
      kbtl.add(TweenLite.fromTo(kw, d.duration / 1000, anim.starto, anim.endo), 0);

      kbtl.progress(prgs);
      kbtl.play();

      l.data('kbtl', kbtl);
    },
  });
};
