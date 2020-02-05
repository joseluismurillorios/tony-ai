/*
* @fileOverview TouchSwipe - jQuery Plugin
* @version 1.6.9
*
* @author Matt Bryson http://www.github.com/mattbryson
* @see https://github.com/mattbryson/TouchSwipe-Jquery-Plugin
* @see http://labs.rampinteractive.co.uk/touchSwipe/
* @see http://plugins.jquery.com/project/touchSwipe
*
* Copyright (c) 2010-2015 Matt Bryson
* Dual licensed under the MIT or GPL Version 2 licenses.
*
*/

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
/* eslint-disable prefer-rest-params */
/* eslint-disable no-cond-assign */
/* eslint-disable no-use-before-define */
/* eslint max-len: ["error", 150] */

export default ($) => {
  // Constants
  const VERSION = '1.6.9';

  const LEFT = 'left';
  const RIGHT = 'right';
  const UP = 'up';
  const DOWN = 'down';
  const IN = 'in';
  const OUT = 'out';
  const NONE = 'none';
  const AUTO = 'auto';
  const SWIPE = 'swipe';
  const PINCH = 'pinch';
  const TAP = 'tap';
  const DOUBLE_TAP = 'doubletap';
  const LONG_TAP = 'longtap';
  const HORIZONTAL = 'horizontal';
  const VERTICAL = 'vertical';
  const ALL_FINGERS = 'all';
  const DOUBLE_TAP_THRESHOLD = 10;
  const PHASE_START = 'start';
  const PHASE_MOVE = 'move';
  const PHASE_END = 'end';
  const PHASE_CANCEL = 'cancel';
  const SUPPORTS_TOUCH = 'ontouchstart' in window;
  const SUPPORTS_POINTER_IE10 =
    window.navigator.msPointerEnabled && !window.navigator.pointerEnabled;
  const SUPPORTS_POINTER = window.navigator.pointerEnabled || window.navigator.msPointerEnabled;
  const PLUGIN_NS = 'TouchSwipe';

  const defaults = {
    fingers: 1,
    threshold: 75,
    cancelThreshold: null,
    pinchThreshold: 20,
    maxTimeThreshold: null,
    fingerReleaseThreshold: 250,
    longTapThreshold: 500,
    doubleTapThreshold: 200,
    swipe: null,
    swipeLeft: null,
    swipeRight: null,
    swipeUp: null,
    swipeDown: null,
    swipeStatus: null,
    pinchIn: null,
    pinchOut: null,
    pinchStatus: null,
    click: null, // Deprecated since 1.6.2
    tap: null,
    doubleTap: null,
    longTap: null,
    hold: null,
    triggerOnTouchEnd: true,
    triggerOnTouchLeave: false,
    allowPageScroll: 'auto',
    fallbackToMouseEvents: true,
    excludedElements: 'label, button, input, select, textarea, a, .noSwipe',
    preventDefaultEvents: true,
  };

  const init = function init(options) {
    // Prep and extend the options
    if (options && (options.allowPageScroll === undefined && (options.swipe !== undefined || options.swipeStatus !== undefined))) {
      options.allowPageScroll = NONE;
    }

    // Check for deprecated options
    // Ensure that any old click handlers are assigned to the new tap, unless we have a tap
    if (options.click !== undefined && options.tap === undefined) {
      options.tap = options.click;
    }

    if (!options) {
      options = {};
    }

    // pass empty object so we dont modify the defaults
    options = $.extend({}, $.fn.swipetp.defaults, options);

    // For each element instantiate the plugin
    return this.each(() => {
      const $this = $(this);

      // Check we havent already initialised the plugin
      let plugin = $this.data(PLUGIN_NS);

      if (!plugin) {
        plugin = new TouchSwipe(this, options);
        $this.data(PLUGIN_NS, plugin);
      }
    });
  };

  const TouchSwipe = function TouchSwipe(element, options) {
    const useTouchEvents = (SUPPORTS_TOUCH || SUPPORTS_POINTER || !options.fallbackToMouseEvents);
    const START_EV = useTouchEvents ? (SUPPORTS_POINTER ? (SUPPORTS_POINTER_IE10 ? 'MSPointerDown' : 'pointerdown') : 'touchstart') : 'mousedown';
    const MOVE_EV = useTouchEvents ? (SUPPORTS_POINTER ? (SUPPORTS_POINTER_IE10 ? 'MSPointerMove' : 'pointermove') : 'touchmove') : 'mousemove';
    const END_EV = useTouchEvents ? (SUPPORTS_POINTER ? (SUPPORTS_POINTER_IE10 ? 'MSPointerUp' : 'pointerup') : 'touchend') : 'mouseup';

    const // we manually detect leave on touch devices, so null event here
      LEAVE_EV = useTouchEvents ? null : 'mouseleave';

    const CANCEL_EV = (SUPPORTS_POINTER ? (SUPPORTS_POINTER_IE10 ? 'MSPointerCancel' : 'pointercancel') : 'touchcancel');

    // touch properties
    let distance = 0;

    let direction = null;
    let duration = 0;
    let startTouchesDistance = 0;
    let endTouchesDistance = 0;
    let pinchZoom = 1;
    let pinchDistance = 0;
    let pinchDirection = 0;
    let maximumsMap = null;


    // jQuery wrapped element for this instance
    let $element = $(element);

    // Current phase of th touch cycle
    let phase = 'start';

    // the current number of fingers being used.
    let fingerCount = 0;

    // track mouse points / delta
    let fingerData = null;

    // track times
    let startTime = 0;

    let endTime = 0;
    let previousTouchEndTime = 0;
    let previousTouchFingerCount = 0;
    let doubleTapStartTime = 0;

    // Timeouts
    let singleTapTimeout = null;

    let holdTimeout = null;

    // Add gestures to all swipable areas if supported
    try {
      $element.bind(START_EV, touchStart);
      $element.bind(CANCEL_EV, touchCancel);
    } catch (e) {
      $.error(`events not supported ${START_EV},${CANCEL_EV} on jQuery.swipe`);
    }

    //
    // Public methods
    //

    this.enable = () => {
      $element.bind(START_EV, touchStart);
      $element.bind(CANCEL_EV, touchCancel);
      return $element;
    };

    this.disable = () => {
      removeListeners();
      return $element;
    };

    this.destroy = () => {
      removeListeners();
      $element.data(PLUGIN_NS, null);
      $element = null;
    };

    this.option = (property, value) => {
      if (options[property] !== undefined) {
        if (value === undefined) {
          return options[property];
        }
        options[property] = value;
      } else {
        $.error(`Option ${property} does not exist on jQuery.swipe.options`);
      }

      return null;
    };

    //
    // Private methods
    //

    //
    // EVENTS
    //

    const touchStart = function touchStart(jqEvent) {
      // If we already in a touch event (a finger already in use) then ignore subsequent ones..
      if (getTouchInProgress()) { return null; }

      // Check if this element matches any in the excluded elements selectors,  or its parent is excluded, if so, DON'T swipe
      if ($(jqEvent.target).closest(options.excludedElements, $element).length > 0) { return null; }

      // As we use Jquery bind for events, we need to target the original event object
      // If these events are being programmatically triggered, we don't have an original event object, so use the Jq one.
      const event = jqEvent.originalEvent ? jqEvent.originalEvent : jqEvent;

      let ret;
      const touches = event.touches;
      const evt = touches ? touches[0] : event;

      phase = PHASE_START;

      // If we support touches, get the finger count
      if (touches) {
        // get the total number of fingers touching the screen
        fingerCount = touches.length;
      } else {
        jqEvent.preventDefault(); // call this on jq event so we are cross browser
      }

      // clear vars..
      distance = 0;
      direction = null;
      pinchDirection = null;
      duration = 0;
      startTouchesDistance = 0;
      endTouchesDistance = 0;
      pinchZoom = 1;
      pinchDistance = 0;
      fingerData = createAllFingerData();
      maximumsMap = createMaximumsData();
      cancelMultiFingerRelease();


      // check the number of fingers is what we are looking for, or we are capturing pinches
      if (!touches || (fingerCount === options.fingers || options.fingers === ALL_FINGERS) || hasPinches()) {
        // get the coordinates of the touch
        createFingerData(0, evt);
        startTime = getTimeStamp();

        if (fingerCount === 2) {
          // Keep track of the initial pinch distance, so we can calculate the diff later
          // Store second finger data as start
          createFingerData(1, touches[1]);
          startTouchesDistance = endTouchesDistance = calculateTouchesDistance(fingerData[0].start, fingerData[1].start);
        }

        if (options.swipeStatus || options.pinchStatus) {
          ret = triggerHandler(event, phase);
        }
      } else {
        // A touch with more or less than the fingers we are looking for, so cancel
        ret = false;
      }

      // If we have a return value from the users handler, then return and cancel
      if (ret === false) {
        phase = PHASE_CANCEL;
        triggerHandler(event, phase);
        return ret;
      }
      if (options.hold) {
        holdTimeout = setTimeout($.proxy(() => {
          // Trigger the event
          $element.trigger('hold', [event.target]);
          // Fire the callback
          if (options.hold) {
            ret = options.hold.call($element, event, event.target);
          }
        }, this), options.longTapThreshold);
      }

      setTouchInProgress(true);


      return false;
    };

    const touchMove = function touchMove(jqEvent) {
      // As we use Jquery bind for events, we need to target the original event object
      // If these events are being programmatically triggered, we don't have an original event object, so use the Jq one.
      const event = jqEvent.originalEvent ? jqEvent.originalEvent : jqEvent;

      // If we are ending, cancelling, or within the threshold of 2 fingers being released, don't track anything..
      if (phase === PHASE_END || phase === PHASE_CANCEL || inMultiFingerRelease()) { return; }

      let ret;
      const touches = event.touches;
      const evt = touches ? touches[0] : event;


      // Update the  finger data
      const currentFinger = updateFingerData(evt);
      endTime = getTimeStamp();

      if (touches) {
        fingerCount = touches.length;
      }

      if (options.hold) { clearTimeout(holdTimeout); }

      phase = PHASE_MOVE;

      // If we have 2 fingers get Touches distance as well
      if (fingerCount === 2) {
        // Keep track of the initial pinch distance, so we can calculate the diff later
        // We do this here as well as the start event, in case they start with 1 finger, and the press 2 fingers
        if (startTouchesDistance === 0) {
          // Create second finger if this is the first time...
          createFingerData(1, touches[1]);

          startTouchesDistance = endTouchesDistance = calculateTouchesDistance(fingerData[0].start, fingerData[1].start);
        } else {
          // Else just update the second finger
          updateFingerData(touches[1]);

          endTouchesDistance = calculateTouchesDistance(fingerData[0].end, fingerData[1].end);
          pinchDirection = calculatePinchDirection(fingerData[0].end, fingerData[1].end);
        }


        pinchZoom = calculatePinchZoom(startTouchesDistance, endTouchesDistance);
        pinchDistance = Math.abs(startTouchesDistance - endTouchesDistance);
      }


      if ((fingerCount === options.fingers || options.fingers === ALL_FINGERS) || !touches || hasPinches()) {
        direction = calculateDirection(currentFinger.start, currentFinger.end);

        // Check if we need to prevent default event (page scroll / pinch zoom) or not
        validateDefaultEvent(jqEvent, direction);

        // Distance and duration are all off the main finger
        distance = calculateDistance(currentFinger.start, currentFinger.end);
        duration = calculateDuration();

        // Cache the maximum distance we made in this direction
        setMaxDistance(direction, distance);


        if (options.swipeStatus || options.pinchStatus) {
          ret = triggerHandler(event, phase);
        }


        // If we trigger end events when threshold are met, or trigger events when touch leaves element
        if (!options.triggerOnTouchEnd || options.triggerOnTouchLeave) {
          let inBounds = true;

          // If checking if we leave the element, run the bounds check (we can use touchleave as its not supported on webkit)
          if (options.triggerOnTouchLeave) {
            const bounds = getbounds(this);
            inBounds = isInBounds(currentFinger.end, bounds);
          }

          // Trigger end handles as we swipe if thresholds met or if we have left the element if the user has asked to check these..
          if (!options.triggerOnTouchEnd && inBounds) {
            phase = getNextPhase(PHASE_MOVE);
          } else if (options.triggerOnTouchLeave && !inBounds) {
            phase = getNextPhase(PHASE_END);
          }

          if (phase === PHASE_CANCEL || phase === PHASE_END) {
            triggerHandler(event, phase);
          }
        }
      } else {
        phase = PHASE_CANCEL;
        triggerHandler(event, phase);
      }

      if (ret === false) {
        phase = PHASE_CANCEL;
        triggerHandler(event, phase);
      }
    };

    const touchEnd = function touchEnd(jqEvent) {
      // As we use Jquery bind for events, we need to target the original event object
      // If these events are being programmatically triggered, we don't have an original event object, so use the Jq one.
      const event = jqEvent.originalEvent ? jqEvent.originalEvent : jqEvent;

      const touches = event.touches;

      // If we are still in a touch with another finger return
      // This allows us to wait a fraction and see if the other finger comes up,
      // if it does within the threshold, then we treat it as a multi release, not a single release.
      if (touches) {
        if (touches.length) {
          startMultiFingerRelease();
          return true;
        }
      }

      // If a previous finger has been released, check how long ago, if within the threshold, then assume it was a multifinger release.
      // This is used to allow 2 fingers to release fractionally after each other, whilst maintainig the event as containg 2 fingers, not 1
      if (inMultiFingerRelease()) {
        fingerCount = previousTouchFingerCount;
      }

      // Set end of swipe
      endTime = getTimeStamp();

      // Get duration incase move was never fired
      duration = calculateDuration();

      // If we trigger handlers at end of swipe OR, we trigger during, but they didnt trigger and we are still in the move phase
      if (didSwipeBackToCancel() || !validateSwipeDistance()) {
        phase = PHASE_CANCEL;
        triggerHandler(event, phase);
      } else if (options.triggerOnTouchEnd || (options.triggerOnTouchEnd === false && phase === PHASE_MOVE)) {
        // call this on jq event so we are cross browser
        jqEvent.preventDefault();
        phase = PHASE_END;
        triggerHandler(event, phase);
      } else if (!options.triggerOnTouchEnd && hasTap()) {
        // Trigger the pinch events...
        phase = PHASE_END;
        triggerHandlerForGesture(event, phase, TAP);
      } else if (phase === PHASE_MOVE) {
        phase = PHASE_CANCEL;
        triggerHandler(event, phase);
      }

      setTouchInProgress(false);

      return null;
    };

    const touchCancel = function touchCancel() {
      // reset the variables back to default values
      fingerCount = 0;
      endTime = 0;
      startTime = 0;
      startTouchesDistance = 0;
      endTouchesDistance = 0;
      pinchZoom = 1;

      // If we were in progress of tracking a possible multi touch end, then re set it.
      cancelMultiFingerRelease();

      setTouchInProgress(false);
    };

    const touchLeave = function touchLeave(jqEvent) {
      const event = jqEvent.originalEvent ? jqEvent.originalEvent : jqEvent;

      // If we have the trigger on leave property set....
      if (options.triggerOnTouchLeave) {
        phase = getNextPhase(PHASE_END);
        triggerHandler(event, phase);
      }
    };

    const removeListeners = function removeListeners() {
      $element.unbind(START_EV, touchStart);
      $element.unbind(CANCEL_EV, touchCancel);
      $element.unbind(MOVE_EV, touchMove);
      $element.unbind(END_EV, touchEnd);

      // we only have leave events on desktop, we manually calculate leave on touch as its not supported in webkit
      if (LEAVE_EV) {
        $element.unbind(LEAVE_EV, touchLeave);
      }

      setTouchInProgress(false);
    };

    const getNextPhase = function getNextPhase(currentPhase) {
      let nextPhase = currentPhase;

      // Ensure we have valid swipe (under time and over distance  and check if we are out of bound...)
      const validTime = validateSwipeTime();
      const validDistance = validateSwipeDistance();
      const didCancel = didSwipeBackToCancel();

      // If we have exceeded our time, then cancel
      if (!validTime || didCancel) {
        nextPhase = PHASE_CANCEL;
      } else if (validDistance && currentPhase === PHASE_MOVE && (!options.triggerOnTouchEnd || options.triggerOnTouchLeave)) {
        nextPhase = PHASE_END;
      } else if (!validDistance && currentPhase === PHASE_END && options.triggerOnTouchLeave) {
        nextPhase = PHASE_CANCEL;
      }

      return nextPhase;
    };

    const triggerHandler = function triggerHandler(event, phs) {
      let ret;
      const touches = event.touches;

      // Swipes and pinches are not mutually exclusive - can happend at same time, so need to trigger 2 events potentially
      if ((didSwipe() || hasSwipes()) || (didPinch() || hasPinches())) {
        // SWIPE GESTURES
        if (didSwipe() || hasSwipes()) { // hasSwipes as status needs to fire even if swipe is invalid
          // Trigger the swipe events...
          ret = triggerHandlerForGesture(event, phs, SWIPE);
        }

        // PINCH GESTURES (if the above didn't cancel)
        if ((didPinch() || hasPinches()) && ret !== false) {
          // Trigger the pinch events...
          ret = triggerHandlerForGesture(event, phs, PINCH);
        }
      } else if (didDoubleTap() && ret !== false) {
        // Trigger the tap events...
        ret = triggerHandlerForGesture(event, phs, DOUBLE_TAP);
      } else if (didLongTap() && ret !== false) {
        // Trigger the tap events...
        ret = triggerHandlerForGesture(event, phs, LONG_TAP);
      } else if (didTap() && ret !== false) {
        // Trigger the tap event..
        ret = triggerHandlerForGesture(event, phs, TAP);
      }


      // If we are cancelling the gesture, then manually trigger the reset handler
      if (phs === PHASE_CANCEL) {
        touchCancel(event);
      }

      // If we are ending the gesture, then manually trigger the reset handler IF all fingers are off
      if (phs === PHASE_END) {
        // If we support touch, then check that all fingers are off before we cancel
        if (touches) {
          if (!touches.length) {
            touchCancel(event);
          }
        } else {
          touchCancel(event);
        }
      }

      return ret;
    };

    const triggerHandlerForGesture = function triggerHandlerForGesture(event, phs, gesture) {
      let ret;

      // SWIPES....
      if (gesture === SWIPE) {
        // Trigger status every time..

        // Trigger the event...
        $element.trigger('swipeStatus', [phs, direction || null, distance || 0, duration || 0, fingerCount, fingerData]);

        // Fire the callback
        if (options.swipeStatus) {
          ret = options.swipeStatus.call($element, event, phs, direction || null, distance || 0, duration || 0, fingerCount, fingerData);
          // If the status cancels, then dont run the subsequent event handlers..
          if (ret === false) return false;
        }


        if (phs === PHASE_END && validateSwipe()) {
          // Fire the catch all event
          $element.trigger('swipe', [direction, distance, duration, fingerCount, fingerData]);

          // Fire catch all callback
          if (options.swipe) {
            ret = options.swipetp.call($element, event, direction, distance, duration, fingerCount, fingerData);
            // If the status cancels, then dont run the subsequent event handlers..
            if (ret === false) return false;
          }

          // trigger direction specific event handlers
          switch (direction) {
            case LEFT: {
              // Trigger the event
              $element.trigger('swipeLeft', [direction, distance, duration, fingerCount, fingerData]);

              // Fire the callback
              if (options.swipeLeft) {
                ret = options.swipeLeft.call($element, event, direction, distance, duration, fingerCount, fingerData);
              }
              break;
            }

            case RIGHT: {
              // Trigger the event
              $element.trigger('swipeRight', [direction, distance, duration, fingerCount, fingerData]);

              // Fire the callback
              if (options.swipeRight) {
                ret = options.swipeRight.call($element, event, direction, distance, duration, fingerCount, fingerData);
              }
              break;
            }

            case UP: {
              // Trigger the event
              $element.trigger('swipeUp', [direction, distance, duration, fingerCount, fingerData]);

              // Fire the callback
              if (options.swipeUp) {
                ret = options.swipeUp.call($element, event, direction, distance, duration, fingerCount, fingerData);
              }
              break;
            }

            case DOWN: {
              // Trigger the event
              $element.trigger('swipeDown', [direction, distance, duration, fingerCount, fingerData]);

              // Fire the callback
              if (options.swipeDown) {
                ret = options.swipeDown.call($element, event, direction, distance, duration, fingerCount, fingerData);
              }
              break;
            }
            default:
          }
        }
      }


      // PINCHES....
      if (gesture === PINCH) {
        // Trigger the event
        $element.trigger('pinchStatus', [phs, pinchDirection || null, pinchDistance || 0, duration || 0, fingerCount, pinchZoom, fingerData]);

        // Fire the callback
        if (options.pinchStatus) {
          ret = options.pinchStatus.call(
            $element,
            event,
            phs,
            pinchDirection || null,
            pinchDistance || 0,
            duration || 0,
            fingerCount,
            pinchZoom,
            fingerData,
          );
          // If the status cancels, then dont run the subsequent event handlers..
          if (ret === false) return false;
        }

        if (phs === PHASE_END && validatePinch()) {
          switch (pinchDirection) {
            case IN: {
              // Trigger the event
              $element.trigger('pinchIn', [pinchDirection || null, pinchDistance || 0, duration || 0, fingerCount, pinchZoom, fingerData]);

              // Fire the callback
              if (options.pinchIn) {
                ret = options.pinchIn.call(
                  $element,
                  event,
                  pinchDirection || null,
                  pinchDistance || 0,
                  duration || 0,
                  fingerCount,
                  pinchZoom,
                  fingerData,
                );
              }
              break;
            }

            case OUT: {
              // Trigger the event
              $element.trigger('pinchOut', [pinchDirection || null, pinchDistance || 0, duration || 0, fingerCount, pinchZoom, fingerData]);

              // Fire the callback
              if (options.pinchOut) {
                ret = options.pinchOut.call(
                  $element,
                  event,
                  pinchDirection || null,
                  pinchDistance || 0,
                  duration || 0,
                  fingerCount,
                  pinchZoom,
                  fingerData);
              }
              break;
            }
            default:
          }
        }
      }


      if (gesture === TAP) {
        if (phs === PHASE_CANCEL || phs === PHASE_END) {
          // Cancel any existing double tap
          clearTimeout(singleTapTimeout);
          // Cancel hold timeout
          clearTimeout(holdTimeout);

          // If we are also looking for doubelTaps, wait incase this is one...
          if (hasDoubleTap() && !inDoubleTap()) {
            // Cache the time of this tap
            doubleTapStartTime = getTimeStamp();

            // Now wait for the double tap timeout, and trigger this single tap
            // if its not cancelled by a double tap
            singleTapTimeout = setTimeout($.proxy(() => {
              doubleTapStartTime = null;
              // Trigger the event
              $element.trigger('tap', [event.target]);


              // Fire the callback
              if (options.tap) {
                ret = options.tap.call($element, event, event.target);
              }
            }, this), options.doubleTapThreshold);
          } else {
            doubleTapStartTime = null;

            // Trigger the event
            $element.trigger('tap', [event.target]);


            // Fire the callback
            if (options.tap) {
              ret = options.tap.call($element, event, event.target);
            }
          }
        }
      } else if (gesture === DOUBLE_TAP) {
        if (phs === PHASE_CANCEL || phs === PHASE_END) {
          // Cancel any pending singletap
          clearTimeout(singleTapTimeout);
          doubleTapStartTime = null;

          // Trigger the event
          $element.trigger('doubletap', [event.target]);

          // Fire the callback
          if (options.doubleTap) {
            ret = options.doubleTap.call($element, event, event.target);
          }
        }
      } else if (gesture === LONG_TAP) {
        if (phs === PHASE_CANCEL || phs === PHASE_END) {
          // Cancel any pending singletap (shouldnt be one)
          clearTimeout(singleTapTimeout);
          doubleTapStartTime = null;

          // Trigger the event
          $element.trigger('longtap', [event.target]);

          // Fire the callback
          if (options.longTap) {
            ret = options.longTap.call($element, event, event.target);
          }
        }
      }

      return ret;
    };


    //
    // GESTURE VALIDATION
    //

    const validateSwipeDistance = function validateSwipeDistance() {
      let valid = true;
      // If we made it past the min swipe distance..
      if (options.threshold !== null) {
        valid = distance >= options.threshold;
      }

      return valid;
    };

    const didSwipeBackToCancel = function didSwipeBackToCancel() {
      let cancelled = false;
      if (options.cancelThreshold !== null && direction !== null) {
        cancelled = (getMaxDistance(direction) - distance) >= options.cancelThreshold;
      }

      return cancelled;
    };

    const validatePinchDistance = function validatePinchDistance() {
      if (options.pinchThreshold !== null) {
        return pinchDistance >= options.pinchThreshold;
      }
      return true;
    };

    const validateSwipeTime = function validateSwipeTime() {
      let result;
      // If no time set, then return true

      if (options.maxTimeThreshold) {
        if (duration >= options.maxTimeThreshold) {
          result = false;
        } else {
          result = true;
        }
      } else {
        result = true;
      }

      return result;
    };

    const validateDefaultEvent = function validateDefaultEvent(jqEvent, dir) {
      // If we have no pinches, then do this
      // If we have a pinch, and we we have 2 fingers or more down, then dont allow page scroll.

      // If the option is set, allways allow the event to bubble up (let user handle wiredness)
      if (options.preventDefaultEvents === false) {
        return;
      }

      if (options.allowPageScroll === NONE) {
        jqEvent.preventDefault();
      } else {
        const auto = options.allowPageScroll === AUTO;

        switch (dir) {
          case LEFT: {
            if ((options.swipeLeft && auto) || (!auto && options.allowPageScroll !== HORIZONTAL)) {
              jqEvent.preventDefault();
            }
            break;
          }

          case RIGHT: {
            if ((options.swipeRight && auto) || (!auto && options.allowPageScroll !== HORIZONTAL)) {
              jqEvent.preventDefault();
            }
            break;
          }

          case UP: {
            if ((options.swipeUp && auto) || (!auto && options.allowPageScroll !== VERTICAL)) {
              jqEvent.preventDefault();
            }
            break;
          }

          case DOWN: {
            if ((options.swipeDown && auto) || (!auto && options.allowPageScroll !== VERTICAL)) {
              jqEvent.preventDefault();
            }
            break;
          }
          default:
        }
      }
    };

    // PINCHES

    const validatePinch = function validatePinch() {
      const hasCorrectFingerCount = validateFingers();
      const hasEndPoint = validateEndPoint();
      const hasCorrectDistance = validatePinchDistance();
      return hasCorrectFingerCount && hasEndPoint && hasCorrectDistance;
    };

    const hasPinches = function hasPinches() {
      // Enure we dont return 0 or null for false values
      return !!(options.pinchStatus || options.pinchIn || options.pinchOut);
    };

    const didPinch = function didPinch() {
      // Enure we dont return 0 or null for false values
      return !!(validatePinch() && hasPinches());
    };

    // SWIPES

    const validateSwipe = function validateSwipe() {
      // Check validity of swipe
      const hasValidTime = validateSwipeTime();
      const hasValidDistance = validateSwipeDistance();
      const hasCorrectFingerCount = validateFingers();
      const hasEndPoint = validateEndPoint();
      const didCancel = didSwipeBackToCancel();

      // if the user swiped more than the minimum length, perform the appropriate action
      // hasValidDistance is null when no distance is set
      const valid = !didCancel && hasEndPoint && hasCorrectFingerCount && hasValidDistance && hasValidTime;

      return valid;
    };

    const hasSwipes = function hasSwipes() {
      // Enure we dont return 0 or null for false values
      return !!(options.swipe || options.swipeStatus || options.swipeLeft || options.swipeRight || options.swipeUp || options.swipeDown);
    };

    const didSwipe = function didSwipe() {
      // Enure we dont return 0 or null for false values
      return !!(validateSwipe() && hasSwipes());
    };

    const validateFingers = function validateFingers() {
      // The number of fingers we want were matched, or on desktop we ignore
      return ((fingerCount === options.fingers || options.fingers === ALL_FINGERS) || !SUPPORTS_TOUCH);
    };

    const validateEndPoint = function validateEndPoint() {
      // We have an end value for the finger
      return fingerData[0].end.x !== 0;
    };

    const hasTap = function hasTap() {
      // Enure we dont return 0 or null for false values
      return !!(options.tap);
    };

    const hasDoubleTap = function hasDoubleTap() {
      // Enure we dont return 0 or null for false values
      return !!(options.doubleTap);
    };

    const hasLongTap = function hasLongTap() {
      // Enure we dont return 0 or null for false values
      return !!(options.longTap);
    };

    const validateDoubleTap = function validateDoubleTap() {
      if (doubleTapStartTime === null) {
        return false;
      }
      const now = getTimeStamp();
      return (hasDoubleTap() && ((now - doubleTapStartTime) <= options.doubleTapThreshold));
    };

    const inDoubleTap = function inDoubleTap() {
      return validateDoubleTap();
    };

    const validateTap = function validateTap() {
      return ((fingerCount === 1 || !SUPPORTS_TOUCH) && (isNaN(distance) || distance < options.threshold));
    };

    const validateLongTap = function validateLongTap() {
      // slight threshold on moving finger
      return ((duration > options.longTapThreshold) && (distance < DOUBLE_TAP_THRESHOLD));
    };

    const didTap = function didTap() {
      // Enure we dont return 0 or null for false values
      return !!(validateTap() && hasTap());
    };

    const didDoubleTap = function didDoubleTap() {
      // Enure we dont return 0 or null for false values
      return !!(validateDoubleTap() && hasDoubleTap());
    };

    const didLongTap = function didLongTap() {
      // Enure we dont return 0 or null for false values
      return !!(validateLongTap() && hasLongTap());
    };

    const startMultiFingerRelease = function startMultiFingerRelease() {
      previousTouchEndTime = getTimeStamp();
      previousTouchFingerCount = event.touches.length + 1;
    };

    const cancelMultiFingerRelease = function cancelMultiFingerRelease() {
      previousTouchEndTime = 0;
      previousTouchFingerCount = 0;
    };

    const inMultiFingerRelease = function inMultiFingerRelease() {
      let withinThreshold = false;

      if (previousTouchEndTime) {
        const diff = getTimeStamp() - previousTouchEndTime;
        if (diff <= options.fingerReleaseThreshold) {
          withinThreshold = true;
        }
      }

      return withinThreshold;
    };

    const getTouchInProgress = function getTouchInProgress() {
      // strict equality to ensure only true and false are returned
      return !!($element.data(`${PLUGIN_NS}_intouch`) === true);
    };

    const setTouchInProgress = function setTouchInProgress(val) {
      // Add or remove event listeners depending on touch status
      if (val === true) {
        $element.bind(MOVE_EV, touchMove);
        $element.bind(END_EV, touchEnd);

        // we only have leave events on desktop, we manually calcuate leave on touch as its not supported in webkit
        if (LEAVE_EV) {
          $element.bind(LEAVE_EV, touchLeave);
        }
      } else {
        $element.unbind(MOVE_EV, touchMove, false);
        $element.unbind(END_EV, touchEnd, false);

        // we only have leave events on desktop, we manually calcuate leave on touch as its not supported in webkit
        if (LEAVE_EV) {
          $element.unbind(LEAVE_EV, touchLeave, false);
        }
      }


      // strict equality to ensure only true and false can update the value
      $element.data(`${PLUGIN_NS}_intouch`, val === true);
    };

    const createFingerData = function createFingerData(index, evt) {
      const id = evt.identifier !== undefined ? evt.identifier : 0;

      fingerData[index].identifier = id;
      fingerData[index].start.x = fingerData[index].end.x = evt.pageX || evt.clientX;
      fingerData[index].start.y = fingerData[index].end.y = evt.pageY || evt.clientY;

      return fingerData[index];
    };

    const updateFingerData = function updateFingerData(evt) {
      const id = evt.identifier !== undefined ? evt.identifier : 0;
      const f = getFingerData(id);

      f.end.x = evt.pageX || evt.clientX;
      f.end.y = evt.pageY || evt.clientY;

      return f;
    };

    const getFingerData = function getFingerData(id) {
      for (let i = 0; i < fingerData.length; i += 1) {
        if (fingerData[i].identifier === id) {
          return fingerData[i];
        }
      }
      return null;
    };

    const createAllFingerData = function createAllFingerData() {
      const fingrData = [];
      for (let i = 0; i <= 5; i += 1) {
        fingrData.push({
          start: { x: 0, y: 0 },
          end: { x: 0, y: 0 },
          identifier: 0,
        });
      }

      return fingrData;
    };

    const setMaxDistance = function setMaxDistance(dir, dis) {
      dis = Math.max(dis, getMaxDistance(dir));
      maximumsMap[dir].distance = dis;
    };

    const getMaxDistance = function getMaxDistance(dir) {
      if (maximumsMap[dir]) return maximumsMap[dir].distance;
      return undefined;
    };

    const createMaximumsData = function createMaximumsData() {
      const maxData = {};
      maxData[LEFT] = createMaximumVO(LEFT);
      maxData[RIGHT] = createMaximumVO(RIGHT);
      maxData[UP] = createMaximumVO(UP);
      maxData[DOWN] = createMaximumVO(DOWN);

      return maxData;
    };

    const createMaximumVO = function createMaximumVO(dir) {
      return {
        direction: dir,
        distance: 0,
      };
    };


    //
    // MATHS / UTILS
    //

    const calculateDuration = function calculateDuration() {
      return endTime - startTime;
    };

    const calculateTouchesDistance = function calculateTouchesDistance(startPoint, endPoint) {
      const diffX = Math.abs(startPoint.x - endPoint.x);
      const diffY = Math.abs(startPoint.y - endPoint.y);

      return Math.round(Math.sqrt(diffX * diffX + diffY * diffY));
    };

    const calculatePinchZoom = function calculatePinchZoom(startDistance, endDistance) {
      const percent = (endDistance / startDistance) * 1;
      return percent.toFixed(2);
    };

    const calculatePinchDirection = function calculatePinchDirection() {
      if (pinchZoom < 1) {
        return OUT;
      }
      return IN;
    };

    const calculateDistance = function calculateDistance(startPoint, endPoint) {
      return Math.round(Math.sqrt((Math.pow(endPoint.x - startPoint.x), 2) + Math.pow((endPoint.y - startPoint.y), 2)));
    };

    const calculateAngle = function calculateAngle(startPoint, endPoint) {
      const x = startPoint.x - endPoint.x;
      const y = endPoint.y - startPoint.y;
      const r = Math.atan2(y, x); // radians
      let angle = Math.round(r * 180 / Math.PI); // degrees

      // ensure value is positive
      if (angle < 0) {
        angle = 360 - Math.abs(angle);
      }

      return angle;
    };

    const calculateDirection = function calculateDirection(startPoint, endPoint) {
      const angle = calculateAngle(startPoint, endPoint);

      if ((angle <= 45) && (angle >= 0)) {
        return LEFT;
      } else if ((angle <= 360) && (angle >= 315)) {
        return LEFT;
      } else if ((angle >= 135) && (angle <= 225)) {
        return RIGHT;
      } else if ((angle > 45) && (angle < 135)) {
        return DOWN;
      }
      return UP;
    };

    const getTimeStamp = function getTimeStamp() {
      const now = new Date();
      return now.getTime();
    };

    const getbounds = function getbounds(el) {
      el = $(el);
      const offset = el.offset();

      const bounds = {
        left: offset.left,
        right: offset.left + el.outerWidth(),
        top: offset.top,
        bottom: offset.top + el.outerHeight(),
      };

      return bounds;
    };

    const isInBounds = function isInBounds(point, bounds) {
      return (point.x > bounds.left && point.x < bounds.right && point.y > bounds.top && point.y < bounds.bottom);
    };
  };

  $.fn.extend({

    // METHODE SCROLL
    swipetp: function swipetp(method) {
      const $this = $(this);
      const plugin = $this.data(PLUGIN_NS);

      // Check if we are already instantiated and trying to execute a method
      if (plugin && typeof method === 'string') {
        if (plugin[method]) {
          return plugin[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        $.error(`Method ${method} does not exist on jQuery.swipe`);
      } else if (!plugin && (typeof method === 'object' || !method)) {
        return init.apply(this, arguments);
      }

      return $this;
    },
  });

  const opts = {};

  opts.version = VERSION;

  // Expose our defaults so a user could override the plugin defaults
  opts.defaults = defaults;

  opts.phases = {
    PHASE_START,
    PHASE_MOVE,
    PHASE_END,
    PHASE_CANCEL,
  };

  opts.directions = {
    LEFT,
    RIGHT,
    UP,
    DOWN,
    IN,
    OUT,
  };

  opts.pageScroll = {
    NONE,
    HORIZONTAL,
    VERTICAL,
    AUTO,
  };

  opts.fingers = {
    ONE: 1,
    TWO: 2,
    THREE: 3,
    ALL: ALL_FINGERS,
  };


  const _R = $.fn.swipetp;

  $.extend(true, _R, opts);
};
