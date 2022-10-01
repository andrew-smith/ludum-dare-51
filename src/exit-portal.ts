import { GLOBAL_GAME } from "./app";
import { Sprite } from "./classes";

export class ExitPortal extends Sprite {


    /** true if the portal allows exiting */
    isActive = false;

    constructor(x: number, y: number) {
        super(x,y, {width:35, height:45});

    }

    update(delta: number): void {

        // don't do anything if it's not active
        if(!this.isActive) {
            return;
        }

        const p = GLOBAL_GAME.player;

        // if player is at the portal and it is active, then game has been won!

        if(Math.abs(p.x - this.x) < this.width/2 && Math.abs(p.y - this.y) < this.height/2) {
            console.log("Exit Portal Entered!")
            GLOBAL_GAME.playerWonLevel();
        }
    }

    render(g: CanvasRenderingContext2D): void {


        g.fillStyle = 'grey';

        if(this.isActive) {
            g.fillStyle = 'purple';
        }

        g.translate(this.x, this.y);

        g.fillRect(-this.width/2, -this.height/2, this.width, this.height);


    }

}
