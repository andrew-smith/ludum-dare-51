import { GameAudio, playAudio } from "../audio";
import { Sprite, NodeType } from "../classes";
import { Game } from "../game";


export class Button extends Sprite {


    /** true if the button is currently being pressed */
    private isActive = false;

    /** delta is added to this */
    timeElapsed = 0;

    constructor(x: number, y: number) {
        super(x,y, {width:35, height:15});

        this.type = NodeType.BUTTON;
    }


    update(delta: number, g: Game): void {

        this.timeElapsed += delta;

        // reset is active and check again
        const lastState = this.isActive;
        this.isActive = false;

        // check if the player has pressed the button
        const p = g.player;

        if(this.isPointInSprite(p)) {
            console.log("Button Pressed By Player!")
            this.isActive = true;
        }

        // check all dead bodies to see if any of them are pressing the button
        g.backgroundNode.children.forEach((node) => {
            if(node.type === NodeType.DEAD_PLAYER) {
                if(this.isPointInSprite(node as Sprite)) {
                    this.isActive = true;
                }
            }
        })

        // if the button was pressed - play a sound!
        if(lastState === false && this.isActive === true) {
            playAudio(GameAudio!.buttonPress);
        }

    }

    render(g: CanvasRenderingContext2D): void {


        g.fillStyle = 'grey';

        if(this.isActive) {
            g.fillStyle = 'purple';
        }

        g.translate(this.x, this.y);

        // g.rotate(this.timeElapsed / 300);
        // g.scale(Math.sin(this.timeElapsed / 300), 1);

        g.fillRect(-this.width/2, -this.height/2, this.width, this.height);
        g.fillRect(-this.width*0.7/2, -this.height/1.2, this.width*0.7, this.height);




    }

}
