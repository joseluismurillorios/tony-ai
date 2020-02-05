import { TweenLite } from 'gsap';

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

  // ////////////////////////////////////////
  // // INITIALISATION OF ACTIONS  - ////////
  // ////////////////////////////////////////
  const checkActionsIntern = function checkActionsIntern(_nc, opt, as) {
    if (as) {
      $.each(as, (j, a) => {
        a.delay = parseInt(a.delay, 0) / 1000;
        _nc.addClass('noSwipe');

        // LISTEN TO ESC TO EXIT FROM FULLSCREEN
        if (!opt.fullscreen_esclistener) {
          if (a.action === 'exitfullscreen' || a.action === 'togglefullscreen') {
            $(document).keyup((e) => {
              if (e.keyCode === 27 && $('#rs-go-fullscreen').length > 0) { _nc.trigger(a.event); }
            });
            opt.fullscreen_esclistener = true;
          }
        }

        const tnc = a.layer === 'backgroundvideo' ? $('.rs-background-video-layer') : a.layer === 'firstvideo' ? $('.tp-revslider-slidesli').find('.tp-videolayer') : $(`#${a.layer}`);
        // COLLECT ALL TOGGLE TRIGGER TO CONNECT THEM WITH TRIGGERED LAYER
        switch (a.action) {
          case 'togglevideo': {
            $.each(tnc, (i, _tnc) => {
              _tnc = $(_tnc);
              let videotoggledby = _tnc.data('videotoggledby');
              if (videotoggledby === undefined) { videotoggledby = []; }
              videotoggledby.push(_nc);
              _tnc.data('videotoggledby', videotoggledby);
            });
            break;
          }
          case 'togglelayer': {
            $.each(tnc, (i, _tnc) => {
              _tnc = $(_tnc);
              let layertoggledby = _tnc.data('layertoggledby');
              if (layertoggledby === undefined) { layertoggledby = []; }
              layertoggledby.push(_nc);
              _tnc.data('layertoggledby', layertoggledby);
            });
            break;
          }
          case 'toggle_mute_video': {
            $.each(tnc, (i, _tnc) => {
              _tnc = $(_tnc);
              let videomutetoggledby = _tnc.data('videomutetoggledby');
              if (videomutetoggledby === undefined) { videomutetoggledby = []; }
              videomutetoggledby.push(_nc);
              _tnc.data('videomutetoggledby', videomutetoggledby);
            });
            break;
          }
          case 'toggle_global_mute_video': {
            $.each(tnc, (i, _tnc) => {
              _tnc = $(_tnc);
              let videomutetoggledby = _tnc.data('videomutetoggledby');
              if (videomutetoggledby === undefined) { videomutetoggledby = []; }
              videomutetoggledby.push(_nc);
              _tnc.data('videomutetoggledby', videomutetoggledby);
            });
            break;
          }
          case 'toggleslider': {
            if (opt.slidertoggledby === undefined) opt.slidertoggledby = [];
            opt.slidertoggledby.push(_nc);
            break;
          }
          case 'togglefullscreen': {
            if (opt.fullscreentoggledby === undefined) opt.fullscreentoggledby = [];
            opt.fullscreentoggledby.push(_nc);
            break;
          }
          default:
        }

        _nc.on(a.event, () => {
          const tncc = a.layer === 'backgroundvideo' ? $('.active-revslide .slotholder .rs-background-video-layer') : a.layer === 'firstvideo' ? $('.active-revslide .tp-videolayer').first() : $(`#${a.layer}`);

          if (a.action === 'stoplayer' || a.action === 'togglelayer' || a.action === 'startlayer') {
            if (tncc.length > 0) {
              if (a.action === 'startlayer' || (a.action === 'togglelayer' && tncc.data('animdirection') !== 'in')) {
                tncc.data('animdirection', 'in');
                const otl = tncc.data('timeline_out');
                const baseOffsetx = opt.sliderType === 'carousel' ? 0 : opt.width / 2 - (opt.gridwidth[opt.curWinRange] * opt.bw) / 2;
                const baseOffsety = 0;
                if (otl !== undefined) otl.pause(0).kill();
                if (_R.animateSingleCaption) {
                  _R.animateSingleCaption(tncc, opt, baseOffsetx, baseOffsety, 0, false, true);
                }
                const tl = tncc.data('timeline');
                tncc.data('triggerstate', 'on');
                _R.toggleState(tncc.data('layertoggledby'));
                TweenLite.delayedCall(a.delay, () => {
                  tl.play(0);
                }, [tl]);
              } else

                if (a.action === 'stoplayer' || (a.action === 'togglelayer' && tncc.data('animdirection') !== 'out')) {
                  tncc.data('animdirection', 'out');
                  tncc.data('triggered', true);
                  tncc.data('triggerstate', 'off');
                  if (_R.stopVideo) _R.stopVideo(tncc, opt);
                  if (_R.endMoveCaption) {
                    TweenLite.delayedCall(a.delay, _R.endMoveCaption, [tncc, null, null, opt]);
                  }
                  _R.unToggleState(tncc.data('layertoggledby'));
                }
            }
          } else if (_ISM && (a.action === 'playvideo' || a.action === 'stopvideo' || a.action === 'togglevideo' || a.action === 'mutevideo' || a.action === 'unmutevideo' || a.action === 'toggle_mute_video' || a.action === 'toggle_global_mute_video')) {
            actionSwitches(tncc, opt, a, _nc);
          } else {
            TweenLite.delayedCall(a.delay, () => {
              actionSwitches(tncc, opt, a, _nc);
            }, [tncc, opt, a, _nc]);
          }
        });
        switch (a.action) {
          case 'togglelayer':
          case 'startlayer':
          case 'playlayer':
          case 'stoplayer': {
            const tncc = $(`#${a.layer}`);
            if (tncc.data('start') !== 'bytrigger') {
              tncc.data('triggerstate', 'on');
              tncc.data('animdirection', 'in');
            }
            break;
          }
          default:
        }
      });
    }
  };


  const actionSwitches = function actionSwitches(tnc, opt, a, _nc) {
    switch (a.action) {
      case 'scrollbelow': {
        _nc.addClass('tp-scrollbelowslider');
        _nc.data('scrolloffset', a.offset);
        _nc.data('scrolldelay', a.delay);
        let off = getOffContH(opt.fullScreenOffsetContainer) || 0;
        const aof = parseInt(a.offset, 0) || 0;
        off = off - aof || 0;
        $('body,html').animate({ scrollTop: `${opt.c.offset().top + ($(opt.li[0]).height()) - off}px` }, { duration: 400 });
        break;
      }
      case 'callback': {
        eval(a.callback);
        break;
      }
      case 'jumptoslide':
        switch (a.slide.toLowerCase()) {
          case '+1':
          case 'next': {
            opt.sc_indicator = 'arrow';
            _R.callingNewSlide(opt, opt.c, 1);
            break;
          }
          case 'previous':
          case 'prev':
          case '-1': {
            opt.sc_indicator = 'arrow';
            _R.callingNewSlide(opt, opt.c, -1);
            break;
          }
          default: {
            const ts = $.isNumeric(a.slide) ? parseInt(a.slide, 0) : a.slide;
            _R.callingNewSlide(opt, opt.c, ts);
            break;
          }
        }
        break;
      case 'simplelink': {
        window.open(a.url, a.target);
        break;
      }
      case 'toggleslider': {
        opt.noloopanymore = 0;
        if (opt.sliderstatus === 'playing') {
          opt.c.revpause();
          opt.forcepause_viatoggle = true;
          _R.unToggleState(opt.slidertoggledby);
        } else {
          opt.forcepause_viatoggle = false;
          opt.c.revresume();
          _R.toggleState(opt.slidertoggledby);
        }
        break;
      }
      case 'pauseslider': {
        opt.c.revpause();
        _R.unToggleState(opt.slidertoggledby);
        break;
      }
      case 'playslider': {
        opt.noloopanymore = 0;
        opt.c.revresume();
        _R.toggleState(opt.slidertoggledby);
        break;
      }
      case 'playvideo': {
        if (tnc.length > 0) { _R.playVideo(tnc, opt); }
        break;
      }
      case 'stopvideo': {
        if (tnc.length > 0) { if (_R.stopVideo) _R.stopVideo(tnc, opt); }
        break;
      }
      case 'togglevideo': {
        if (tnc.length > 0) {
          if (!_R.isVideoPlaying(tnc, opt)) { _R.playVideo(tnc, opt); } else
            if (_R.stopVideo) _R.stopVideo(tnc, opt);
        }
        break;
      }
      case 'mutevideo': {
        if (tnc.length > 0) { _R.muteVideo(tnc, opt); }
        break;
      }
      case 'unmutevideo': {
        if (tnc.length > 0) { if (_R.unMuteVideo) _R.unMuteVideo(tnc, opt); }
        break;
      }
      case 'toggle_mute_video': {
        if (tnc.length > 0) {
          if (_R.isVideoMuted(tnc, opt)) {
            _R.unMuteVideo(tnc, opt);
          } else if (_R.muteVideo) _R.muteVideo(tnc, opt);
        }
        _nc.toggleClass('rs-toggle-content-active');
        break;
      }
      case 'toggle_global_mute_video': {
        if (_nc.hasClass('rs-toggle-content-active')) {
          opt.globalmute = false;
          if (opt.playingvideos !== undefined && opt.playingvideos.length > 0) {
            $.each(opt.playingvideos, (i, _ncc) => {
              if (_R.unMuteVideo) _R.unMuteVideo(_ncc, opt);
            });
          }
        } else {
          opt.globalmute = true;
          if (opt.playingvideos !== undefined && opt.playingvideos.length > 0) {
            $.each(opt.playingvideos, (i, _ncc) => {
              if (_R.muteVideo) _R.muteVideo(_ncc, opt);
            });
          }
        }
        _nc.toggleClass('rs-toggle-content-active');
        break;
      }
      case 'simulateclick': {
        if (tnc.length > 0) tnc.click();
        break;
      }
      case 'toggleclass': {
        if (tnc.length > 0) {
          if (!tnc.hasClass(a.classname)) {
            tnc.addClass(a.classname);
          } else {
            tnc.removeClass(a.classname);
          }
        }
        break;
      }
      case 'gofullscreen':
      case 'exitfullscreen':
      case 'togglefullscreen': {
        if ($('#rs-go-fullscreen').length > 0 && (a.action === 'togglefullscreen' || a.action === 'exitfullscreen')) {
          $('#rs-go-fullscreen').appendTo($('#rs-was-here'));
          const paw = opt.c.closest('.forcefullwidth_wrapper_tp_banner').length > 0 ? opt.c.closest('.forcefullwidth_wrapper_tp_banner') : opt.c.closest('.rev_slider_wrapper');
          paw.unwrap();
          paw.unwrap();
          opt.minHeight = opt.oldminheight;
          opt.infullscreenmode = false;
          opt.c.revredraw();
          if (opt.playingvideos !== undefined && opt.playingvideos.length > 0) {
            $.each(opt.playingvideos, (i, _ncc) => {
              _R.playVideo(_ncc, opt);
            });
          }
          _R.unToggleState(opt.fullscreentoggledby);
        } else
          if ($('#rs-go-fullscreen').length === 0 && (a.action === 'togglefullscreen' || a.action === 'gofullscreen')) {
            const paw = opt.c.closest('.forcefullwidth_wrapper_tp_banner').length > 0 ? opt.c.closest('.forcefullwidth_wrapper_tp_banner') : opt.c.closest('.rev_slider_wrapper');
            paw.wrap('<div id="rs-was-here"><div id="rs-go-fullscreen"></div></div>');
            const gf = $('#rs-go-fullscreen');
            gf.appendTo($('body'));
            gf.css({ position: 'fixed', width: '100%', height: '100%', top: '0px', left: '0px', zIndex: '9999999', background: '#ffffff' });
            opt.oldminheight = opt.minHeight;
            opt.minHeight = $(window).height();
            opt.infullscreenmode = true;
            opt.c.revredraw();
            if (opt.playingvideos !== undefined && opt.playingvideos.length > 0) {
              $.each(opt.playingvideos, (i, _ncc) => {
                _R.playVideo(_ncc, opt);
              });
            }
            _R.toggleState(opt.fullscreentoggledby);
          }

        break;
      }
      default:
    }
  };

  const getOffContH = function getOffContH(c) {
    if (c === undefined) return 0;
    if (c.split(',').length > 1) {
      const oc = c.split(',');
      let a = 0;
      if (oc) {
        $.each(oc, (index, sc) => {
          if ($(sc).length > 0) { a = a + $(sc).outerHeight(true); }
        });
      }
      return a;
    }
    return $(c).height();
  };

  // /////////////////////////////////////////
  //  EXTENDED FUNCTIONS AVAILABLE GLOBAL  //
  // /////////////////////////////////////////
  $.extend(true, _R, {
    checkActions(_nc, opt, as) {
      checkActionsIntern(_nc, opt, as);
    },
  });
};
