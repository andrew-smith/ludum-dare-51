import { Sprite, NodeType } from "../classes";
import { GameImage } from "../images";


export class DeadPlayer extends Sprite {

    constructor(x: number, y: number) {
        super(x,y, {width: GameImage!.man.width, height: GameImage!.man.height});

        this.type = NodeType.DEAD_PLAYER;
    }

    update(delta: number): void {
    }

    render(g: CanvasRenderingContext2D): void {

        const img = GameImage!.man;


        g.save();

        g.translate(this.x, this.y);

        g.rotate(90 * (Math.PI/180));
        g.globalAlpha = 0.5;
        g.drawImage(img, -this.width/2, -this.height/2);

        g.restore();
    }

}
