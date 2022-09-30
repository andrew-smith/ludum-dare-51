import { Game } from "./game";


/**
 * Called on window first load
 */
async function startup() {
    console.log("Window Loaded");

    const game = new Game({mainCanvasElementId: 'main_canvas'});

    await game.initilize();

    game.start();
}

window.addEventListener('DOMContentLoaded', startup);
