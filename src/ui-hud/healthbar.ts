import { Sprite } from "../classes";
import { Player } from "../player";
import { CANVAS_WIDTH } from "../constants";
import { Game } from "../game";

const MAX_HEALTH_WIDTH = CANVAS_WIDTH/2;
const HEALTH_HEIGHT = 12;

export class HealthBar extends Sprite {


    constructor() {
        super(CANVAS_WIDTH/2, HEALTH_HEIGHT/2 + 6, {width: MAX_HEALTH_WIDTH, height: HEALTH_HEIGHT});
    }

    playerHealthPercentage: number = 1;

    update(delta: number, g: Game): void {
        
        const player = g.player;
        this.playerHealthPercentage = (Math.abs(player.ttl / Player.PLAYER_STARTING_TTL));
    }

    render(g: CanvasRenderingContext2D): void {
        

        const healthWidth = MAX_HEALTH_WIDTH * this.playerHealthPercentage;

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
