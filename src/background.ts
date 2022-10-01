import { Sprite } from "./classes";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./game";



export class Background extends Sprite {

    timer = 0;
    thing = true;

    constructor() {
        super(0, 0);
    }


    update(delta: number): void {
        this.timer += delta;
    }

    render(g: CanvasRenderingContext2D): void {
        
        g.fillStyle = "white";
        // if(this.thing) {
        //     g.fillStyle = 'green';
        // }
        g.fillRect(this.x, this.y, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
}
