import { Sprite, NodeType } from "../classes";
import { Game } from "../game";
import { boundsContainsPoint, degreesToRadians, findNewPoint, Point, radiansToDegrees } from "../utils/math";


export class LaserLine extends Sprite {

    private x1: number;
    private y1: number;
    private x2: number;
    private y2: number;


    laserWidth = 10;

    // we draw a straight line on the canvas, then rotate it.
    // (this is so we can texture it)
    private angleToDrawRadians: number;
    private lineLength: number;

    private bounds: Point[] = [];

    constructor(x1: number, y1: number, x2: number, y2: number) {
        super(0,0);
        this.type = NodeType.LASER_LINE;

        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;

        console.log(this);
        
        this.angleToDrawRadians = (Math.atan2( y2 - y1, x2 - x1 ));
        this.lineLength = Math.abs(Math.hypot(x2-x1, y2-y1));

        this.calculateBounds();
    }

    // should only be called once - or if the bounds change
    calculateBounds() {

        // calculate bounds
        this.bounds.push(findNewPoint(this.x1, this.y1, -radiansToDegrees(this.angleToDrawRadians), this.laserWidth/2));
        this.bounds.push(findNewPoint(this.x1, this.y1, -radiansToDegrees(this.angleToDrawRadians)-180, this.laserWidth/2));
        
        this.bounds.push(findNewPoint(this.x2, this.y2, -radiansToDegrees(this.angleToDrawRadians), this.laserWidth/2));
        this.bounds.push(findNewPoint(this.x2, this.y2, -radiansToDegrees(this.angleToDrawRadians)-180, this.laserWidth/2));
    }


    update(delta: number, g: Game): void {


        const p = g.player;

        if(boundsContainsPoint(this.bounds, p.x, p.y)) {
            console.log('LASER HIT');
        }
    }

    render(g: CanvasRenderingContext2D): void {

        g.save();
            // translate to the starting point
            g.translate(this.x1, this.y1);

            g.rotate(this.angleToDrawRadians);
            g.rotate(degreesToRadians(-90));

            g.strokeStyle = 'red';
            g.lineWidth = this.laserWidth;
            

            g.beginPath();
            g.moveTo(0,0)
            g.lineTo(0, this.lineLength);

            g.stroke();

        g.restore();


        this.renderBounds(g);
    }


    renderBounds(g: CanvasRenderingContext2D): void {

        g.fillStyle = 'white';

        g.fillRect(this.x1, this.y1, 1, 1);
        g.fillRect(this.x2, this.y2, 1, 1);

        this.bounds.forEach((point) => {
            g.fillStyle = 'black';

            g.fillRect(point.x, point.y, 1, 1);
        })

    }
}
