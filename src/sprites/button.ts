import { GameAudio, playAudio } from "../audio";
import { Sprite, NodeType } from "../classes";
import { Game } from "../game";


export type ButtonOpts = {
    /** True if there always needs to be a body on this button. False if a single touch will activate it forever */
    needsHoldingDown?: boolean
}


export class Button extends Sprite {


    /** true if the button is currently being pressed */
    private _isActive = false;

    ops?: ButtonOpts;

    /** delta is added to this */
    timeElapsed = 0;

    constructor(x: number, y: number, opts?: ButtonOpts) {
        super(x,y, {width:35, height:15});

        this.type = NodeType.BUTTON;

        this.ops = opts;
    }

    /**
     * Is this button currently active?
     */
    isActive() {
        return this._isActive;
    }

    /**
     * Manually set this button to active
     */
    setActive() {
        this._isActive = true;
        playAudio(GameAudio!.buttonPress);
    }


    setInActive() {
        this._isActive = false;
        playAudio(GameAudio!.buttonDepress);
    }


    update(delta: number, g: Game): void {

        this.timeElapsed += delta;



        // reset is active and check again (only if the button needs to be held down.)
        const lastState = this._isActive;
        if(this.ops?.needsHoldingDown) {
            this._isActive = false;
        }

        // check if the player has pressed the button
        const p = g.player;

        if(this.isPointInSprite(p)) {
            console.log("Button Pressed By Player!")
            this._isActive = true;
        }

        // check all dead bodies to see if any of them are pressing the button
        g.backgroundNode.children.forEach((node) => {
            if(node.type === NodeType.DEAD_PLAYER) {
                if(this.isPointInSprite(node as Sprite)) {
                    this._isActive = true;
                }
            }
        })

        // if the button was pressed - play a sound!
        if(lastState === false && this._isActive === true) {
            this.setActive();
        }

        // if body / player moved off the button
        if(lastState === true && this._isActive === false) {
            this.setInActive();
        }


    }

    render(g: CanvasRenderingContext2D): void {


        g.fillStyle = 'grey';

        if(this._isActive) {
            g.fillStyle = 'purple';
        }

        g.translate(this.x, this.y);

        // g.rotate(this.timeElapsed / 300);
        // g.scale(Math.sin(this.timeElapsed / 300), 1);

        g.fillRect(-this.width/2, -this.height/2, this.width, this.height);
        g.fillRect(-this.width*0.7/2, -this.height/1.2, this.width*0.7, this.height);




    }

}
