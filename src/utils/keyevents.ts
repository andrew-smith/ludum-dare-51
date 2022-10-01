
import { Key } from 'ts-keycode-enum';

export const KEY_STATES = {}

const KEYS_TO_PREVENT_DEFAULT = [
    Key.UpArrow,
    Key.DownArrow,
    Key.LeftArrow,
    Key.RightArrow,
    Key.Space
]


window.addEventListener('keyup', (e) => {
    KEY_STATES[e.keyCode] = false;

    if(KEYS_TO_PREVENT_DEFAULT.includes(e.keyCode)) {
        e.preventDefault();
    }
});


window.addEventListener('keydown', (e) => {
    KEY_STATES[e.keyCode] = true;    
    if(KEYS_TO_PREVENT_DEFAULT.includes(e.keyCode)) {
        e.preventDefault();
    }
});


export function isKeyPressed(key: Key) {
    return KEY_STATES[key] == true;
}

export function isTouchDevice() {
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
}
