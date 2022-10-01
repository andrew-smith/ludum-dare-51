import { GLOBAL_GAME } from "./app";
import { Sprite } from "./classes";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants";
import { GameImage } from "./images";



export class Background extends Sprite {

    constructor() {
        super(0, 0, {width:1000, height:1000});
    }


    update(delta: number): void {
    }

    render(g: CanvasRenderingContext2D): void {


        // then we completely clear the screen
        g.fillStyle = "black";
        g.fillRect(-CANVAS_WIDTH*2, -CANVAS_HEIGHT*2, CANVAS_WIDTH*4, CANVAS_HEIGHT*4);

        const img = GameImage!.level01_map;
        
        g.drawImage(img, 0,0);

    }
}
