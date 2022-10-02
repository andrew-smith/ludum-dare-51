import { Sprite } from "../../classes";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../../constants";
import { Game } from "../../game";


export class SplashScreenNode extends Sprite {

    timeAlive = 0;

    constructor() {
        super(0,0);
    }

    update(delta: number, game: Game): void {
        this.timeAlive += delta;
    }

    render(g: CanvasRenderingContext2D): void {

        // translate to top middle
        g.translate(CANVAS_WIDTH/2, CANVAS_HEIGHT/4)

        g.save();
        

        g.fillStyle = "white";
        g.font = 'bold 40px Courier New';
        g.fillText("Press to Start", -CANVAS_WIDTH/4, 0);

        g.restore();
    }

}
