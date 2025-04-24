/* ¸_____¸_____¸  
 #  ╲__¸ ┊ ¸__╱   
 # ¸_  ┊ ┊ ┊ ___  James Gober
 # ┊ [_┊ ┊ ┊_] ┊  Contact@JamesGober.com
 # ┊_____A_____┊  https://JamesGober.com
 # JAMES ⬡ GOBER   
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄ */
/**
 * @file         EventUtils.js
 * @description  Utility functions for safe event handling (debounce, throttle, etc.)
 * @version      1.0.0
 * @license      MIT
 * @see          https://github.com/jamesgober/event-flow/
 * @author       James Gober <contact@jamesgober.com> 
 * @copyright    2025 James Gober. 
*/ /* 
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄ */
/** 
 * @module      EventUtils
 * @exports     EventUtils
 * @version     1.0.0
 * @see         https://github.com/jamesgober/event-flow/ 
 * @description This module provides utility functions for event handling in JavaScript. It includes methods for throttling and debouncing functions, as well as a safe way to execute event callbacks.
 * @example
 * const { throttle, debounce, doEvent } = require('./EventUtils'); 
*/
const EventUtils = {
    /**
     * Creates a throttled version of a function.
     * @function throttle
     * @description Creates a throttled version of a function that can only be called at most once in a specified time limit.
     * @memberof module:EventUtils
     * @param {Function} func - The function to throttle.
     * @param {number} limit - Time limit in ms.
     * @returns {Function}
     * 
     * @example
     * // Throttle a function to limit its execution to once every 1000ms
     * const throttledFunction = EventUtils.throttle(() => {
     *  console.log('Throttled function executed');
     * }, 1000);
     * 
     * // Throttle a click event
     * const throttledClick = throttle(() => console.log('Clicked!'), 200);
     * window.addEventListener('click', throttledClick);
     * 
     * // Throttle a resize event
     * const throttledResize = throttle(() => console.log('Resized!'), 300);
     * window.addEventListener('resize', throttledResize);
     * 
     * // Throttle a scroll event
     * const throttledScroll = throttle(() => console.log('Scrolled!'), 500);
     * window.addEventListener('scroll', throttledScroll);
     */
    throttle: function (func, limit) {
      let lastCall = 0;
      return function (...args) {
        const now = Date.now();
        if (now - lastCall >= limit) {
          lastCall = now;
          func.apply(this, args);
        }
      };
    },
  
    /**
     * Creates a debounced version of a function.
     * @function debounce
     * @description Creates a debounced version of a function that delays its execution until after a specified time has elapsed since the last time it was invoked.
     * @memberof module:EventUtils
     * @param {Function} func - The function to debounce.
     * @param {number} delay - Delay in ms.
     * @returns {Function}
     * 
     * @example
     * // Debounce a function to limit its execution to once every 1000ms
     * const debouncedFunction = EventUtils.debounce(() => {
     *  console.log('Debounced function executed');
     * }, 1000);
     * 
     * // Debounce a click event
     * const debouncedResize = debounce(() => console.log('Resized!'), 300);
     * window.addEventListener('resize', debouncedResize);
     * 
     * // Debounce a scroll event
     * const debouncedScroll = debounce(() => console.log('Scrolled!'), 500);
     * window.addEventListener('scroll', debouncedScroll);
     * 
     * // Debounce an input event
     * const debouncedInput = debounce(() => console.log('Input changed!'), 200);
     * document.getElementById('inputField').addEventListener('input', debouncedInput);
     */
    debounce: function (func, delay) {
      let timeoutId;
      return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
      };
    },
  
    /**
     * Safely executes a callback for a DOM event.
     * @function doEvent
     * @description Safely executes a callback for a DOM event, catching any errors that may occur.
     * @memberof module:EventUtils
     * @param {Event} event - DOM event.
     * @param {Function} callback - Callback function.
     * 
     * @example
     * // this function is used to safely execute a callback for a DOM event
     * const safeCallback = (event) => {
     *  console.log('Event triggered:', event);
     * };
     * 
     * // Attach event listener with doEvent
     * window.addEventListener('click', (event) => {
     *  doEvent(event, safeCallback);
     * });
     * 
     * // Example usage of doEvent
     * const safeCallback = (event) => {
     *  console.log('Event triggered:', event);
     * };
     */
    doEvent: function (event, callback) {
      try {
        callback(event);
      } catch (error) {
        console.error('EventUtils.doEvent error:', error);
      }
    },
  
    /**
     * Creates a cross-browser CustomEvent.
     * @function createEvent
     * @description Creates a cross-browser CustomEvent with a specified name and detail.
     * @memberof module:EventUtils
     * @param {string} name - Name of the event.
     * @param {Object} [detail={}] - Data payload.
     * @returns {CustomEvent}
     * 
     * @example
     * // Create a custom event with a name and detail
     * const customEvent = EventUtils.createEvent('customEvent', { detail: { key: 'value' } });
     * 
     * // Custom event example 2
     * const customEvent = createEvent('customEvent', { key: 'value' });
     * 
     * // Custom event example 3
     * const customEvent = createEvent('customEvent', { detail: { key: 'value' } });
     * document.dispatchEvent(customEvent);
     */
    createEvent: function (name, detail = {}) {
        if (typeof window.CustomEvent === 'function') {
          return new window.CustomEvent(name, { bubbles: true, cancelable: true, detail });
        }
      
        // JSDOM fallback for older contexts
        const event = document.createEvent('CustomEvent');
        event.initCustomEvent(name, true, true, detail);
        return event;
    },
  
    /**
     * Dispatches a custom event on a target element.
     * @function triggerEvent
     * @description Dispatches a custom event on a target element, document, or window.
     * @memberof module:EventUtils
     * @param {Element|Document|Window} target - Target to dispatch on.
     * @param {string} eventName - Name of the event.
     * @param {Object} [detail={}] - Data payload.
     * 
     * @example
     * // Dispatch a custom event on the document
     * const customEvent = EventUtils.createEvent('customEvent', { key: 'value' });
     * document.dispatchEvent(customEvent); 
     * 
     * // Dispatch a custom event on a target element
     * const targetElement = document.getElementById('target');
     * EventUtils.triggerEvent(targetElement, 'customEvent', { key: 'value' });
     * 
     * // Dispatch a custom event on the window 
     * const customEvent = EventUtils.createEvent('customEvent', { key: 'value' });
     * window.dispatchEvent(customEvent);
     */
    triggerEvent: function (target, eventName, detail = {}) {
      const evt = this.createEvent(eventName, detail);
      target.dispatchEvent(evt);
    },
  
    /**
     * Executes callback when DOM is fully ready.
     * @function onReady
     * @description Executes a callback when the DOM is ready.
     * @memberof module:EventUtils
     * @param {Function} callback
     * 
     * @example
     * // Execute a callback when the DOM is ready
     * EventUtils.onReady(() => {
     *  console.log('DOM is fully loaded');
     * });
     */
    onReady: function (callback) {
      if (document.readyState !== 'loading') {
        callback();
      } else {
        document.addEventListener('DOMContentLoaded', callback);
      }
    },
  
    /**
     * Executes callback after all resources are loaded.
     * @function onLoad
     * @description Executes a callback after all resources (images, scripts, etc.) are loaded.
     * @memberof module:EventUtils
     * @param {Function} callback
     * 
     * @example
     * // Execute a callback when the DOM is fully loaded
     * EventUtils.onLoad(() => {
     *  console.log('All resources are loaded');
     * });
     */
    onLoad: function (callback) {
      if (document.readyState === 'complete') {
        callback();
      } else {
        window.addEventListener('load', callback);
      }
    },
  };
  
  // Export for both browser + Node/CommonJS
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = EventUtils;
  } else {
    window.EventUtils = EventUtils;
  }
  // Optional ES module export if using ES import syntax:
  // export default EventUtils;