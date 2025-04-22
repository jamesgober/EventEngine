/**
 * EventUtils - Utility methods for throttling, debouncing, and other event-related operations.
 */
const EventUtils = {
    /**
     * Creates a throttled version of the given function.
     *
     * @param {Function} func - The function to throttle.
     * @param {number} limit - The time limit in milliseconds.
     * @returns {Function} - The throttled function.
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
     * Creates a debounced version of the given function.
     *
     * @param {Function} func - The function to debounce.
     * @param {number} delay - The delay in milliseconds.
     * @returns {Function} - The debounced function.
     */
    debounce: function (func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    },

    /**
     * Executes an event callback with additional safety and debugging.
     *
     * @param {Event} event - The event object.
     * @param {Function} callback - The callback function.
     */
    doEvent: function (event, callback) {
        try {
            callback(event);
        } catch (error) {
            console.error('Error executing event callback:', error);
        }
    },
};
// Export the entire EventUtils object
module.exports = EventUtils;