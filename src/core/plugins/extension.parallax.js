import { TimelineLite, TweenLite, Power3 } from 'gsap';

/* global Hammer YT $f $ */
/* eslint-disable no-param-reassign */
/* eslint-disable operator-assignment */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-mixed-operators */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-eval */
/* eslint-disable no-continue */
/* eslint-disable no-cond-assign */
/* eslint-disable no-use-before-define */

export default ($) => {
  const _R = $.fn.revolution;
  const _ISM = _R.is_mobile();

  $.extend(true, _R, {
    checkForParallax: function checkForParallax(container, opt) {
      const _ = opt.parallax;

      if (_ISM && _.disable_onmobile === 'on') return false;

      if (_.type === '3D' || _.type === '3d') {
        TweenLite.set(opt.c, { overflow: _.ddd_overflow });
        TweenLite.set(opt.ul, { overflow: _.ddd_overflow });
        if (opt.sliderType !== 'carousel' && _.ddd_shadow === 'on') {
          opt.c.prepend('<div class="dddwrappershadow"></div>');
          TweenLite.set(opt.c.find('.dddwrappershadow'), { force3D: 'auto', transformPerspective: 1600, transformOrigin: '50% 50%', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0 });
        }
      }

      opt.li.each((j, ele) => {
        const li = $(ele);

        if (_.type === '3D' || _.type === '3d') {
          li.find('.slotholder').wrapAll('<div class="dddwrapper" style="width:100%;height:100%;position:absolute;top:0px;left:0px;overflow:hidden"></div>');
          li.find('.tp-parallax-wrap').wrapAll(`<div class="dddwrapper-layer" style="width:100%;height:100%;position:absolute;top:0px;left:0px;z-index:5;overflow:${_.ddd_layer_overflow};"></div>`);

          // MOVE THE REMOVED 3D LAYERS OUT OF THE PARALLAX GROUP
          li.find('.rs-parallaxlevel-tobggroup').closest('.tp-parallax-wrap').wrapAll('<div class="dddwrapper-layertobggroup" style="position:absolute;top:0px;left:0px;z-index:50;width:100%;height:100%"></div>');

          const dddw = li.find('.dddwrapper');
          const dddwl = li.find('.dddwrapper-layer');
          const dddwlbg = li.find('.dddwrapper-layertobggroup');
          dddwlbg.appendTo(dddw);

          if (opt.sliderType === 'carousel') {
            if (_.ddd_shadow === 'on') dddw.addClass('dddwrappershadow');
            TweenLite.set(dddw, { borderRadius: opt.carousel.border_radius });
          }
          TweenLite.set(li, { overflow: 'visible', transformStyle: 'preserve-3d', perspective: 1600 });
          TweenLite.set(dddw, { force3D: 'auto', transformOrigin: '50% 50%' });
          TweenLite.set(dddwl, { force3D: 'auto', transformOrigin: '50% 50%', zIndex: 5 });
          TweenLite.set(opt.ul, { transformStyle: 'preserve-3d', transformPerspective: 1600 });
        }
      });

      for (let i = 1; i <= _.levels.length; i += 1) {
        opt.c.find(`.rs-parallaxlevel-${i}`).each((j, el) => {
          const pw = $(el);
          const tpw = pw.closest('.tp-parallax-wrap');
          tpw.data('parallaxlevel', _.levels[i - 1]);
          tpw.addClass('tp-parallax-container');
        });
      }
      if (_.type === 'mouse' || _.type === 'scroll+mouse' || _.type === 'mouse+scroll' || _.type === '3D' || _.type === '3d') {
        container.mouseenter((event) => {
          const currslide = container.find('.active-revslide');
          const t = container.offset().top;
          const l = container.offset().left;
          const ex = (event.pageX - l);
          const ey = (event.pageY - t);
          currslide.data('enterx', ex);
          currslide.data('entery', ey);
        });

        container.on('mousemove.hoverdir, mouseleave.hoverdir, trigger3dpath', (event, data) => {
          const currslide = data && data.li ? data.li : container.find('.active-revslide');
          // CALCULATE DISTANCES
          let diffh;
          let diffv;
          let s;
          if (_.origo === 'enterpoint') {
            const t = container.offset().top;
            const l = container.offset().left;

            if (currslide.data('enterx') === undefined) currslide.data('enterx', (event.pageX - l));
            if (currslide.data('entery') === undefined) currslide.data('entery', (event.pageY - t));

            const mh = currslide.data('enterx') || (event.pageX - l);
            const mv = currslide.data('entery') || (event.pageY - t);
            diffh = (mh - (event.pageX - l));
            diffv = (mv - (event.pageY - t));
            s = _.speed / 1000 || 0.4;
          } else {
            const t = container.offset().top;
            const l = container.offset().left;
            diffh = (opt.conw / 2 - (event.pageX - l));
            diffv = (opt.conh / 2 - (event.pageY - t));
            s = _.speed / 1000 || 3;
          }

          if (event.type === 'mouseleave') {
            diffh = _.ddd_lasth || 0;
            diffv = _.ddd_lastv || 0;
            s = 1.5;
          }

          const pcnts = [];
          currslide.find('.tp-parallax-container').each((i, el) => {
            pcnts.push($(el));
          });
          container.find('.tp-static-layers .tp-parallax-container').each((i, el) => {
            pcnts.push($(el));
          });

          $.each(pcnts, (i, el) => {
            const pc = $(el);
            const bl = parseInt(pc.data('parallaxlevel'), 0);
            const pl = _.type === '3D' || _.type === '3d' ? bl / 200 : bl / 100;
            const offsh = diffh * pl;
            const offsv = diffv * pl;
            if (_.type === 'scroll+mouse' || _.type === 'mouse+scroll') { TweenLite.to(pc, s, { force3D: 'auto', x: offsh, ease: Power3.easeOut, overwrite: 'all' }); } else { TweenLite.to(pc, s, { force3D: 'auto', x: offsh, y: offsv, ease: Power3.easeOut, overwrite: 'all' }); }
          });

          if (_.type === '3D' || _.type === '3d') {
            let sctor = '.tp-revslider-slidesli .dddwrapper, .dddwrappershadow, .tp-revslider-slidesli .dddwrapper-layer';
            if (opt.sliderType === 'carousel') sctor = '.tp-revslider-slidesli .dddwrapper, .tp-revslider-slidesli .dddwrapper-layer';
            opt.c.find(sctor).each((i, el) => {
              const t = $(el);
              const pl = _.levels[_.levels.length - 1] / 200;
              let offsh = diffh * pl;
              let offsv = diffv * pl;
              const offrv = opt.conw === 0 ? 0 : Math.round((diffh / opt.conw * pl) * 100) || 0;
              const offrh = opt.conh === 0 ? 0 : Math.round((diffv / opt.conh * pl) * 100) || 0;
              const li = t.closest('li');
              let zz = 0;
              let itslayer = false;

              if (t.hasClass('dddwrapper-layer')) {
                zz = _.ddd_z_correction || 65;
                itslayer = true;
              }

              if (t.hasClass('dddwrapper-layer')) {
                offsh = 0;
                offsv = 0;
              }

              if (li.hasClass('active-revslide') || opt.sliderType !== 'carousel') {
                if (_.ddd_bgfreeze !== 'on' || (itslayer)) { TweenLite.to(t, s, { rotationX: offrh, rotationY: -offrv, x: offsh, z: zz, y: offsv, ease: Power3.easeOut, overwrite: 'all' }); } else { TweenLite.to(t, 0.5, { force3D: 'auto', rotationY: 0, rotationX: 0, z: 0, ease: Power3.easeOut, overwrite: 'all' }); }
              } else { TweenLite.to(t, 0.5, { force3D: 'auto', rotationY: 0, z: 0, x: 0, y: 0, rotationX: 0, ease: Power3.easeOut, overwrite: 'all' }); }

              if (event.type === 'mouseleave') { TweenLite.to($(el), 3.8, { z: 0, ease: Power3.easeOut }); }
            });
          }
        });

        if (_ISM) {
          window.ondeviceorientation = (event) => {
            let y = Math.round(event.beta || 0) - 70;
            let x = Math.round(event.gamma || 0);

            const currslide = container.find('.active-revslide');

            if ($(window).width() > $(window).height()) {
              const xx = x;
              x = y;
              y = xx;
            }

            const cw = container.width();
            const ch = container.height();
            const diffh = (360 / cw * x);
            const diffv = (180 / ch * y);
            const s = _.speed / 1000 || 3;
            const pcnts = [];

            currslide.find('.tp-parallax-container').each((i, el) => {
              pcnts.push($(el));
            });
            container.find('.tp-static-layers .tp-parallax-container').each((i, el) => {
              pcnts.push($(el));
            });

            $.each(pcnts, (i, el) => {
              const pc = $(el);
              const bl = parseInt(pc.data('parallaxlevel'), 0);
              const pl = bl / 100;
              const offsh = diffh * pl * 2;
              const offsv = diffv * pl * 4;
              TweenLite.to(pc, s, { force3D: 'auto', x: offsh, y: offsv, ease: Power3.easeOut, overwrite: 'all' });
            });

            if (_.type === '3D' || _.type === '3d') {
              let sctor = '.tp-revslider-slidesli .dddwrapper, .dddwrappershadow, .tp-revslider-slidesli .dddwrapper-layer';
              if (opt.sliderType === 'carousel') sctor = '.tp-revslider-slidesli .dddwrapper, .tp-revslider-slidesli .dddwrapper-layer';
              opt.c.find(sctor).each((i, el) => {
                const t = $(el);
                const pl = _.levels[_.levels.length - 1] / 200;
                let offsh = diffh * pl;
                let offsv = diffv * pl * 3;
                const offrv = opt.conw === 0 ? 0 : Math.round((diffh / opt.conw * pl) * 500) || 0;
                const offrh = opt.conh === 0 ? 0 : Math.round((diffv / opt.conh * pl) * 700) || 0;
                const li = t.closest('li');
                let zz = 0;
                let itslayer = false;

                if (t.hasClass('dddwrapper-layer')) {
                  zz = _.ddd_z_correction || 65;
                  itslayer = true;
                }

                if (t.hasClass('dddwrapper-layer')) {
                  offsh = 0;
                  offsv = 0;
                }

                if (li.hasClass('active-revslide') || opt.sliderType !== 'carousel') {
                  if (_.ddd_bgfreeze !== 'on' || (itslayer)) {
                    TweenLite.to(t, s, { rotationX: offrh, rotationY: -offrv, x: offsh, z: zz, y: offsv, ease: Power3.easeOut, overwrite: 'all' });
                  } else {
                    TweenLite.to(t, 0.5, { force3D: 'auto', rotationY: 0, rotationX: 0, z: 0, ease: Power3.easeOut, overwrite: 'all' });
                  }
                } else {
                  TweenLite.to(t, 0.5, { force3D: 'auto', rotationY: 0, z: 0, x: 0, y: 0, rotationX: 0, ease: Power3.easeOut, overwrite: 'all' });
                }

                if (event.type === 'mouseleave') { TweenLite.to($(el), 3.8, { z: 0, ease: Power3.easeOut }); }
              });
            }
          };
        }
      }

      _R.scrollTicker(opt, container);

      return true;
    },

    scrollTicker: function scrollTicker(opt, container) {
      if (opt.scrollTicker !== true) {
        opt.scrollTicker = true;
        if (_ISM) {
          TweenLite.ticker.fps(150);
          TweenLite.ticker.addEventListener('tick', () => { _R.scrollHandling(opt); }, container, false, 1);
        } else {
          $(window).on('scroll mousewheel DOMMouseScroll', () => {
            _R.scrollHandling(opt, true);
          });
        }
      }
      _R.scrollHandling(opt, true);
    },

    scrollHandling: function scrollHandling(opt, fromMouse) {
      opt.lastwindowheight = opt.lastwindowheight || $(window).height();

      const t = opt.c.offset().top;
      const st = $(window).scrollTop();
      const b = {};
      const _v = opt.viewPort;
      const _ = opt.parallax;
      if (opt.lastscrolltop === st && !opt.duringslidechange && !fromMouse) return false;
      function saveLastScroll(opts, sts) {
        opts.lastscrolltop = sts;
      }
      TweenLite.delayedCall(0.2, saveLastScroll, [opt, st]);

      b.top = (t - st);
      b.h = opt.conh === 0 ? opt.c.height() : opt.conh;
      b.bottom = (t - st) + b.h;

      const proc = b.top < 0 || b.h > opt.lastwindowheight
        ? b.top / b.h
        : b.bottom > opt.lastwindowheight
          ? (b.bottom - opt.lastwindowheight) / b.h
          : 0;
      opt.scrollproc = proc;

      if (_R.callBackHandling) { _R.callBackHandling(opt, 'parallax', 'start'); }
      if (_v.enable) {
        let area = 1 - Math.abs(proc);
        area = area < 0 ? 0 : area;
        // To Make sure it is not any more in %
        if (!$.isNumeric(_v.visible_area)) {
          if (_v.visible_area.includes('%')) { _v.visible_area = parseInt(_v.visible_area, 10) / 100; }
        }
        if (1 - _v.visible_area <= area) {
          if (!opt.inviewport) {
            opt.inviewport = true;
            _R.enterInViewPort(opt);
          }
        } else if (opt.inviewport) {
          opt.inviewport = false;
          _R.leaveViewPort(opt);
        }
      }
      // SCROLL BASED PARALLAX EFFECT
      if (_ISM && opt.parallax.disable_onmobile === 'on') return false;

      const pt = new TimelineLite();
      pt.pause();

      if (_.type !== '3d' && _.type !== '3D') {
        if (_.type === 'scroll' || _.type === 'scroll+mouse' || _.type === 'mouse+scroll') {
          opt.c.find('.tp-parallax-container').each((i, el) => {
            const pc = $(el);
            const pl = parseInt(pc.data('parallaxlevel'), 0) / 100;
            const offsv = proc * -(pl * opt.conh) || 0;

            pc.data('parallaxoffset', offsv);
            pt.add(TweenLite.set(pc, { force3D: 'auto', y: offsv }), 0);
          });
        }

        opt.c.find('.tp-revslider-slidesli .slotholder, .tp-revslider-slidesli .rs-background-video-layer').each((i, el) => {
          // console.log('hey');
          const ts = $(el);
          let l = ts.data('bgparallax') || opt.parallax.bgparallax;
          l = l === 'on' ? 1 : l;
          if (l !== undefined || l !== 'off') {
            const pl = opt.parallax.levels[parseInt(l, 0) - 1] / 100;
            const offsv = proc * -(pl * opt.conh) || 0;
            if ($.isNumeric(offsv)) {
              pt.add(TweenLite.set(ts, { position: 'absolute', top: '0px', left: '0px', backfaceVisibility: 'hidden', force3D: 'true', y: `${offsv}px` }), 0);
            }
          }
        });
      }

      if (_R.callBackHandling) { _R.callBackHandling(opt, 'parallax', 'end'); }

      pt.play(0);
      return true;
    },

  });
};
