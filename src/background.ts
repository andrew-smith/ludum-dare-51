import { Level, Sprite } from "./classes";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants";
import { GameImage } from "./images";



export class Background extends Sprite {

    constructor(private level: Level) {
        super(0, 0, {width:level.width, height:level.height});
    }


    update(delta: number): void {
    }

    render(g: CanvasRenderingContext2D): void {


        // then we completely clear the screen
        g.fillStyle = "black";
        g.fillRect(-CANVAS_WIDTH*2, -CANVAS_HEIGHT*2, CANVAS_WIDTH*4, CANVAS_HEIGHT*4);


        if (this.level.backgroundImage) {
            g.drawImage(this.level.backgroundImage, 0, 0);
        }
    }
}
