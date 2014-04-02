/*jslint browser: true, white: true */
/*global game */

// 
game.input = (function () {
    'use strict';

    function Mouse() {
        var that = {
            mouseDown: [],
            mouseUp: [],
            mouseMove: [],
            handlersDown: [],
            handlersUp: [],
            handlersMove: []
        };

        function mouseDown(e) {
            that.mouseDown.push(e);
        }

        function mouseUp(e) {
            that.mouseUp.push(e);
        }

        function mouseMove(e) {
            that.mouseMove.push(e);
        }

        that.update = function (elapsedTime) {
            var event,
                handler;

            // Process the mouse events for each of the different kinds of handlers
            for (event = 0; event < that.mouseDown.length; event++) {
                for (handler = 0; handler < that.handlersDown.length; handler++) {
                    that.handlersDown[handler](that.mouseDown[event], elapsedTime);
                }
            }

            for (event = 0; event < that.mouseUp.length; event++) {
                for (handler = 0; handler < that.handlersUp.length; handler++) {
                    that.handlersUp[handler](that.mouseUp[event], elapsedTime);
                }
            }

            for (event = 0; event < that.mouseMove.length; event++) {
                for (handler = 0; handler < that.handlersMove.length; handler++) {
                    that.handlersMove[handler](that.mouseMove[event], elapsedTime);
                }
            }

            // Now that we have processed all the inputs, reset everything back to the empty state
            that.mouseDown.length = 0;
            that.mouseUp.length = 0;
            that.mouseMove.length = 0;
        };

        that.registerCommand = function (type, handler) {
            if (type === 'mousedown') {
                that.handlersDown.push(handler);
            }
            else if (type === 'mouseup') {
                that.handlersUp.push(handler);
            }
            else if (type === 'mousemove') {
                that.handlersMove.push(handler);
            }
        };

        window.addEventListener('mousedown', mouseDown.bind(that));
        window.addEventListener('mouseup', mouseUp.bind(that));
        window.addEventListener('mousemove', mouseMove.bind(that));

        return that;
    }

    function Keyboard() {
        var that = {
            keys: {},
            handlers: []
        },
			key,
            l = 0;

        function keyPress(e) {
            that.keys[e.keyCode] = e.timeStamp;
        }

        function keyRelease(e) {
            delete that.keys[e.keyCode];
        }

        // Allows the client code to register a keyboard handler
        that.registerCommand = function (key, handler) {
            that.handlers.push({ key: key, handler: handler });
        };

        that.unregisterCommand = function (key) {
            that.handlers[key].handler = null;
        };

        // Allows the client to invoke all the handlers for the registered key/handlers.
        that.update = function (elapsedTime) {
            for (key = 0, l = that.handlers.length; key < l; key++) {
                if (typeof that.keys[that.handlers[key].key] !== 'undefined') {
                    that.handlers[key].handler(elapsedTime);
                }
            }
        };

        that.clearQueue = function () {
            this.keys = {};
        };

        that.clearHandlers = function () {
            this.handlers.length = 0;
        };

        // These are used to keep track of which keys are currently pressed
        window.addEventListener('keydown', keyPress.bind(that));
        window.addEventListener('keyup', keyRelease.bind(that));

        return that;
    }

    return {
        Keyboard: Keyboard,
        Mouse: Mouse
    };
}());

// Source: http://stackoverflow.com/questions/1465374/javascript-event-keycode-constants
if (typeof KeyEvent === 'undefined') {
    var KeyEvent = {
        DOM_VK_CANCEL: 3,
        DOM_VK_HELP: 6,
        DOM_VK_BACK_SPACE: 8,
        DOM_VK_TAB: 9,
        DOM_VK_CLEAR: 12,
        DOM_VK_RETURN: 13,
        DOM_VK_ENTER: 14,
        DOM_VK_SHIFT: 16,
        DOM_VK_CONTROL: 17,
        DOM_VK_ALT: 18,
        DOM_VK_PAUSE: 19,
        DOM_VK_CAPS_LOCK: 20,
        DOM_VK_ESCAPE: 27,
        DOM_VK_SPACE: 32,
        DOM_VK_PAGE_UP: 33,
        DOM_VK_PAGE_DOWN: 34,
        DOM_VK_END: 35,
        DOM_VK_HOME: 36,
        DOM_VK_LEFT: 37,
        DOM_VK_UP: 38,
        DOM_VK_RIGHT: 39,
        DOM_VK_DOWN: 40,
        DOM_VK_PRINTSCREEN: 44,
        DOM_VK_INSERT: 45,
        DOM_VK_DELETE: 46,
        DOM_VK_0: 48,
        DOM_VK_1: 49,
        DOM_VK_2: 50,
        DOM_VK_3: 51,
        DOM_VK_4: 52,
        DOM_VK_5: 53,
        DOM_VK_6: 54,
        DOM_VK_7: 55,
        DOM_VK_8: 56,
        DOM_VK_9: 57,
        DOM_VK_SEMICOLON: 59,
        DOM_VK_EQUALS: 61,
        DOM_VK_A: 65,
        DOM_VK_B: 66,
        DOM_VK_C: 67,
        DOM_VK_D: 68,
        DOM_VK_E: 69,
        DOM_VK_F: 70,
        DOM_VK_G: 71,
        DOM_VK_H: 72,
        DOM_VK_I: 73,
        DOM_VK_J: 74,
        DOM_VK_K: 75,
        DOM_VK_L: 76,
        DOM_VK_M: 77,
        DOM_VK_N: 78,
        DOM_VK_O: 79,
        DOM_VK_P: 80,
        DOM_VK_Q: 81,
        DOM_VK_R: 82,
        DOM_VK_S: 83,
        DOM_VK_T: 84,
        DOM_VK_U: 85,
        DOM_VK_V: 86,
        DOM_VK_W: 87,
        DOM_VK_X: 88,
        DOM_VK_Y: 89,
        DOM_VK_Z: 90,
        DOM_VK_WINDOWS: 91,
        DOM_VK_CONTEXT_MENU: 93,
        DOM_VK_NUMPAD0: 96,
        DOM_VK_NUMPAD1: 97,
        DOM_VK_NUMPAD2: 98,
        DOM_VK_NUMPAD3: 99,
        DOM_VK_NUMPAD4: 100,
        DOM_VK_NUMPAD5: 101,
        DOM_VK_NUMPAD6: 102,
        DOM_VK_NUMPAD7: 103,
        DOM_VK_NUMPAD8: 104,
        DOM_VK_NUMPAD9: 105,
        DOM_VK_MULTIPLY: 106,
        DOM_VK_ADD: 107,
        DOM_VK_SEPARATOR: 108,
        DOM_VK_SUBTRACT: 109,
        DOM_VK_DECIMAL: 110,
        DOM_VK_DIVIDE: 111,
        DOM_VK_F1: 112,
        DOM_VK_F2: 113,
        DOM_VK_F3: 114,
        DOM_VK_F4: 115,
        DOM_VK_F5: 116,
        DOM_VK_F6: 117,
        DOM_VK_F7: 118,
        DOM_VK_F8: 119,
        DOM_VK_F9: 120,
        DOM_VK_F10: 121,
        DOM_VK_F11: 122,
        DOM_VK_F12: 123,
        DOM_VK_F13: 124,
        DOM_VK_F14: 125,
        DOM_VK_F15: 126,
        DOM_VK_F16: 127,
        DOM_VK_F17: 128,
        DOM_VK_F18: 129,
        DOM_VK_F19: 130,
        DOM_VK_F20: 131,
        DOM_VK_F21: 132,
        DOM_VK_F22: 133,
        DOM_VK_F23: 134,
        DOM_VK_F24: 135,
        DOM_VK_NUM_LOCK: 144,
        DOM_VK_SCROLL_LOCK: 145,
        DOM_VK_COMMA: 188,
        DOM_VK_MINUS: 189,
        DOM_VK_PERIOD: 190,
        DOM_VK_SLASH: 191,
        DOM_VK_BACK_QUOTE: 192,
        DOM_VK_OPEN_BRACKET: 219,
        DOM_VK_BACK_SLASH: 220,
        DOM_VK_CLOSE_BRACKET: 221,
        DOM_VK_QUOTE: 222,
        DOM_VK_META: 224
    };
}
if (typeof KeyCodes === 'undefined') {
    var KeyCodes = {
        3: 'Cancel',
        6: 'Help',
        8: 'Backspace',
        9: 'Tab',
        12: 'Clear',
        13: 'Return',
        14: 'Enter',
        16: 'Shift',
        17: 'Ctrl',
        18: 'Alt',
        19: 'Pause',
        20: 'Caps Lock',
        27: 'Escape',
        32: 'Space',
        33: 'Page Up',
        34: 'Page Down',
        35: 'End',
        36: 'Home',
        37: 'Left Arrow',
        38: 'Up Arrow',
        39: 'Right Arrow',
        40: 'Down Arrow',
        44: 'Print Screen',
        45: 'Insert',
        46: 'Delete',
        48: '0',
        49: '1',
        50: '2',
        51: '3',
        52: '4',
        53: '5',
        54: '6',
        55: '7',
        56: '8',
        57: '9',
        59: ';',
        61: '=',
        65: 'A',
        66: 'B',
        67: 'C',
        68: 'D',
        69: 'E',
        70: 'F',
        71: 'G',
        72: 'H',
        73: 'I',
        74: 'J',
        75: 'K',
        76: 'L',
        77: 'M',
        78: 'N',
        79: 'O',
        80: 'P',
        81: 'Q',
        82: 'R',
        83: 'S',
        84: 'T',
        85: 'U',
        86: 'V',
        87: 'W',
        88: 'X',
        89: 'Y',
        90: 'Z',
        91: 'Windows',
        93: 'Menu',
        96: 'Num 0',
        97: 'Num 1',
        98: 'Num 2',
        99: 'Num 3',
        100: 'Num 4',
        101: 'Num 5',
        102: 'Num 6',
        103: 'Num 7',
        104: 'Num 8',
        105: 'Num 9',
        106: 'Num *',
        107: 'Num +',
        108: 'Separator',
        109: 'Num -',
        110: 'Num .',
        111: 'Num /',
        112: 'F1',
        113: 'F2',
        114: 'F3',
        115: 'F4',
        116: 'F5',
        117: 'F6',
        118: 'F7',
        119: 'F8',
        120: 'F9',
        121: 'F10',
        122: 'F11',
        123: 'F12',
        124: 'F13',
        125: 'F14',
        126: 'F15',
        127: 'F16',
        128: 'F17',
        129: 'F18',
        130: 'F19',
        131: 'F20',
        132: 'F21',
        133: 'F22',
        134: 'F23',
        135: 'F24',
        144: 'Num Lock',
        145: 'Scroll Lock',
        188: ',',
        189: '-',
        190: '.',
        191: '/',
        192: '`',
        219: '[',
        220: '\\',
        221: ']',
        222: '\'',
        224: 'Meta'
    };
}