import { Sprite } from "../classes";
import { GLOBAL_GAME } from "../app";
import { Player } from "../player";
import { CANVAS_WIDTH } from "../constants";

const MAX_HEALTH_WIDTH = CANVAS_WIDTH/3;
const HEALTH_HEIGHT = 45;

export class HealthBar extends Sprite {


    constructor() {
        super(CANVAS_WIDTH/2, 0, {width: MAX_HEALTH_WIDTH, height: HEALTH_HEIGHT});
    }

    render(g: CanvasRenderingContext2D): void {
        
        const player = GLOBAL_GAME.player;
        const percentage = Math.max(Math.abs(player.ttl / Player.PLAYER_STARTING_TTL), 1);

        // outline of health bar
        g.save();
            g.translate(this.renderXPos(), this.renderXPos());
            g.fillStyle = 'black';

            g.beginPath();
                g.rect(0,0, MAX_HEALTH_WIDTH, HEALTH_HEIGHT);
            g.stroke();
            

        g.restore();
    }


}
