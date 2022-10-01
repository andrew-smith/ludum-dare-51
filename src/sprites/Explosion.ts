import { Sprite } from "../classes";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../constants";
import { GameImage } from "../images";


export class Explosion extends Sprite {


    static TOTAL_FRAMES = 6;
    static FRAME_TIME_LENGTH = 75; //ms

    static FRAME_SIZE = 42; //px
    static HALF_FRAME_SIZE = Explosion.FRAME_SIZE / 2;

    /** How long the animation will take */
    ttl: number;

    /** How long we have been alive for (makes the index calculation easier) */
    timeAlive = 0;

    scale = 1.5;

    constructor(x: number, y: number) {
        super(x,y);

        console.log(this.x, this.y);

        this.ttl = Explosion.TOTAL_FRAMES * Explosion.FRAME_TIME_LENGTH;
    }

    update(delta: number): void {
        this.ttl -= delta;
        this.timeAlive += delta;
    }

    hasExpired(): boolean {
        return this.ttl <= 0;
    }

    render(g: CanvasRenderingContext2D): void {

        g.save();

        // figure out what image index we should display
        const explosionIdx = Math.min(Math.floor(this.timeAlive / Explosion.FRAME_TIME_LENGTH), Explosion.TOTAL_FRAMES);

        g.translate(this.x, this.y);

        g.drawImage(GameImage!.explosion,
            explosionIdx * Explosion.FRAME_SIZE, 0,
            Explosion.FRAME_SIZE, Explosion.FRAME_SIZE,
            -Explosion.HALF_FRAME_SIZE, -Explosion.HALF_FRAME_SIZE,
            Explosion.FRAME_SIZE, Explosion.FRAME_SIZE);

        g.restore();
    }

}
