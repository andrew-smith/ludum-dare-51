
import { Key } from 'ts-keycode-enum';
import { assert } from './assert';
import { clamp } from './math';

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


export function isUserTouchingDPad() : boolean {
    return userIsTouching;
}

export function getDPadMovement() : {x: number, y: number} {
    return {...currentMovement};
}

// CANVAS / MOBILE key events
const MOBILE_CANVAS = document.getElementById('touch_controls_v2');
assert(MOBILE_CANVAS);

let userIsTouching = false;

const currentMovement : {x: number, y: number} = {x:0, y:0};

const DPAD_SQUARE_SIZE = 400; // make sure this is the same as in the class for touch_controls_v2

function calculateUserMovement(event: TouchEvent) {
    const offsetHeight = MOBILE_CANVAS!.offsetTop;
    const offsetLeft = MOBILE_CANVAS!.offsetLeft;

    console.log(event)

    if(event.targetTouches.length === 0) {
        // no touch events
        return;
    }

    const touchPoint = event.targetTouches[0];

    currentMovement.x = (touchPoint.pageX - offsetLeft - DPAD_SQUARE_SIZE/2) / (DPAD_SQUARE_SIZE/2);
    currentMovement.y = (touchPoint.pageY - offsetHeight - DPAD_SQUARE_SIZE/2) / (DPAD_SQUARE_SIZE/2);

    // now cap those to proper values
    currentMovement.x = clamp(currentMovement.x, -1, 1);
    currentMovement.y = clamp(currentMovement.y, -1, 1);
    console.log(currentMovement);
}

MOBILE_CANVAS.addEventListener('touchstart', (event) => {
    console.log("touchstart");
    userIsTouching = true;
    calculateUserMovement(event);
});

MOBILE_CANVAS.addEventListener('touchend', (event) => {
    console.log("touchend");
    userIsTouching = false;
});

MOBILE_CANVAS.addEventListener('touchcancel',  (event) => {
    console.log("touchcancel");
    userIsTouching = false;
});
MOBILE_CANVAS.addEventListener('touchmove',  (event) => {
    console.log("touchmove");
    userIsTouching = true;

    calculateUserMovement(event);
});
