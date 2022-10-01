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

        // first we translate to the player 
        const player = GLOBAL_GAME.player;
        // this will also be applied to all the other objects under this node
        g.translate(-player.x, -player.y);

        // then we completely clear the screen
        g.fillStyle = "black";
        g.fillRect(-CANVAS_WIDTH*2, -CANVAS_HEIGHT*2, CANVAS_WIDTH*4, CANVAS_HEIGHT*4);

        const img = GameImage!.level01_map;

        // we then draw the image, which is offset by the canvas width and height, 
        // because that's what the player is also offset by (when rendering on the screen)
        
        g.drawImage(img, CANVAS_WIDTH/2, CANVAS_HEIGHT/2);

    }
}
