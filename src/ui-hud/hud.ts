import { Sprite } from "../classes";
import { Player } from "../player";
import { HealthBar } from "./healthbar";
import { Game } from "../game";

let DEBUG_HUD = true;

export class HUD extends Sprite {


    constructor() {
        super(0,0);

        this.addNode(new HealthBar());
    }

    player: Player;

    update(delta: number, game: Game): void {
        this.player = game.player;    
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

        g.translate(2, 0);

        const TEXT_HEIGHT = -10;

        let currentY = 0

        g.fillStyle = "white";
        g.font = 'bold 10px Courier New';
        g.fillText("DEBUG INFO", 0, currentY-=TEXT_HEIGHT);
        g.fillText("PLAYER HEALTH=" + (this.player.ttl / Player.PLAYER_STARTING_TTL * 100).toFixed(0) + "%", 0, currentY-=TEXT_HEIGHT);
        g.fillText("PLAYER X=" + this.player.x, 0, currentY-=TEXT_HEIGHT);
        g.fillText("PLAYER Y=" + this.player.y, 0, currentY-=TEXT_HEIGHT);

        g.restore();
    }


}
