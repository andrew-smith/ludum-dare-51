import { Sprite } from "./classes";
import { GAME_HEIGHT, GAME_WIDTH } from "./game";



export class Background extends Sprite {

    timer = 0;
    thing = true;

    constructor() {
        super(0, 0);
    }


    update(delta: number): void {
        this.timer += delta;

        if(this.timer > 1000) {
            this.thing = !this.thing;
            this.timer = 0;
        }
    }

    render(g: CanvasRenderingContext2D): void {
        
        g.fillStyle = "white";
        // if(this.thing) {
        //     g.fillStyle = 'green';
        // }
        g.fillRect(this.x, this.y, GAME_WIDTH, GAME_HEIGHT);
    }
}
