import { Sprite } from "./classes";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants";



export class Background extends Sprite {

    constructor() {
        super(0, 0);
    }


    update(delta: number): void {
    }

    render(g: CanvasRenderingContext2D): void {


        
        g.fillStyle = "white";
        g.fillRect(this.x, this.y, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
}
