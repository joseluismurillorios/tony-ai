import { TweenLite, Power3 } from 'gsap';

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

  function getStartSec(st) {
    return st === undefined ? -1 : $.isNumeric(st) ? st : st.split(':').length > 1 ? parseInt(st.split(':')[0], 0) * 60 + parseInt(st.split(':')[1], 0) : st;
  }

  // //////////////////////////////////////////////////////////
  // //  VIMEO ADD EVENT  /////////////////////////////////////
  // //////////////////////////////////////////////////////////

  const addEvent = function addEvent(element, eventName, callback) {
    if (element.addEventListener) {
      element.addEventListener(eventName, callback, false);
    } else {
      element.attachEvent(eventName, callback, false);
    }
  };

  const getVideoDatas = function getVideoDatas(p, t, d) {
    const a = {};
    a.video = p;
    a.videotype = t;
    a.settings = d;
    return a;
  };

  const addVideoListener = function addVideoListener(_nc, opt, startnow) {
    const ifr = _nc.find('iframe');
    const frameID = `iframe${Math.round(Math.random() * 100000 + 1)}`;
    let loop = _nc.data('videoloop');
    const pforv = loop !== 'loopandnoslidestop';

    loop = loop === 'loop' || loop === 'loopandnoslidestop';

    // CARE ABOUT ASPECT RATIO

    if (_nc.data('forcecover') === 1) {
      _nc.removeClass('fullscreenvideo').addClass('coverscreenvideo');
      const asprat = _nc.data('aspectratio');
      if (asprat !== undefined && asprat.split(':').length > 1) { _R.prepareCoveredVideo(asprat, opt, _nc); }
    }

    if (_nc.data('bgvideo') === 1) {
      const asprat = _nc.data('aspectratio');
      if (asprat !== undefined && asprat.split(':').length > 1) { _R.prepareCoveredVideo(asprat, opt, _nc); }
    }


    // IF LISTENER DOES NOT EXIST YET
    ifr.attr('id', frameID);

    if (startnow) _nc.data('startvideonow', true);

    if (_nc.data('videolistenerexist') !== 1) {
      switch (_nc.data('videotype')) {
        // YOUTUBE LISTENER
        case 'youtube': {
          const player = new YT.Player(frameID, {
            events: {
              onStateChange: function onStateChange(event) {
                const container = _nc.closest('.tp-simpleresponsive');
                const fsmode = checkfullscreenEnabled();

                if (event.data === YT.PlayerState.PLAYING) {
                  TweenLite.to(_nc.find('.tp-videoposter'), 0.3, { autoAlpha: 0, force3D: 'auto', ease: Power3.easeInOut });
                  TweenLite.to(_nc.find('iframe'), 0.3, { autoAlpha: 1, display: 'block', ease: Power3.easeInOut });
                  if (_nc.data('volume') === 'mute' || _R.lastToggleState(_nc.data('videomutetoggledby')) || opt.globalmute === true) {
                    player.mute();
                  } else {
                    player.unMute();
                    player.setVolume(parseInt(_nc.data('volume'), 0) || 75);
                  }

                  opt.videoplaying = true;
                  addVidtoList(_nc, opt);
                  if (pforv) { opt.c.trigger('stoptimer'); } else { opt.videoplaying = false; }

                  opt.c.trigger('revolution.slide.onvideoplay', getVideoDatas(player, 'youtube', _nc.data()));
                  _R.toggleState(_nc.data('videotoggledby'));
                } else {
                  if (event.data === 0 && loop) {
                    // player.playVideo();
                    const s = getStartSec(_nc.data('videostartat'));
                    if (s !== -1) player.seekTo(s);
                    player.playVideo();
                    _R.toggleState(_nc.data('videotoggledby'));
                  }

                  if (!fsmode && (event.data === 0 || event.data === 2) && _nc.data('showcoveronpause') === 'on' && _nc.find('.tp-videoposter').length > 0) {
                    TweenLite.to(_nc.find('.tp-videoposter'), 0.3, { autoAlpha: 1, force3D: 'auto', ease: Power3.easeInOut });
                    TweenLite.to(_nc.find('iframe'), 0.3, { autoAlpha: 0, ease: Power3.easeInOut });
                  }
                  if ((event.data !== -1 && event.data !== 3)) {
                    opt.videoplaying = false;
                    opt.tonpause = false;

                    remVidfromList(_nc, opt);
                    container.trigger('starttimer');
                    opt.c.trigger('revolution.slide.onvideostop', getVideoDatas(player, 'youtube', _nc.data()));

                    if (opt.currentLayerVideoIsPlaying === undefined || opt.currentLayerVideoIsPlaying.attr('id') === _nc.attr('id')) { _R.unToggleState(_nc.data('videotoggledby')); }
                  }

                  if (event.data === 0 && _nc.data('nextslideatend') === true) {
                    exitFullscreen();
                    _nc.data('nextslideatend-triggered', 1);
                    opt.c.revnext();
                    remVidfromList(_nc, opt);
                  } else {
                    remVidfromList(_nc, opt);
                    opt.videoplaying = false;
                    container.trigger('starttimer');
                    opt.c.trigger('revolution.slide.onvideostop', getVideoDatas(player, 'youtube', _nc.data()));
                    if (opt.currentLayerVideoIsPlaying === undefined || opt.currentLayerVideoIsPlaying.attr('id') === _nc.attr('id')) { _R.unToggleState(_nc.data('videotoggledby')); }
                  }
                }
              },
              onReady: function onReady(event) {
                const videorate = _nc.data('videorate');

                _nc.addClass('rs-apiready');
                if (videorate !== undefined) {
                  event.target.setPlaybackRate(parseFloat(videorate));
                }

                // PLAY VIDEO IF THUMBNAIL HAS BEEN CLICKED
                _nc.find('.tp-videoposter').unbind('click');
                _nc.find('.tp-videoposter').click(() => {
                  if (!_ISM) {
                    player.playVideo();
                  }
                });

                if (_nc.data('startvideonow')) {
                  _nc.data('player').playVideo();
                  const s = getStartSec(_nc.data('videostartat'));
                  if (s !== -1) _nc.data('player').seekTo(s);
                  // _nc.find('.tp-videoposter').click();
                }
                _nc.data('videolistenerexist', 1);
              },
            },
          });
          _nc.data('player', player);
          break;
        }
        // VIMEO LISTENER
        case 'vimeo': {
          let isrc = ifr.attr('src');
          const queryParameters = {};
          const queryString = isrc;
          const re = /([^&=]+)=([^&]*)/g;
          let m;
          // Creates a map with the query string parameters
          while (m = re.exec(queryString)) {
            queryParameters[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
          }
          if (queryParameters.player_id !== undefined) { isrc = isrc.replace(queryParameters.player_id, frameID); } else { isrc = `${isrc}&player_id=${frameID}`; }
          try { isrc = isrc.replace('api=0', 'api=1'); } catch (e) { console.log(e); }
          isrc = `${isrc}&api=1`;
          ifr.attr('src', isrc);

          const f = $f(frameID);

          f.addEvent('ready', () => {
            _nc.addClass('rs-apiready');
            f.addEvent('play', () => {
              _nc.data('nextslidecalled', 0);
              TweenLite.to(_nc.find('.tp-videoposter'), 0.3, { autoAlpha: 0, force3D: 'auto', ease: Power3.easeInOut });
              TweenLite.to(_nc.find('iframe'), 0.3, { autoAlpha: 1, display: 'block', ease: Power3.easeInOut });
              opt.c.trigger('revolution.slide.onvideoplay', getVideoDatas(f, 'vimeo', _nc.data()));
              opt.videoplaying = true;

              addVidtoList(_nc, opt);
              if (pforv) { opt.c.trigger('stoptimer'); } else { opt.videoplaying = false; }
              if (_nc.data('volume') === 'mute' || _R.lastToggleState(_nc.data('videomutetoggledby')) || opt.globalmute === true) { f.api('setVolume', '0'); } else { f.api('setVolume', (parseInt(_nc.data('volume'), 0) / 100 || 0.75)); }
              _R.toggleState(_nc.data('videotoggledby'));
            });

            f.addEvent('playProgress', (data) => {
              const et = getStartSec(_nc.data('videoendat'));

              _nc.data('currenttime', data.seconds);
              if (et !== 0 && (Math.abs(et - data.seconds) < 0.3 && et > data.seconds) && _nc.data('nextslidecalled') !== 1) {
                if (loop) {
                  f.api('play');
                  const s = getStartSec(_nc.data('videostartat'));
                  if (s !== -1) f.api('seekTo', s);
                } else {
                  if (_nc.data('nextslideatend') === true) {
                    _nc.data('nextslideatend-triggered', 1);
                    _nc.data('nextslidecalled', 1);
                    opt.c.revnext();
                  }
                  f.api('pause');
                }
              }
            });

            f.addEvent('finish', () => {
              remVidfromList(_nc, opt);
              opt.videoplaying = false;
              opt.c.trigger('starttimer');
              opt.c.trigger('revolution.slide.onvideostop', getVideoDatas(f, 'vimeo', _nc.data()));
              if (_nc.data('nextslideatend') === true) {
                _nc.data('nextslideatend-triggered', 1);
                opt.c.revnext();
              }
              if (opt.currentLayerVideoIsPlaying === undefined || opt.currentLayerVideoIsPlaying.attr('id') === _nc.attr('id')) { _R.unToggleState(_nc.data('videotoggledby')); }
            });

            f.addEvent('pause', () => {
              if (_nc.find('.tp-videoposter').length > 0 && _nc.data('showcoveronpause') === 'on') {
                TweenLite.to(_nc.find('.tp-videoposter'), 0.3, { autoAlpha: 1, force3D: 'auto', ease: Power3.easeInOut });
                TweenLite.to(_nc.find('iframe'), 0.3, { autoAlpha: 0, ease: Power3.easeInOut });
              }
              opt.videoplaying = false;
              opt.tonpause = false;

              remVidfromList(_nc, opt);
              opt.c.trigger('starttimer');
              opt.c.trigger('revolution.slide.onvideostop', getVideoDatas(f, 'vimeo', _nc.data()));
              if (opt.currentLayerVideoIsPlaying === undefined || opt.currentLayerVideoIsPlaying.attr('id') === _nc.attr('id')) { _R.unToggleState(_nc.data('videotoggledby')); }
            });


            _nc.find('.tp-videoposter').unbind('click');
            _nc.find('.tp-videoposter').click(() => {
              if (!_ISM) {
                f.api('play');
                return false;
              }
              return true;
            });
            if (_nc.data('startvideonow')) {
              f.api('play');
              const s = getStartSec(_nc.data('videostartat'));
              if (s !== -1) f.api('seekTo', s);
            }
            _nc.data('videolistenerexist', 1);
          });
          break;
        }
        default:
      }
    } else {
      const s = getStartSec(_nc.data('videostartat'));
      switch (_nc.data('videotype')) {
        // YOUTUBE LISTENER
        case 'youtube': {
          if (startnow) {
            _nc.data('player').playVideo();
            if (s !== -1) _nc.data('player').seekTo();
          }
          break;
        }
        case 'vimeo': {
          if (startnow) {
            const f = $f(_nc.find('iframe').attr('id'));
            f.api('play');
            if (s !== -1) f.api('seekTo', s);
          }
          break;
        }
        default:
      }
    }
  };

  const exitFullscreen = function exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  };

  const checkfullscreenEnabled = function checkfullscreenEnabled() {
    // FF provides nice flag, maybe others will add support for this later on?
    if (window.fullScreen !== undefined) {
      return window.fullScreen;
    }
    // 5px height margin, just in case (needed by e.g. IE)
    let heightMargin = 5;
    if ($.browser.webkit && /Apple Computer/.test(navigator.vendor)) {
      // Safari in full screen mode shows the navigation bar,
      // which is 40px
      heightMargin = 42;
    }
    return screen.width === window.innerWidth &&
      Math.abs(screen.height - window.innerHeight) < heightMargin;
  };

  // //////////////////////////////////////////////////////////
  // //  HTML5 VIDEOS  /////////////////////////////////////
  // //////////////////////////////////////////////////////////

  const htmlvideoevents = function htmlvideoevents(_nc, opt) {
    if (_ISM && _nc.data('disablevideoonmobile') === 1) return false;
    const tag = _nc.data('audio') === 'html5' ? 'audio' : 'video';
    const jvideo = _nc.find(tag);
    const video = jvideo[0];
    const html5vid = jvideo.parent();
    let loop = _nc.data('videoloop');
    const pforv = loop !== 'loopandnoslidestop';

    loop = loop === 'loop' || loop === 'loopandnoslidestop';

    html5vid.data('metaloaded', 1);
    // FIRST TIME LOADED THE HTML5 VIDEO


    // PLAY, STOP VIDEO ON CLICK OF PLAY, POSTER ELEMENTS
    if (jvideo.attr('control') === undefined) {
      if (_nc.find('.tp-video-play-button').length === 0 && !_ISM) { _nc.append('<div class="tp-video-play-button"><i class="revicon-right-dir"></i><span class="tp-revstop">&nbsp;</span></div>'); }
      _nc.find('video, .tp-poster, .tp-video-play-button').click(() => {
        if (_nc.hasClass('videoisplaying')) { video.pause(); } else { video.play(); }
      });
    }

    // PRESET FULLCOVER VIDEOS ON DEMAND
    if (_nc.data('forcecover') === 1 || _nc.hasClass('fullscreenvideo') || _nc.data('bgvideo') === 1) {
      if (_nc.data('forcecover') === 1 || _nc.data('bgvideo') === 1) {
        html5vid.addClass('fullcoveredvideo');
        const asprat = _nc.data('aspectratio') || '4:3';
        _R.prepareCoveredVideo(asprat, opt, _nc);
      } else { html5vid.addClass('fullscreenvideo'); }
    }


    // FIND CONTROL BUTTONS IN VIDEO, AND ADD EVENT LISTENERS ON THEM
    const playButton = _nc.find('.tp-vid-play-pause')[0];
    const muteButton = _nc.find('.tp-vid-mute')[0];
    const fullScreenButton = _nc.find('.tp-vid-full-screen')[0];
    const seekBar = _nc.find('.tp-seek-bar')[0];
    const volumeBar = _nc.find('.tp-volume-bar')[0];

    if (playButton !== undefined) {
      // Event listener for the play/pause button
      addEvent(playButton, 'click', () => {
        if (video.paused === true) { video.play(); } else { video.pause(); }
      });
    }

    if (muteButton !== undefined) {
      // Event listener for the mute button
      addEvent(muteButton, 'click', () => {
        if (video.muted === false) {
          video.muted = true;
          muteButton.innerHTML = 'Unmute';
        } else {
          video.muted = false;
          muteButton.innerHTML = 'Mute';
        }
      });
    }

    if (fullScreenButton !== undefined) {
      // Event listener for the full-screen button
      if (fullScreenButton) {
        addEvent(fullScreenButton, 'click', () => {
          if (video.requestFullscreen) {
            video.requestFullscreen();
          } else if (video.mozRequestFullScreen) {
            video.mozRequestFullScreen(); // Firefox
          } else if (video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen(); // Chrome and Safari
          }
        });
      }
    }

    if (seekBar !== undefined) {
      // Event listener for the seek bar
      addEvent(seekBar, 'change', () => {
        const time = video.duration * (seekBar.value / 100);
        video.currentTime = time;
      });

      // Pause the video when the seek handle is being dragged
      addEvent(seekBar, 'mousedown', () => {
        _nc.addClass('seekbardragged');
        video.pause();
      });

      // Play the video when the seek handle is dropped
      addEvent(seekBar, 'mouseup', () => {
        _nc.removeClass('seekbardragged');
        video.play();
      });
    }

    addEvent(video, 'canplaythrough', () => {
      _R.preLoadAudioDone(_nc, opt, 'canplaythrough');
    });

    addEvent(video, 'canplay', () => {
      _R.preLoadAudioDone(_nc, opt, 'canplay');
    });

    addEvent(video, 'progress', () => {
      _R.preLoadAudioDone(_nc, opt, 'progress');
    });

    // Update the seek bar as the video plays
    addEvent(video, 'timeupdate', () => {
      const value = (100 / video.duration) * video.currentTime;
      const et = getStartSec(_nc.data('videoendat'));
      const cs = video.currentTime;
      if (seekBar !== undefined) { seekBar.value = value; }

      if (et !== 0 && et !== -1 && (Math.abs(et - cs) <= 0.3 && et > cs) && _nc.data('nextslidecalled') !== 1) {
        if (loop) {
          video.play();
          const s = getStartSec(_nc.data('videostartat'));
          if (s !== -1) video.currentTime = s;
        } else {
          if (_nc.data('nextslideatend') === true) {
            _nc.data('nextslideatend-triggered', 1);
            _nc.data('nextslidecalled', 1);
            opt.just_called_nextslide_at_htmltimer = true;
            opt.c.revnext();
            setTimeout(() => {
              opt.just_called_nextslide_at_htmltimer = false;
            }, 1000);
          }
          video.pause();
        }
      }
    });


    if (volumeBar !== undefined) {
      // Event listener for the volume bar
      addEvent(volumeBar, 'change', () => {
        // Update the video volume
        video.volume = volumeBar.value;
      });
    }


    // VIDEO EVENT LISTENER FOR "PLAY"
    addEvent(video, 'play', () => {
      _nc.data('nextslidecalled', 0);

      let vol = _nc.data('volume');
      vol = vol !== undefined && vol !== 'mute' ? parseFloat(vol) / 100 : vol;

      if (opt.globalmute === true) { video.muted = true; } else { video.muted = false; }

      if (vol > 1) vol = vol / 100;
      if (vol === 'mute') { video.muted = true; } else
        if (vol !== undefined) { video.volume = vol; }


      _nc.addClass('videoisplaying');

      addVidtoList(_nc, opt);

      if (!pforv || tag === 'audio') {
        opt.videoplaying = false;
        if (tag !== 'audio') opt.c.trigger('starttimer');
        opt.c.trigger('revolution.slide.onvideostop', getVideoDatas(video, 'html5', _nc.data()));
      } else {
        opt.videoplaying = true;
        opt.c.trigger('stoptimer');
        opt.c.trigger('revolution.slide.onvideoplay', getVideoDatas(video, 'html5', _nc.data()));
      }

      TweenLite.to(_nc.find('.tp-videoposter'), 0.3, { autoAlpha: 0, force3D: 'auto', ease: Power3.easeInOut });
      TweenLite.to(_nc.find(tag), 0.3, { autoAlpha: 1, display: 'block', ease: Power3.easeInOut });

      if (playButton !== undefined) { playButton.innerHTML = 'Pause'; }
      if (muteButton !== undefined && video.muted) { muteButton.innerHTML = 'Unmute'; }

      _R.toggleState(_nc.data('videotoggledby'));
    });

    // VIDEO EVENT LISTENER FOR "PAUSE"
    addEvent(video, 'pause', () => {
      const fsmode = checkfullscreenEnabled();


      if (!fsmode && _nc.find('.tp-videoposter').length > 0 && _nc.data('showcoveronpause') === 'on' && !_nc.hasClass('seekbardragged')) {
        TweenLite.to(_nc.find('.tp-videoposter'), 0.3, { autoAlpha: 1, force3D: 'auto', ease: Power3.easeInOut });
        TweenLite.to(_nc.find(tag), 0.3, { autoAlpha: 0, ease: Power3.easeInOut });
      }

      _nc.removeClass('videoisplaying');
      opt.videoplaying = false;
      remVidfromList(_nc, opt);
      if (tag !== 'audio') opt.c.trigger('starttimer');
      opt.c.trigger('revolution.slide.onvideostop', getVideoDatas(video, 'html5', _nc.data()));
      if (playButton !== undefined) { playButton.innerHTML = 'Play'; }

      if (opt.currentLayerVideoIsPlaying === undefined || opt.currentLayerVideoIsPlaying.attr('id') === _nc.attr('id')) { _R.unToggleState(_nc.data('videotoggledby')); }
    });

    // VIDEO EVENT LISTENER FOR "END"

    addEvent(video, 'ended', () => {
      exitFullscreen();
      remVidfromList(_nc, opt);
      opt.videoplaying = false;
      remVidfromList(_nc, opt);
      if (tag !== 'audio') opt.c.trigger('starttimer');
      opt.c.trigger('revolution.slide.onvideostop', getVideoDatas(video, 'html5', _nc.data()));
      if (_nc.data('nextslideatend') === true) {
        if (!opt.just_called_nextslide_at_htmltimer === true) {
          _nc.data('nextslideatend-triggered', 1);
          opt.c.revnext();
          opt.just_called_nextslide_at_htmltimer = true;
        }
        setTimeout(() => {
          opt.just_called_nextslide_at_htmltimer = false;
        }, 1500);
      }
      _nc.removeClass('videoisplaying');
    });
    return true;
  };

  const addVidtoList = function addVidtoList(_ncc, opt) {
    if (opt.playingvideos === undefined) opt.playingvideos = [];

    // STOP OTHER VIDEOS
    if (_ncc.data('stopallvideos')) {
      if (opt.playingvideos !== undefined && opt.playingvideos.length > 0) {
        opt.lastplayedvideos = $.extend(true, [], opt.playingvideos);
        $.each(opt.playingvideos, (i, _nccc) => {
          _R.stopVideo(_nccc, opt);
        });
      }
    }
    opt.playingvideos.push(_ncc);
    opt.currentLayerVideoIsPlaying = _ncc;
  };

  const remVidfromList = function remVidfromList(_nc, opt) {
    if (opt.playingvideos !== undefined && $.inArray(_nc, opt.playingvideos) >= 0) {
      opt.playingvideos.splice($.inArray(_nc, opt.playingvideos), 1);
    }
  };

  // /////////////////////////////////////////
  //  EXTENDED FUNCTIONS AVAILABLE GLOBAL  //
  // /////////////////////////////////////////
  $.extend(true, _R, {
    preLoadAudio: function preLoadAudio(li, opt) {
      li.find('.tp-audiolayer').each((i, el) => {
        const element = $(el);
        const obj = {};
        if (element.find('audio').length === 0) {
          obj.src = element.data('videomp4') !== undefined ? element.data('videomp4') : '';
          obj.pre = element.data('videopreload') || '';
          if (element.attr('id') === undefined) element.attr(`audio-layer-${Math.round(Math.random() * 199999)}`);
          obj.id = element.attr('id');
          obj.status = 'prepared';
          obj.start = $.now();
          obj.waittime = element.data('videopreloadwait') * 1000 || 5000;


          if (obj.pre === 'auto' || obj.pre === 'canplaythrough' || obj.pre === 'canplay' || obj.pre === 'progress') {
            if (opt.audioqueue === undefined) opt.audioqueue = [];
            opt.audioqueue.push(obj);
            _R.manageVideoLayer(element, opt);
          }
        }
      });
    },

    preLoadAudioDone: function preLoadAudioDone(nc, opt, event) {
      if (opt.audioqueue && opt.audioqueue.length > 0) {
        $.each(opt.audioqueue, (i, obj) => {
          if (nc.data('videomp4') === obj.src && (obj.pre === event || obj.pre === 'auto')) {
            obj.status = 'loaded';
          }
        });
      }
    },

    resetVideo: function resetVideo(_nc, opt) {
      switch (_nc.data('videotype')) {
        case 'youtube': {
          try {
            if (_nc.data('forcerewind') === 'on' && !_ISM) {
              let s = getStartSec(_nc.data('videostartat'));
              s = s === -1 ? 0 : s;
              if (_nc.data('player') !== undefined) {
                _nc.data('player').seekTo(s);
                _nc.data('player').pauseVideo();
              }
            }
          } catch (e) { console.log(e); }
          if (_nc.find('.tp-videoposter').length === 0) { TweenLite.to(_nc.find('iframe'), 0.3, { autoAlpha: 1, display: 'block', ease: Power3.easeInOut }); }
          break;
        }

        case 'vimeo': {
          const f = $f(_nc.find('iframe').attr('id'));
          try {
            if (_nc.data('forcerewind') === 'on' && !_ISM) {
              let s = getStartSec(_nc.data('videostartat'));
              s = s === -1 ? 0 : s;
              f.api('seekTo', s);
              f.api('pause');
            }
          } catch (e) { console.log(e); }
          if (_nc.find('.tp-videoposter').length === 0) { TweenLite.to(_nc.find('iframe'), 0.3, { autoAlpha: 1, display: 'block', ease: Power3.easeInOut }); }
          break;
        }

        case 'html5': {
          if (_ISM && _nc.data('disablevideoonmobile') === 1) return false;

          const tag = _nc.data('audio') === 'html5' ? 'audio' : 'video';
          const jvideo = _nc.find(tag);
          const video = jvideo[0];


          TweenLite.to(jvideo, 0.3, { autoAlpha: 1, display: 'block', ease: Power3.easeInOut });

          if (_nc.data('forcerewind') === 'on' && !_nc.hasClass('videoisplaying')) {
            try {
              const s = getStartSec(_nc.data('videostartat'));
              video.currentTime = s === -1 ? 0 : s;
            } catch (e) { console.log(e); }
          }

          if (_nc.data('volume') === 'mute' || _R.lastToggleState(_nc.data('videomutetoggledby')) || opt.globalmute === true) { video.muted = true; }
          break;
        }
        default:
      }
      return false;
    },


    isVideoMuted: function isVideoMuted(_nc) {
      let muted = false;
      switch (_nc.data('videotype')) {
        case 'youtube': {
          try {
            const player = _nc.data('player');
            muted = player.isMuted();
          } catch (e) { console.log(e); }
          break;
        }
        case 'vimeo': {
          try {
            if (_nc.data('volume') === 'mute') { muted = true; }
          } catch (e) { console.log(e); }
          break;
        }
        case 'html5': {
          const tag = _nc.data('audio') === 'html5' ? 'audio' : 'video';
          const jvideo = _nc.find(tag);
          const video = jvideo[0];

          if (video.muted) { muted = true; }
          break;
        }
        default:
      }
      return muted;
    },

    muteVideo: function muteVideo(_nc) {
      switch (_nc.data('videotype')) {
        case 'youtube': {
          try {
            const player = _nc.data('player');

            player.mute();
          } catch (e) { console.log(e); }
          break;
        }
        case 'vimeo': {
          try {
            const f = $f(_nc.find('iframe').attr('id'));
            _nc.data('volume', 'mute');
            f.api('setVolume', 0);
          } catch (e) { console.log(e); }
          break;
        }
        case 'html5': {
          const tag = _nc.data('audio') === 'html5' ? 'audio' : 'video';
          const jvideo = _nc.find(tag);
          const video = jvideo[0];
          video.muted = true;
          break;
        }
        default:
      }
    },

    unMuteVideo: function unMuteVideo(_nc, opt) {
      if (opt.globalmute === true) return;
      switch (_nc.data('videotype')) {
        case 'youtube': {
          try {
            const player = _nc.data('player');
            player.unMute();
          } catch (e) { console.log(e); }
          break;
        }
        case 'vimeo': {
          try {
            const f = $f(_nc.find('iframe').attr('id'));
            _nc.data('volume', '1');
            f.api('setVolume', 1);
          } catch (e) { console.log(e); }
          break;
        }
        case 'html5': {
          const tag = _nc.data('audio') === 'html5' ? 'audio' : 'video';
          const jvideo = _nc.find(tag);
          const video = jvideo[0];
          video.muted = false;
          break;
        }
        default:
      }
    },


    stopVideo: function stopVideo(_nc) {
      switch (_nc.data('videotype')) {
        case 'youtube': {
          try {
            const player = _nc.data('player');
            player.pauseVideo();
          } catch (e) { console.log(e); }
          break;
        }
        case 'vimeo': {
          try {
            const f = $f(_nc.find('iframe').attr('id'));
            f.api('pause');
          } catch (e) { console.log(e); }
          break;
        }
        case 'html5': {
          const tag = _nc.data('audio') === 'html5' ? 'audio' : 'video';
          const jvideo = _nc.find(tag);
          const video = jvideo[0];
          if (jvideo !== undefined && video !== undefined) video.pause();
          break;
        }
        default:
      }
    },

    playVideo: function playVideo(_nc, opt) {
      clearTimeout(_nc.data('videoplaywait'));
      switch (_nc.data('videotype')) {
        case 'youtube': {
          if (_nc.find('iframe').length === 0) {
            _nc.append(_nc.data('videomarkup'));
            addVideoListener(_nc, opt, true);
          } else if (_nc.data('player').playVideo !== undefined) {
            const s = getStartSec(_nc.data('videostartat'));
            let ct = _nc.data('player').getCurrentTime();
            if (_nc.data('nextslideatend-triggered') === 1) {
              ct = -1;
              _nc.data('nextslideatend-triggered', 0);
            }
            if (s !== -1 && s > ct) _nc.data('player').seekTo(s);
            _nc.data('player').playVideo();
          } else {
            _nc.data('videoplaywait', setTimeout(() => {
              _R.playVideo(_nc, opt);
            }, 50));
          }
          break;
        }
        case 'vimeo': {
          if (_nc.find('iframe').length === 0) {
            _nc.append(_nc.data('videomarkup'));
            addVideoListener(_nc, opt, true);
          } else if (_nc.hasClass('rs-apiready')) {
            const id = _nc.find('iframe').attr('id');
            const f = $f(id);
            if (f.api('play') === undefined) {
              _nc.data('videoplaywait', setTimeout(() => {
                _R.playVideo(_nc, opt);
              }, 50));
            } else {
              setTimeout(() => {
                f.api('play');
                const s = getStartSec(_nc.data('videostartat'));
                let ct = _nc.data('currenttime');
                if (_nc.data('nextslideatend-triggered') === 1) {
                  ct = -1;
                  _nc.data('nextslideatend-triggered', 0);
                }
                if (s !== -1 && s > ct) f.api('seekTo', s);
              }, 510);
            }
          } else {
            _nc.data('videoplaywait', setTimeout(() => {
              _R.playVideo(_nc, opt);
            }, 50));
          }
          break;
        }
        case 'html5': {
          if (_ISM && _nc.data('disablevideoonmobile') === 1) return false;
          const tag = _nc.data('audio') === 'html5' ? 'audio' : 'video';
          const jvideo = _nc.find(tag);
          const video = jvideo[0];
          const html5vid = jvideo.parent();

          if (html5vid.data('metaloaded') !== 1) {
            addEvent(video, 'loadedmetadata', (function (_ncc) {
              _R.resetVideo(_ncc, opt);
              video.play();
              const s = getStartSec(_ncc.data('videostartat'));
              let ct = video.currentTime;
              if (_ncc.data('nextslideatend-triggered') === 1) {
                ct = -1;
                _ncc.data('nextslideatend-triggered', 0);
              }
              if (s !== -1 && s > ct) video.currentTime = s;
            }(_nc)));
          } else {
            video.play();
            const s = getStartSec(_nc.data('videostartat'));
            let ct = video.currentTime;
            if (_nc.data('nextslideatend-triggered') === 1) {
              ct = -1;
              _nc.data('nextslideatend-triggered', 0);
            }
            if (s !== -1 && s > ct) video.currentTime = s;
          }
          break;
        }
        default:
          return false;
      }
      return false;
    },

    isVideoPlaying: function isVideoPlaying(_nc, opt) {
      let ret = false;
      if (opt.playingvideos !== undefined) {
        $.each(opt.playingvideos, (i, nc) => {
          if (_nc.attr('id') === nc.attr('id')) { ret = true; }
        });
      }
      return ret;
    },

    removeMediaFromList: function removeMediaFromList(_nc, opt) {
      remVidfromList(_nc, opt);
    },

    prepareCoveredVideo: function prepareCoveredVideo(asprat, opt, nextcaption) {
      const ifr = nextcaption.find('iframe, video');
      const wa = asprat.split(':')[0];
      const ha = asprat.split(':')[1];
      const li = nextcaption.closest('.tp-revslider-slidesli');
      const od = li.width() / li.height();
      const vd = wa / ha;
      const nvh = (od / vd) * 100;
      const nvw = (vd / od) * 100;

      if (od > vd) {
        TweenLite.to(ifr, 0.001, { height: `${nvh}%`, width: '100%', top: `${-(nvh - 100) / 2}%`, left: '0px', position: 'absolute' });
      } else {
        TweenLite.to(ifr, 0.001, { width: `${nvw}%`, height: '100%', left: `${-(nvw - 100) / 2}%`, top: '0px', position: 'absolute' });
      }

      if (!ifr.hasClass('resizelistener')) {
        ifr.addClass('resizelistener');
        $(window).resize(() => {
          clearTimeout(ifr.data('resizelistener'));
          ifr.data('resizelistener', setTimeout(() => {
            _R.prepareCoveredVideo(asprat, opt, nextcaption);
          }, 30));
        });
      }
    },

    checkVideoApis: function checkVideoApis(_nc, opt, addedApis) {
      const httpprefix = location.protocol === 'https:' ? 'https' : 'http';

      if ((_nc.data('ytid') !== undefined || _nc.find('iframe').length > 0 && _nc.find('iframe').attr('src').toLowerCase().indexOf('youtube') > 0)) opt.youtubeapineeded = true;
      if ((_nc.data('ytid') !== undefined || _nc.find('iframe').length > 0 && _nc.find('iframe').attr('src').toLowerCase().indexOf('youtube') > 0) && addedApis.addedyt === 0) {
        opt.youtubestarttime = $.now();
        addedApis.addedyt = 1;
        const s = document.createElement('script');
        s.src = 'https://www.youtube.com/iframe_api'; /* Load Player API*/
        const before = document.getElementsByTagName('script')[0];
        let loadit = true;
        $('head').find('*').each((i, el) => {
          if ($(el).attr('src') === 'https://www.youtube.com/iframe_api') { loadit = false; }
        });
        if (loadit) before.parentNode.insertBefore(s, before);
      }


      if ((_nc.data('vimeoid') !== undefined || _nc.find('iframe').length > 0 && _nc.find('iframe').attr('src').toLowerCase().indexOf('vimeo') > 0)) opt.vimeoapineeded = true;
      if ((_nc.data('vimeoid') !== undefined || _nc.find('iframe').length > 0 && _nc.find('iframe').attr('src').toLowerCase().indexOf('vimeo') > 0) && addedApis.addedvim === 0) {
        opt.vimeostarttime = $.now();
        addedApis.addedvim = 1;
        const f = document.createElement('script');
        const before = document.getElementsByTagName('script')[0];
        let loadit = true;
        f.src = `${httpprefix}://f.vimeocdn.com/js/froogaloop2.min.js`; /* Load Player API*/

        $('head').find('*').each((i, el) => {
          if ($(el).attr('src') === `${httpprefix}://f.vimeocdn.com/js/froogaloop2.min.js`) { loadit = false; }
        });
        if (loadit) { before.parentNode.insertBefore(f, before); }
      }
      return addedApis;
    },

    manageVideoLayer: function manageVideoLayer(_nc, opt) {
      // YOUTUBE AND VIMEO LISTENRES INITIALISATION
      let vida = _nc.data('videoattributes');
      const vidytid = _nc.data('ytid');
      const vimeoid = _nc.data('vimeoid');
      const videopreload = _nc.data('videopreload') === 'auto' || _nc.data('videopreload') === 'canplay' || _nc.data('videopreload') === 'canplaythrough' || _nc.data('videopreload') === 'progress' ? 'auto' : _nc.data('videopreload');
      const videomp = _nc.data('videomp4');
      const videowebm = _nc.data('videowebm');
      const videoogv = _nc.data('videoogv');
      const videoafs = _nc.data('allowfullscreenvideo');
      let videocontrols = _nc.data('videocontrols');
      let httpprefix = 'http';
      const videoloop = _nc.data('videoloop') === 'loop' ? 'loop' : _nc.data('videoloop') === 'loopandnoslidestop' ? 'loop' : '';
      const videotype = (videomp !== undefined || videowebm !== undefined) ? 'html5' :
        (vidytid !== undefined && String(vidytid).length > 1) ? 'youtube' :
          (vimeoid !== undefined && String(vimeoid).length > 1) ? 'vimeo' : 'none';
      const tag = _nc.data('audio') === 'html5' ? 'audio' : 'video';
      const newvideotype = (videotype === 'html5' && _nc.find(tag).length === 0) ? 'html5' :
        (videotype === 'youtube' && _nc.find('iframe').length === 0) ? 'youtube' :
          (videotype === 'vimeo' && _nc.find('iframe').length === 0) ? 'vimeo' : 'none';

      _nc.data('videotype', videotype);
      // ADD HTML5 VIDEO IF NEEDED
      switch (newvideotype) {
        case 'html5': {
          if (videocontrols !== 'controls') videocontrols = '';
          let tage = 'video';

          // _nc.data('audio',"html5");
          if (_nc.data('audio') === 'html5') {
            tage = 'audio';
            _nc.addClass('tp-audio-html5');
          }

          let apptxt = `<${tage} style="object-fit:cover;background-size:cover;visible:hidden;width:100%; height:100%" class="" ${videoloop} preload="${videopreload}">`;

          if (videopreload === 'auto') opt.mediapreload = true;
          if (videowebm !== undefined && _R.get_browser().toLowerCase() === 'firefox') apptxt = `${apptxt}<source src="${videowebm}" type="video/webm" />`;
          if (videomp !== undefined) apptxt = `${apptxt}<source src="${videomp}" type="video/mp4" />`;
          if (videoogv !== undefined) apptxt = `${apptxt}<source src="${videoogv}" type="video/ogg" />`;
          apptxt = `${apptxt}</${tage}>`;
          let hfm = '';
          if (videoafs === 'true' || videoafs === true) { hfm = '<div class="tp-video-button-wrap"><button  type="button" class="tp-video-button tp-vid-full-screen">Full-Screen</button></div>'; }

          if (videocontrols === 'controls') {
            apptxt = `${apptxt}${'<div class="tp-video-controls">' +
              '<div class="tp-video-button-wrap"><button type="button" class="tp-video-button tp-vid-play-pause">Play</button></div>' +
              '<div class="tp-video-seek-bar-wrap"><input  type="range" class="tp-seek-bar" value="0"></div>' +
              '<div class="tp-video-button-wrap"><button  type="button" class="tp-video-button tp-vid-mute">Mute</button></div>' +
              '<div class="tp-video-vol-bar-wrap"><input  type="range" class="tp-volume-bar" min="0" max="1" step="0.1" value="1"></div>'}${
              hfm
              }</div>`;
          }

          _nc.data('videomarkup', apptxt);
          _nc.append(apptxt);

          // START OF HTML5 VIDEOS
          if ((_ISM && _nc.data('disablevideoonmobile') === 1) || _R.isIE(8)) _nc.find(tag).remove();

          // ADD HTML5 VIDEO CONTAINER
          _nc.find(tag).each((i, el) => {
            const video = el;
            const jvideo = $(el);

            if (!jvideo.parent().hasClass('html5vid')) { jvideo.wrap('<div class="html5vid" style="position:relative;top:0px;left:0px;width:100%;height:100%; overflow:hidden;"></div>'); }

            const html5vid = jvideo.parent();
            if (html5vid.data('metaloaded') !== 1) {
              addEvent(video, 'loadedmetadata', (function (_ncc) {
                htmlvideoevents(_ncc, opt);
                _R.resetVideo(_ncc, opt);
              }(_nc)));
            }
          });
          break;
        }
        case 'youtube': {
          httpprefix = 'http';
          if (location.protocol === 'https:') { httpprefix = 'https'; }
          if (videocontrols === 'none') {
            vida = vida.replace('controls=1', 'controls=0');
            if (vida.toLowerCase().indexOf('controls') === -1) { vida = `${vida}&controls=0`; }
          }

          const s = getStartSec(_nc.data('videostartat'));
          const e = getStartSec(_nc.data('videoendat'));

          if (s !== -1) vida = `${vida}&start=${s}`;
          if (e !== -1) vida = `${vida}&end=${e}`;

          // CHECK VIDEO ORIGIN, AND EXTEND WITH WWW IN CASE IT IS MISSING !
          const orig = vida.split(`origin=${httpprefix}://`);
          let vidaNew = '';

          if (orig.length > 1) {
            vidaNew = `${orig[0]}origin=${httpprefix}://`;
            if (self.location.href.match(/www/gi) && !orig[1].match(/www/gi)) { vidaNew = `${vidaNew}www.`; }
            vidaNew = vidaNew + orig[1];
          } else {
            vidaNew = vida;
          }

          const yafv = videoafs === 'true' || videoafs === true ? 'allowfullscreen' : '';
          _nc.data('videomarkup', `<iframe style="visible:hidden" src="${httpprefix}://www.youtube.com/embed/${vidytid}?${vidaNew}" ${yafv} width="100%" height="100%" style="width:100%;height:100%"></iframe>`);
          break;
        }

        case 'vimeo': {
          if (location.protocol === 'https:') { httpprefix = 'https'; }
          _nc.data('videomarkup', `<iframe style="visible:hidden" src="${httpprefix}://player.vimeo.com/video/${vimeoid}?autoplay=0&${vida}" webkitallowfullscreen mozallowfullscreen allowfullscreen width="100%" height="100%" style="100%;height:100%"></iframe>`);

          break;
        }
        default:
      }

      // if (videotype=="vimeo" || videotype=="youtube") {

      // IF VIDEOPOSTER EXISTING
      const noposteronmobile = _ISM && _nc.data('noposteronmobile') === 'on';

      if (_nc.data('videoposter') !== undefined && _nc.data('videoposter').length > 2 && !noposteronmobile) {
        if (_nc.find('.tp-videoposter').length === 0) { _nc.append(`<div class="tp-videoposter noSwipe" style="cursor:pointer; position:absolute;top:0px;left:0px;width:100%;height:100%;z-index:3;background-image:url(${_nc.data('videoposter')}); background-size:cover;background-position:center center;"></div>`); }
        if (_nc.find('iframe').length === 0) {
          _nc.find('.tp-videoposter').click(() => {
            _R.playVideo(_nc, opt);
            if (_ISM) {
              if (_nc.data('disablevideoonmobile') === 1) return false;
              TweenLite.to(_nc.find('.tp-videoposter'), 0.3, { autoAlpha: 0, force3D: 'auto', ease: Power3.easeInOut });
              TweenLite.to(_nc.find('iframe'), 0.3, { autoAlpha: 1, display: 'block', ease: Power3.easeInOut });
            }
            return true;
          });
        }
      } else {
        if (_ISM && _nc.data('disablevideoonmobile') === 1) return false;
        if (_nc.find('iframe').length === 0 && (videotype === 'youtube' || videotype === 'vimeo')) {
          _nc.append(_nc.data('videomarkup'));
          addVideoListener(_nc, opt, false);
        }
      }

      // ADD DOTTED OVERLAY IF NEEDED
      if (_nc.data('dottedoverlay') !== 'none' && _nc.data('dottedoverlay') !== undefined && _nc.find('.tp-dottedoverlay').length !== 1) { _nc.append(`<div class="tp-dottedoverlay ${_nc.data('dottedoverlay')}"></div>`); }

      _nc.addClass('HasListener');

      if (_nc.data('bgvideo') === 1) {
        TweenLite.set(_nc.find('video, iframe'), { autoAlpha: 0 });
      }
      return true;
    },
  });
};

