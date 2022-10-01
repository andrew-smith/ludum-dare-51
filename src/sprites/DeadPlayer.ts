import { Sprite, NodeType } from "../classes";
import { GameImage } from "../images";

import Flatten from '@flatten-js/core'
import { SECONDS } from "../constants";
const { Polygon, Point, Line } = Flatten;

export class DeadPlayer extends Sprite {

    static STARTING_TTL = 7 * SECONDS;

    ttl = DeadPlayer.STARTING_TTL;

    constructor(x: number, y: number) {
        super(x,y, {width: GameImage!.man.width, height: GameImage!.man.height});

        this.type = NodeType.DEAD_PLAYER;
    }

    hasExpired(): boolean {
        return this.ttl < 0;
    }

    update(delta: number): void {
        this.ttl -= delta;
    }

    /** Get the current position and bounding box of the player */
    getPlayerBoundingBox() : Flatten.Polygon {

        // TODO This is also in the Player.ts file. Copy this over

        const bbWidth = this.width/4;
        const bbHeight = this.height/4;

        return new Polygon([
            new Point(this.x - bbWidth, this.y - bbHeight),
            new Point(this.x - bbWidth, this.y + bbHeight),
            new Point(this.x + bbWidth, this.y + bbHeight),
            new Point(this.x + bbWidth, this.y - bbHeight),
        ]);
    }

    render(g: CanvasRenderingContext2D): void {

        const img = GameImage!.man;

        // set alpha level based on how much TTL
        const percent = this.ttl / DeadPlayer.STARTING_TTL;


        g.save();

        g.translate(this.x, this.y);

        g.rotate(90 * (Math.PI/180));
        g.globalAlpha = 0.5 * percent;
        g.drawImage(img, -this.width/2, -this.height/2);

        g.restore();
    }

}
