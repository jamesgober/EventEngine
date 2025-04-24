/* ¸_____¸_____¸  
 #  ╲__¸ ┊ ¸__╱   
 # ¸_  ┊ ┊ ┊ ___  James Gober
 # ┊ [_┊ ┊ ┊_] ┊  Contact@JamesGober.com
 # ┊_____A_____┊  https://JamesGober.com
 # JAMES ⬡ GOBER   
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄ */
/**
 * @file         EventFlow.js 
 * @description  Event management system.
 * @version      1.0.0
 * @license      MIT
 * @see          https://github.com/jamesgober/event-flow/
 * @author       James Gober <contact@jamesgober.com> 
 * @copyright    2025 James Gober. 
*//* 
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄ */
/** 
 * @module      EventFlow
 * @class       EventFlow
 * @version     1.0.0
 * @see         https://github.com/jamesgober/event-flow/ 
 * @classdesc   A high-performance, centralized event management system for modern JavaScript apps.
 *              EventFlow replaces scattered DOM bindings and gives you clean, modular control
 *              over throttled, debounced, or one-time events — with namespace and observer support.
 * 
 * @example
 * // Import the EventFlow module
 * const EventFlow = require('EventFlow.js');
 * const events = new EventFlow({ debug: true }); 
*/  
class EventFlow {
    constructor(options = {}) {
      this.listeners = new Map(); // Map of eventName => Set of listener objects
      this.observers = new Map(); // Map of eventName => Set of observer functions
      this.debug = options.debug || false;
    }
  
    /**
     * Registers an event listener.
     * @method on
     * @memberof EventFlow
     * @description Registers an event listener.
     * @param {string} eventName - The name of the event.
     * @param {Function} callback - The callback function.
     * @param {Object} [options] - Optional settings: { throttle, debounce, once, namespace }.
     * 
     * @example
     * events.on('click', () => console.log('Clicked!'));
     * events.on('click', () => console.log('Clicked!'), { throttle: 200 });
     * events.on('click', () => console.log('Clicked!'), { debounce: 300 });
     * events.on('click', () => console.log('Clicked!'), { once: true });
     * events.on('click', () => console.log('Clicked!'), { namespace: 'ui' });
     * events.on('click', () => console.log('Clicked again!'), { namespace: 'ui' });
    */
    on(eventName, callback, options = {}) {
      const listener = {
        callback: this._applyModifiers(callback, options),
        original: callback,
        once: options.once || false,
        namespace: options.namespace || null
      };
  
      if (!this.listeners.has(eventName)) {
        this.listeners.set(eventName, new Set());
      }
  
      this.listeners.get(eventName).add(listener);
  
      if (this.debug) {
        console.log(`[EventFlow] Listener added for "${eventName}"`);
      }
    }
  
    /**
     * Removes an event listener.
     * @method off
     * @memberof EventFlow
     * @description Removes an event listener.
     * @param {string} eventName - The name of the event.
     * @param {Function} callback - The original callback function.
     * 
     * @example
     * events.off('click', () => console.log('Clicked!'));
     * events.off('click', () => console.log('Clicked again!'));
     * events.off('click', () => console.log('Clicked!'), { namespace: 'ui' });
     * events.off('click', () => console.log('Clicked again!'), { namespace: 'ui' });
     * events.off('click', () => console.log('Clicked!'), { once: true });
     * events.off('click', () => console.log('Clicked!'), { throttle: 200 });
     * events.off('click', () => console.log('Clicked!'), { debounce: 300 });
     */
    off(eventName, callback) {
      const listeners = this.listeners.get(eventName);
      if (listeners) {
        for (let listener of listeners) {
          if (listener.original === callback) {
            listeners.delete(listener);
            if (this.debug) {
              console.log(`[EventFlow] Listener removed for "${eventName}"`);
            }
            break;
          }
        }
        if (listeners.size === 0) {
          this.listeners.delete(eventName);
        }
      }
    }
  
    /**
     * Emits an event to all registered listeners.
     * @method emit
     * @memberof EventFlow
     * @description Emits an event to all registered listeners.
     * @param {string} eventName - The name of the event.
     * @param {...any} args - Arguments to pass to the listeners.
     * 
     * @example
     * events.emit('click', 'payload');
     * events.emit('click', 'payload1', 'payload2');
     * events.emit('click', 'payload1', 'payload2', 'payload3');
     * events.emit('click', 'payload1', 'payload2', 'payload3', 'payload4');
     * // and etc.
     */
    emit(eventName, ...args) {
      if (this.debug) {
        console.log(`[EventFlow] Emitting "${eventName}" with:`, args);
      }
  
      const listeners = this.listeners.get(eventName);
      if (listeners) {
        for (let listener of listeners) {
          listener.callback(...args);
          if (listener.once) {
            listeners.delete(listener);
          }
        }
        if (listeners.size === 0) {
          this.listeners.delete(eventName);
        }
      }
  
      const observers = this.observers.get(eventName);
      if (observers) {
        for (let observer of observers) {
          observer(...args);
        }
      }
    }
  
    /**
     * Registers an observer for an event.
     * Observers are notified every time the event is emitted.
     * @method observe
     * @memberof EventFlow
     * @description Registers an observer for an event.
     * @param {string} eventName - The name of the event.
     * @param {Function} observer - The observer function.
     * 
     * @example
     * events.observe('click', () => console.log('Clicked!'));
     * events.observe('click', () => console.log('Clicked again!'));
     * events.observe('click', () => console.log('Clicked!'), { namespace: 'ui' });
     * events.observe('click', () => console.log('Clicked again!'), { namespace: 'ui' });
     * events.observe('click', () => console.log('Clicked!'), { once: true });
     * events.observe('click', () => console.log('Clicked!'), { throttle: 200 });
     * events.observe('click', () => console.log('Clicked!'), { debounce: 300 });
     */
    observe(eventName, observer) {
      if (!this.observers.has(eventName)) {
        this.observers.set(eventName, new Set());
      }
      this.observers.get(eventName).add(observer);
  
      if (this.debug) {
        console.log(`[EventFlow] Observer added for "${eventName}"`);
      }
    }
  
    /**
     * Removes an observer for an event.
     * @method unobserve
     * @memberof EventFlow
     * @description Removes an observer for an event.
     * @param {string} eventName - The name of the event.
     * @param {Function} observer - The observer function to remove.
     * 
     * @example
     * events.unobserve('click', () => console.log('Clicked!'));
     * events.unobserve('click', () => console.log('Clicked again!'));
     * events.unobserve('click', () => console.log('Clicked!'), { namespace: 'ui' });
     * events.unobserve('click', () => console.log('Clicked again!'), { namespace: 'ui' });
     * events.unobserve('click', () => console.log('Clicked!'), { once: true });
     * events.unobserve('click', () => console.log('Clicked!'), { throttle: 200 });
     * events.unobserve('click', () => console.log('Clicked!'), { debounce: 300 });
     */
    unobserve(eventName, observer) {
      const observers = this.observers.get(eventName);
      if (observers) {
        observers.delete(observer);
        if (observers.size === 0) {
          this.observers.delete(eventName);
        }
  
        if (this.debug) {
          console.log(`[EventFlow] Observer removed for "${eventName}"`);
        }
      }
    }
  
    /**
     * Applies modifiers like throttle and debounce to a callback function.
     * @method _applyModifiers
     * @memberof EventFlow
     * @description Applies modifiers to a callback function.
     * @param {Function} callback - The original callback function.
     * @param {Object} options - Modifier options.
     * @returns {Function} - The modified callback function.
     * 
     * @example
     * const throttledCallback = this._applyModifiers(() => console.log('Throttled!'), { throttle: 200 });
     * const debouncedCallback = this._applyModifiers(() => console.log('Debounced!'), { debounce: 300 });
     * const modifiedCallback = this._applyModifiers(() => console.log('Modified!'), { throttle: 200, debounce: 300 });
     */
    _applyModifiers(callback, options) {
      let modifiedCallback = callback;
  
      if (options.throttle) {
        modifiedCallback = this._throttle(modifiedCallback, options.throttle);
      }
  
      if (options.debounce) {
        modifiedCallback = this._debounce(modifiedCallback, options.debounce);
      }
  
      return modifiedCallback;
    }
  
    /**
     * Creates a throttled version of a function.
     * @method _throttle
     * @memberof EventFlow
     * @description Creates a throttled version of a function.
     * @param {Function} func - The original function.
     * @param {number} limit - The throttle limit in milliseconds.
     * @returns {Function} - The throttled function.
     * 
     * @example
     * const throttledFunction = this._throttle(() => console.log('Throttled!'), 200);
     * const throttledClick = this._throttle(() => console.log('Throttled Click!'), 200);
     * const throttledResize = this._throttle(() => console.log('Throttled Resize!'), 300);
     * const throttledScroll = this._throttle(() => console.log('Throttled Scroll!'), 500);
     * window.addEventListener('click', throttledClick);
     * window.addEventListener('resize', throttledResize);
     * window.addEventListener('scroll', throttledScroll);
     */
    _throttle(func, limit) {
      let inThrottle;
      return function (...args) {
        if (!inThrottle) {
          func(...args);
          inThrottle = true;
          setTimeout(() => (inThrottle = false), limit);
        }
      };
    }
  
    /**
     * Creates a debounced version of a function.
     * @method _debounce
     * @memberof EventFlow
     * @description Creates a debounced version of a function.
     * @param {Function} func - The original function.
     * @param {number} delay - The debounce delay in milliseconds.
     * @returns {Function} - The debounced function.
     * 
     * @example
     * const debouncedFunction = this._debounce(() => console.log('Debounced!'), 300);
     * const debouncedClick = this._debounce(() => console.log('Debounced Click!'), 300);
     * const debouncedResize = this._debounce(() => console.log('Debounced Resize!'), 300);
     * const debouncedScroll = this._debounce(() => console.log('Debounced Scroll!'), 500);
     * window.addEventListener('click', debouncedClick);
     * window.addEventListener('resize', debouncedResize);
     * window.addEventListener('scroll', debouncedScroll);
     */
    _debounce(func, delay) {
      let debounceTimer;
      return function (...args) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func(...args), delay);
      };
    }
  }
  
  // Export for both browser + Node/CommonJS
  if (typeof module !== 'undefined') {
    module.exports = EventFlow;
  } else {
    window.EventFlow = EventFlow;
  }
  // Optional ES module export if using ES import syntax:
  // export default EventUtils;