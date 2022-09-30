import { Game } from "./game";

declare global {
    interface Window { GLOBAL_GAME: Game }
}

export let GLOBAL_GAME: Game;


/**
 * Called on window first load
 */
async function startup() {
    console.log("Window Loaded");

    GLOBAL_GAME = new Game({mainCanvasElementId: 'main_canvas'});

    window.GLOBAL_GAME = GLOBAL_GAME; // for debugging the object

    await GLOBAL_GAME.initilize();

    GLOBAL_GAME.start();
}

window.addEventListener('DOMContentLoaded', startup);

const hot = (module as any)?.hot;
if (hot) {
  hot.dispose(() => {
    window.location.reload();
    throw "hotReload";
  });
}
