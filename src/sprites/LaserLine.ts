import { Sprite, NodeType } from "../classes";
import { Game } from "../game";
import { degreesToRadians, findNewPoint, radiansToDegrees } from "../utils/math";
import Flatten from '@flatten-js/core'
import { DeadPlayer } from "./DeadPlayer";
const { Polygon, Point, Line } = Flatten;

export class LaserLine extends Sprite {

    private x1: number;
    private y1: number;
    private x2: number;
    private y2: number;


    laserWidth = 15;

    // we draw a straight line on the canvas, then rotate it.
    // (this is so we can texture it)
    private angleToDrawRadians: number;
    private lineLength: number;
    // the starting length - in case the length changes (like if a dead body is in the way)
    private originalLength: number;

    private polygon: Flatten.Polygon;
    boundPoints : {x:number, y:number}[] = [];

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
        this.originalLength = this.lineLength;

        this.computeBounds();
    }

    // should only be called once - or if the bounds change
    computeBounds() {


        // calculate bounds
        this.boundPoints.push(findNewPoint(this.x1, this.y1, -radiansToDegrees(this.angleToDrawRadians), this.laserWidth/2));
        this.boundPoints.push(findNewPoint(this.x1, this.y1, -radiansToDegrees(this.angleToDrawRadians)-180, this.laserWidth/2));
        
        this.boundPoints.push(findNewPoint(this.x2, this.y2, -radiansToDegrees(this.angleToDrawRadians), this.laserWidth/2));
        this.boundPoints.push(findNewPoint(this.x2, this.y2, -radiansToDegrees(this.angleToDrawRadians)-180, this.laserWidth/2));

        console.log(findNewPoint(this.x1, this.y1, -radiansToDegrees(this.angleToDrawRadians), this.laserWidth/2));

        let polygonPoints : Flatten.Point[] = [];

        this.boundPoints.forEach(p => {
            polygonPoints.push(new Point(p.x, p.y));

        });

        this.polygon = new Polygon(polygonPoints);
    }


    update(delta: number, g: Game): void {

        const p = g.player;

        // check if the player gets hit by the laser
        if(this.polygon.intersect(p.getPlayerBoundingBox()).length > 0) {

            // AND make sure that there isn't a body in front of the laser


            // get the length from the start to the player
            const lengthToPlayer = Math.abs(Math.hypot(p.x-this.x1, p.y-this.y1));

            if(lengthToPlayer < this.lineLength) { // then it's hit!

                console.log('LASER HIT');
                g.player.kill();
            }

        }

        // reset the laser length and recalculate (if bodies disappear then this will move the laser back again)
        this.lineLength = Math.abs(Math.hypot(this.x2-this.x1, this.y2-this.y1));

        // check all dead bodies to see if any of them are in the way of the laser

        const allIntersectingPoints: Flatten.Point[] = [];

        g.backgroundNode.children.forEach((node) => {
            if(node.type === NodeType.DEAD_PLAYER) {
                const deadBody = node as DeadPlayer;

                allIntersectingPoints.push(... this.polygon.intersect(deadBody.getPlayerBoundingBox()));
                
            }
        });

        // get all intersecting points and figure out the shortest distance
        allIntersectingPoints.forEach((point) => {
            const shortLineLength = Math.abs(Math.hypot(point.x-this.x1, point.y-this.y1));

            if(this.lineLength > shortLineLength) {
                this.lineLength = shortLineLength;
            }
        })



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


        this.polygon.vertices.forEach((v) => {
            g.fillStyle = 'black';

            g.fillRect(v.x, v.y, 1, 1);
        })

        // this.boundPoints.forEach((v) => {
        //     g.fillStyle = 'black';

        //     g.fillRect(v.x, v.y, 1, 1);
        // })

    }
}
