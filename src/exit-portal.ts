import { GLOBAL_GAME } from "./app";
import { Sprite } from "./classes";

export class ExitPortal extends Sprite {


    /** true if the portal allows exiting */
    isActive = false;

    /** delta is added to this */
    timeElapsed = 0;

    constructor(x: number, y: number) {
        super(x,y, {width:35, height:45});

    }

    update(delta: number): void {

        this.timeElapsed += delta;

        // don't do anything if it's not active
        if(!this.isActive) {
            return;
        }

        const p = GLOBAL_GAME.player;

        // if player is at the portal and it is active, then game has been won!
        if(this.isPointInSprite(p)) {
            console.log("Exit Portal Entered!")
            GLOBAL_GAME.playerWonLevel();
        }
    }

    render(g: CanvasRenderingContext2D): void {

        g.translate(this.x, this.y);

        g.fillStyle = 'grey';

        if(this.isActive) {
            g.fillStyle = 'purple';
            g.rotate(this.timeElapsed / 300);
            g.scale(Math.sin(this.timeElapsed / 300), 1);
        }



        g.fillRect(-this.width/2, -this.height/2, this.width, this.height);


    }

}
