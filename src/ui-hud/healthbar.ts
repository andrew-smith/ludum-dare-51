import { Sprite } from "../classes";
import { GLOBAL_GAME } from "../app";
import { Player } from "../player";
import { CANVAS_WIDTH } from "../constants";

const MAX_HEALTH_WIDTH = CANVAS_WIDTH/2;
const HEALTH_HEIGHT = 12;

export class HealthBar extends Sprite {


    constructor() {
        super(CANVAS_WIDTH/2, HEALTH_HEIGHT/2 + 6, {width: MAX_HEALTH_WIDTH, height: HEALTH_HEIGHT});
    }

    render(g: CanvasRenderingContext2D): void {
        
        const player = GLOBAL_GAME.player;
        const percentage = (Math.abs(player.ttl / Player.PLAYER_STARTING_TTL));

        const healthWidth = MAX_HEALTH_WIDTH * percentage;

        // outline of health bar
        g.save();
        // g.translate(0,0);
            g.translate(this.renderXPos(), this.renderYPos());
            g.fillStyle = 'black';

            g.beginPath();
                g.rect(0,0, MAX_HEALTH_WIDTH, HEALTH_HEIGHT);
            g.stroke();

            g.fillStyle = 'green';
            g.fillRect(0, 0, healthWidth, HEALTH_HEIGHT);


            

        g.restore();
    }


}
