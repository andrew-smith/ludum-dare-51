import { Sprite } from "../classes";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../game";
import { GLOBAL_GAME } from "../app";
import { Player } from "../player";

let DEBUG_HUD = true;

export class HUD extends Sprite {


    constructor() {
        super(0,0);
    }

    render(g: CanvasRenderingContext2D): void {
        


        this.debugRender(g);
    }


    debugRender(g: CanvasRenderingContext2D): void {
        
        if(!DEBUG_HUD) {
            return;
        }

        const player = GLOBAL_GAME.player;

        g.translate(2, 0);

        const TEXT_HEIGHT = -10;

        let currentY = 0

        g.fillStyle = "black";
        g.font = 'bold 10px Courier New';
        g.fillText("DEBUG INFO", 0, currentY-=TEXT_HEIGHT);
        g.fillText("PLAYER HEALTH=" + (player.ttl / Player.PLAYER_STARTING_TTL * 100).toFixed(0) + "%", 0, currentY-=TEXT_HEIGHT);

    }


}
