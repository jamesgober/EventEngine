const Events = require('../src/events');

describe('Events Module', () => {
    beforeEach(() => {
        document.body.innerHTML = ''; // Reset DOM
    });

    test('should add and trigger an event', () => {
        const div = document.createElement('div');
        document.body.appendChild(div);

        const mockCallback = jest.fn();
        Events.add('click', div, mockCallback);

        const event = new CustomEvent('click');
        div.dispatchEvent(event);

        expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    test('should remove an event listener', () => {
        const div = document.createElement('div');
        document.body.appendChild(div);

        const mockCallback = jest.fn();
        Events.add('click', div, mockCallback);
        Events.remove('click', div, mockCallback);

        const event = new CustomEvent('click');
        div.dispatchEvent(event);

        expect(mockCallback).not.toHaveBeenCalled();
    });
});