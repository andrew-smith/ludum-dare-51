import { loadAudio } from "./audio";
import { Level } from "./classes";
import { Game } from "./game";
import { loadImages } from "./images";
import { Level01 } from "./levels/01/level01";
import { Level02 } from "./levels/02/level02";
import { Level03 } from "./levels/03/level03";
import { Level04 } from "./levels/04/level04";
import { init as initDPad } from './d-pad';
import { Level05 } from "./levels/05/level05";

/**
 * Called on window first load
 */
async function startup() {
    console.log("Window Loaded");

    // loading main assets
    await Promise.all([loadImages(),loadAudio()]);

    await moveToNextLevel();
}

let LEVEL_INDEX = -1;

const LEVELS = [
    Level01, Level02, Level03, Level04, Level05
]

// const LEVELS = [
//     Level05
// ]

// called from game.ts when the next level should be loaded
export async function moveToNextLevel() {
  LEVEL_INDEX++;

  if(LEVEL_INDEX >= LEVELS.length) {
    return alert("No more levels left!");
  }

  await loadLevel(new LEVELS[LEVEL_INDEX]());
}


let lastLoadedGame : Game;

async function loadLevel(level: Level) {

  initDPad();
  
  if(lastLoadedGame) {
    lastLoadedGame.shutdownGame();
  }

  lastLoadedGame = new Game(level);

  await lastLoadedGame.initilize();
  lastLoadedGame.start();
}

window.addEventListener('DOMContentLoaded', startup);

const hot = (module as any)?.hot;
if (hot) {
    hot.dispose(() => {
        window.location.reload();
        throw "hotReload";
    });
}
