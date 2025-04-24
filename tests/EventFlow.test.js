// tests/EventFlow.test.js
const EventFlow = require('../src/EventFlow'); // ← Must use require

describe('EventFlow', () => {
  let events;

  beforeEach(() => {
    events = new EventFlow({ debug: false });
  });

  test('should register and emit a basic event', () => {
    const callback = jest.fn();
    events.on('test', callback);
    events.emit('test', 'payload');
    expect(callback).toHaveBeenCalledWith('payload');
  });

  test('should remove a registered listener', () => {
    const callback = jest.fn();
    events.on('removeTest', callback);
    events.off('removeTest', callback);
    events.emit('removeTest');
    expect(callback).not.toHaveBeenCalled();
  });

  test('should call listener only once if once: true', () => {
    const callback = jest.fn();
    events.on('onceTest', callback, { once: true });
    events.emit('onceTest');
    events.emit('onceTest');
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('should throttle event calls', (done) => {
    const callback = jest.fn();
    events.on('throttleTest', callback, { throttle: 100 });

    events.emit('throttleTest');
    events.emit('throttleTest');

    setTimeout(() => {
      events.emit('throttleTest');
      expect(callback).toHaveBeenCalledTimes(2);
      done();
    }, 150);
  });

  test('should debounce event calls', (done) => {
    const callback = jest.fn();
    events.on('debounceTest', callback, { debounce: 100 });

    events.emit('debounceTest');
    setTimeout(() => {
      events.emit('debounceTest');
    }, 50);
    setTimeout(() => {
      expect(callback).toHaveBeenCalledTimes(1);
      done();
    }, 200);
  });

  test('should notify observers', () => {
    const observer = jest.fn();
    events.observe('observeTest', observer);
    events.emit('observeTest', 'data');
    expect(observer).toHaveBeenCalledWith('data');
  });

  test('should unobserve an observer', () => {
    const observer = jest.fn();
    events.observe('killTest', observer);
    events.unobserve('killTest', observer);
    events.emit('killTest');
    expect(observer).not.toHaveBeenCalled();
  });
});
