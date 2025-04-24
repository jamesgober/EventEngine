// EventUtils.test.js
const EventUtils = require('../src/EventUtils');

global.CustomEvent = global.CustomEvent || function CustomEvent(type, params) {
    params = params || { bubbles: false, cancelable: false, detail: null };
    const evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(type, params.bubbles, params.cancelable, params.detail);
    return evt;
  };

describe('EventUtils', () => {
  describe('throttle()', () => {
    it('should throttle function calls', (done) => {
      let count = 0;
      const throttled = EventUtils.throttle(() => count++, 100);

      throttled();
      throttled();
      throttled();

      setTimeout(() => {
        expect(count).toBe(1);
        done();
      }, 150);
    });
  });

  describe('debounce()', () => {
    it('should debounce function calls', (done) => {
      let count = 0;
      const debounced = EventUtils.debounce(() => count++, 100);

      debounced();
      debounced();
      debounced();

      setTimeout(() => {
        expect(count).toBe(1);
        done();
      }, 150);
    });
  });

  describe('doEvent()', () => {
    it('should safely execute a callback', () => {
      const spy = jest.fn();
      EventUtils.doEvent({}, spy);
      expect(spy).toHaveBeenCalled();
    });

    it('should catch errors thrown in callback', () => {
      expect(() =>
        EventUtils.doEvent({}, () => {
          throw new Error('Test');
        })
      ).not.toThrow();
    });
  });

  describe('createEvent()', () => {
    it('should return a CustomEvent with correct detail', () => {
      const event = EventUtils.createEvent('custom', { foo: 'bar' });
      expect(event).toBeInstanceOf(CustomEvent);
      expect(event.type).toBe('custom');
      expect(event.detail).toEqual({ foo: 'bar' });
    });
  });

  describe('triggerEvent()', () => {
    test('should dispatch a CustomEvent on the target', () => {
        document.body.innerHTML = '<div id="target"></div>';
        const target = document.getElementById('target');
      
        const listener = jest.fn();
        target.addEventListener('customEvent', listener);
      
        EventUtils.triggerEvent(target, 'customEvent', { key: 'value' });
      
        expect(listener).toHaveBeenCalledTimes(1);
    });
  });
});