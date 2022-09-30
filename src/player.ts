import { Key } from "ts-keycode-enum";
import { Sprite } from "./classes";
import { GAME_HEIGHT, GAME_WIDTH } from "./game";
import { isKeyPressed } from "./utils/keyevents";


export class Player extends Sprite {

    constructor() {
        super(GAME_WIDTH/2, GAME_HEIGHT/2);
    }


    update(delta: number): void {

        const movementSpeed = 0.35 * delta;

        if(isKeyPressed(Key.UpArrow)) {
            this.y -= movementSpeed;
        }

        if(isKeyPressed(Key.DownArrow)) {
            this.y += movementSpeed;
        }

        if(isKeyPressed(Key.LeftArrow)) {
            this.x -= movementSpeed;
        }
        if(isKeyPressed(Key.RightArrow)) {
            this.x += movementSpeed;
        }

    }

    render(g: CanvasRenderingContext2D): void {
        
        g.fillStyle = "purple";
        g.fillRect(this.x, this.y, 10, 10);
    }
}
