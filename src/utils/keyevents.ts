
import { Key } from 'ts-keycode-enum';

export const KEY_STATES = {}


window.addEventListener('keyup', (e) => {
    KEY_STATES[e.keyCode] = false;
    e.preventDefault();
});


window.addEventListener('keydown', (e) => {
    KEY_STATES[e.keyCode] = true;
    e.preventDefault();
});


export function isKeyPressed(key: Key) {
    return KEY_STATES[key] == true;
}

