import { Key } from 'ts-keycode-enum';

import { assert } from './utils/assert';
import { KEY_STATES } from './utils/keyevents';


function wire(el: HTMLElement, keyCode: Key) {
    el.onmousedown = function () {
        KEY_STATES[keyCode] = true;
    }
    el.onmouseup = function () {
        KEY_STATES[keyCode] = false;
    }
}

export function init() {

    const [up, down, left, right] = [1, 2, 3, 4].map(n => {
        const el = document.querySelector(`#touch_controls > div:nth-child(${n})`);
        assert(el, 'd-pad button element not found!');
        assert(el instanceof HTMLElement, 'expected d-pad element to be a div');
        return el;
    });

    wire(up, Key.UpArrow);
    wire(down, Key.DownArrow);
    wire(left, Key.LeftArrow);
    wire(right, Key.RightArrow);
}
