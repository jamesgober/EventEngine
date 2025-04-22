/*
                      _                          _                          
                     | |                        (_)                         
  _____   _____ _ __ | |_    ___ _ __   __ _ _ _ __   ___ 
 / _ \ \ / / _ \ '_ \| __/  / _ \ '_ \ / _` | | '_ \ / _ \
|  __/\ V /  __/ | | | |_  |  __/ | | | (_| | | | | |  __/
 \___| \_/ \___|_| |_|\__|  \___|_| |_|\__, |_|_| |_|\___|
                                        __/ |  JS LIBRARY
                                       |___/ 
*/

 /*!
 * Event Engine - A High-Performance JavaScript DOM Events Library
 * 
 * Description: A lightweight, extensible JavaScript library for managing DOM events with features like namespacing, throttling, debouncing, observables, debugging tools, and a focus on performance and flexibility.
 * Version:     1.0.0
 * GitHub:      https://github.com/jamesgober/EventEngine/
 * License:     MIT
 * Copyright:   2024 James Gober.
 *
 * Author:      James Gober
 * Email:       me@jamesgober.com
 * Website:     https://jamesgober.com
 * GitHub:      https://github.com/jamesgober
 * npm:         https://www.npmjs.com/~jamesgober
 * 
 * Roles: Developer, Architect, Maintainer, Designer, Project Lead, Author 
 */



const isNode = typeof window === 'undefined';
const context = isNode ? {} : window; // Fallback to an empty object in Node.js

// Mock addEventListener in Node.js environment
if (isNode) {
  context.addEventListener = () => {}; // No-op
}

/**
 * Events Module
 * Provides an API for handling browser events with features like namespacing,
 * throttling, debouncing, passive event support, memory management, event prioritization,
 * debugging, grouping, stateful events, and lightweight reactivity through observables.
 *
 * Debugging, analytics, and stateful features are disabled by default to optimize performance
 * in production environments.
 *
 * @module Events
 */
(function (global, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define([], function () {
            return factory(global);
        });
    } else if (typeof exports === 'object') {
        module.exports = factory(global);
    } else {
        global.Events = factory(global);
    }

}(typeof window !== 'undefined' ? window : global, function (window) {
    'use strict';

    // import { throttle, debounce, doEvent } from './EventUtils';
    const EventUtils = require('./EventUtils'); // Adjust the path as needed

    // Destructure the utilities
    const { throttle, debounce, doEvent } = EventUtils; 

    if (isNode) {
        console.warn('Events library is running in a Node.js environment. DOM operations are disabled.');
    }

    /**
     * Container for all event handling functionalities.
     */
    const Events = {};

    /**
     * Stores all active event listeners.
     * @private
     */
    const liveEvents = new Map();

    /**
     * Stores debugging and analytics data.
     * @private
     */
    const eventStats = new Map();
    let debugEnabled = false;
    let analyticsEnabled = false;

    /**
     * Stores state for stateful events.
     * @private
     */
    const statefulEvents = new Map();

    /**
     * Stores event listener groups for bulk operations.
     * @private
     */
    const groups = new Map();

    // Refactor selector validation
    const isValidSelector = selector =>
        selector instanceof HTMLElement || 
        selector === window || 
        selector === document;

    /**
     * Enables debugging mode for event tracking.
     */
    Events.enableDebug = function () {
        debugEnabled = true;
    };

    /**
     * Enables analytics mode for event tracking.
     */
    Events.enableAnalytics = function () {
        analyticsEnabled = true;
    };

    /**
     * Disables debugging and analytics mode.
     */
    Events.disableDebugAnalytics = function () {
        debugEnabled = false;
        analyticsEnabled = false;
    };

    /**
     * Logs active listeners for debugging purposes.
     */
    Events.debug = function () {
        if (!debugEnabled) {
            console.warn('Debugging is disabled. Enable it using Events.enableDebug().');
            return;
        }
        liveEvents.forEach((listeners, type) => {
            console.log(`Event Type: ${type}`);
            listeners.forEach(listener => {
                console.log(`  Selector: ${listener.selector}`);
                console.log(`  Namespace: ${listener.namespace || 'None'}`);
                console.log(`  Priority: ${listener.priority || 0}`);
            });
        });
    };

    /**
     * Provides analytics data about event triggers.
     *
     * @returns {Object} - An object mapping event types to their trigger counts.
     */
    Events.analytics = function () {
        if (!analyticsEnabled) {
            console.warn('Analytics is disabled. Enable it using Events.enableAnalytics().');
            return {};
        }
        return Object.fromEntries(eventStats.entries());
    };

    /**
     * Adds an event listener with various options.
     * @param {string} types - Event types to listen for (comma-separated).
     * @param {string|Element} selector - Selector or element to bind the event to.
     * @param {Function} callback - Callback function for the event.
     * @param {Object} [options={}] - Additional options like throttle, debounce, passive, and priority.
     * @param {string} [namespace=''] - Optional namespace for the event.
     * @param {boolean} [once=false] - If true, the listener is removed after the first execution.
     * @param {string} [group=''] - Optional group to organize listeners.
     */
    Events.add = function (types, target, callback, options = {}, namespace = '', once = false, group = '') {
        if (!(target instanceof context.HTMLElement || target === context || target === context.document)) {
            throw new Error('Invalid target. Must be an instance of HTMLElement, Window, or Document.');
        }

        types.split(',').forEach(type => {
            type = type.trim();

            const handler = options.throttle
                ? throttle(callback, options.throttle)
                : options.debounce
                ? debounce(callback, options.debounce)
                : callback;

            if (!liveEvents.has(type)) liveEvents.set(type, []);
            liveEvents.get(type).push({ target, callback: handler });

            target.addEventListener(type, handler, { capture: options.capture || false });

            if (group) {
                if (!groups.has(group)) groups.set(group, []);
                groups.get(group).push({ type, target, handler });
            }
        });
    };

    /**
     * Removes an event listener or all listeners for a type/namespace.
     */
    /**
     * Removes an event listener.
     */
    Events.remove = function (types, target, callback) {
        types.split(',').forEach(type => {
            target.removeEventListener(type.trim(), callback);

            if (liveEvents.has(type)) {
                liveEvents.set(
                    type,
                    liveEvents.get(type).filter(e => e.target !== target || e.callback !== callback)
                );
            }
        });
    };

    /**
     * Adds a one-time event listener.
     * @param {string} types - Event types to listen for (comma-separated).
     * @param {string|Element} selector - Selector or element to bind the event to.
     * @param {Function} callback - Callback function for the event.
     * @param {Object} [options={}] - Additional options like throttle, debounce, passive.
     * @param {string} [namespace=''] - Optional namespace for the event.
     * @param {string} [group=''] - Optional group to organize listeners.
     */
    Events.once = function (types, selector, callback, options = {}, namespace = '', group = '') {
        Events.add(types, selector, callback, options, namespace, true, group);
    };

    /**
     * Clears all event listeners for a specific group.
     *
     * @param {string} groupName - The name of the group to clear.
     */
    Events.clearGroup = function (groupName) {
        const group = groups.get(groupName);
        if (!group) return;

        group.forEach(({ type, listener }) => {
            Events.remove(type, listener.selector, listener.originalCallback, listener.namespace);
        });
        groups.delete(groupName);
    };

    /**
     * Programmatically triggers the specified event types.
     *
     * @param {string} types - Comma-separated string of event types to trigger.
     * @param {any} [data] - Optional data to pass to the event handlers.
     */
    Events.trigger = function (types, data) {
        types.split(',').forEach(type => {
            const fakeEvent = { type, target: document };
            eventHandler(fakeEvent, data);
        });
    };

    /**
     * Retrieves the last recorded state of a specified stateful event.
     *
     * @param {string} type - The event type to retrieve the state for.
     * @returns {any|null} - The last state of the event, or null if no state exists.
     */
    Events.getState = function (type) {
        return statefulEvents.get(type) || null;
    };
	
	    /**
     * Creates a reactive observable stream for the specified event types.
     *
     * @param {string} types - Comma-separated string of event types to observe.
     * @param {string|Element} selector - The selector or element to bind the observable to.
     * @returns {Object} - An observable object with `subscribe` and `unsubscribe` methods.
     */
    Events.toObservable = function (types, selector) {
        const subscribers = [];

        const handler = (event) => {
            if (doEvent(event.target, selector)) {
                subscribers.forEach(subscriber => subscriber(event));
            }
        };

        types.split(',').forEach(type => {
            window.addEventListener(type, handler, true);
        });

        return {
            subscribe(callback) {
                subscribers.push(callback);
            },
            unsubscribe(callback) {
                const index = subscribers.indexOf(callback);
                if (index !== -1) subscribers.splice(index, 1);
            }
        };
    };

    /**
     * Handles registered events, applying throttling, debouncing, and priority logic.
     * @private
     * @param {Event} event - The event object from the browser.
     */
    function eventHandler(event) {
        const listeners = liveEvents.get(event.type) || [];
        listeners
            .sort((a, b) => b.priority - a.priority) // Higher priority executes first
            .forEach(listener => {
                if (doEvent(event.target, listener.selector)) {
                    listener.callback(event);
                    if (listener.once) {
                        Events.remove(event.type, listener.selector, listener.originalCallback, listener.namespace);
                    }
                }
            });
    }

    /**
     * Removes all event listeners and clears the module state.
     */
    Events.clearAll = function () {
        liveEvents.forEach((listeners, type) => {
            listeners.forEach(listener => {
                window.removeEventListener(type, listener.callback, listener.options.capture || false);
            });
        });
        liveEvents.clear();
        groups.clear();
        statefulEvents.clear();
        eventStats.clear();
    };

    /**
     * Logs a summary of all currently registered events.
     */
    Events.logSummary = function () {
        console.log('Registered Events:');
        liveEvents.forEach((listeners, type) => {
            console.log(`Type: ${type}, Count: ${listeners.length}`);
        });
    };

    /**
     * Sets a custom debug logger for the module.
     *
     * @param {Function} loggerFunction - Custom function for logging debug information.
     */
    Events.setDebugLogger = function (loggerFunction) {
        if (typeof loggerFunction === 'function') {
            console.debug = loggerFunction;
        }
    };

    return Events;
}));