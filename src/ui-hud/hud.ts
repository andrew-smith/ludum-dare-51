import { Sprite } from "../classes";
import { GLOBAL_GAME } from "../app";
import { Player } from "../player";
import { HealthBar } from "./healthbar";

let DEBUG_HUD = true;

export class HUD extends Sprite {


    constructor() {
        super(0,0);

        this.addNode(new HealthBar());
    }

    render(g: CanvasRenderingContext2D): void {
        
        g.save();


        this.debugRender(g);

        g.restore();
    }


    debugRender(g: CanvasRenderingContext2D): void {
        
        if(!DEBUG_HUD) {
            return;
        }

        g.save();

        const player = GLOBAL_GAME.player;

        g.translate(2, 0);

        const TEXT_HEIGHT = -10;

        let currentY = 0

        g.fillStyle = "white";
        g.font = 'bold 10px Courier New';
        g.fillText("DEBUG INFO", 0, currentY-=TEXT_HEIGHT);
        g.fillText("PLAYER HEALTH=" + (player.ttl / Player.PLAYER_STARTING_TTL * 100).toFixed(0) + "%", 0, currentY-=TEXT_HEIGHT);
        g.fillText("PLAYER X=" + player.x, 0, currentY-=TEXT_HEIGHT);
        g.fillText("PLAYER Y=" + player.y, 0, currentY-=TEXT_HEIGHT);
        g.fillText("BOUNDS_VALUE=" + GLOBAL_GAME.isClearSpace(player.x, player.y), 0, currentY-=TEXT_HEIGHT);

        g.restore();
    }


}
