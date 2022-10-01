import { loadAudio } from "./audio";
import { Game } from "./game";
import { loadImages } from "./images";
import { Level01 } from "./levels/01/level01";

declare global {
    interface Window { GLOBAL_GAME: Game }
}

export let GLOBAL_GAME: Game;


/**
 * Called on window first load
 */
async function startup() {
    console.log("Window Loaded");

    // loading main assets
    await Promise.all([loadImages(),loadAudio()]);

    GLOBAL_GAME = new Game(new Level01());

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
