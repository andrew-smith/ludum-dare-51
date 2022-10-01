import { Sprite } from "../classes";
import { SECONDS } from "../constants";


export class DisappearingSmokePuff extends Sprite {

    /** How long this smoke puff stays around for */
    static STARTING_TTL = 1.5 * SECONDS;

    imgWidth = 55;
    imgHeight = 55;

    /** How long the animation will take */
    ttl = DisappearingSmokePuff.STARTING_TTL

    update(delta: number): void {
        this.ttl -= delta;
    }

    hasExpired(): boolean {

        return this.ttl <= 0;
    }

    render(g: CanvasRenderingContext2D): void {

        // translate to the middle of this sprite
        g.translate(this.x, this.y);

        // scale
        const scale = 1 - (this.ttl / DisappearingSmokePuff.STARTING_TTL); // will eventually scale up to 1
        // g.setTransform(scale, 0, 0, scale, this.x, this.y);

        // slowly fade out the smoke
        g.globalAlpha = Math.abs(this.ttl / DisappearingSmokePuff.STARTING_TTL);

        // now draw
        g.fillStyle = 'yellow';
        g.fillRect(-this.imgWidth/2, -this.imgHeight/2, this.imgWidth, this.imgHeight);
    }

}
