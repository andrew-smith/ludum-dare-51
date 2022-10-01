import assert from "assert";
import { Key } from "ts-keycode-enum";
import { Explosion } from "./sprites/Explosion";
import { GameAudio, playAudio } from "./audio";
import { Sprite } from "./classes";
import { CANVAS_HEIGHT, CANVAS_WIDTH, SECONDS } from "./constants";
import { GameImage } from "./images";
import { getDPadMovement, isKeyPressed, isUserTouchingDPad } from "./utils/keyevents";
import { DeadPlayer } from "./sprites/DeadPlayer";
import { Game } from "./game";

import Flatten from '@flatten-js/core'
const { Polygon, Point, Line } = Flatten;


/**
 * A player - which can be a live player or a dead player.
 * 
 * Once the player is dead it is attached to the expiring root nodes so the game can remove it
 */
export class Player extends Sprite {

    static PLAYER_EXPIRE_TTL = 10 * SECONDS;

    /** How much time the player starts with */
    static PLAYER_STARTING_TTL = 10 * SECONDS;

    /** When the player is going to die (10 seconds) */
    ttl: number = Player.PLAYER_STARTING_TTL;

    /** once player is dead this will be true */
    isDead = false;

    /** true if the player has moved yet, starts as false and will be set to true once player does first move */
    hasPlayerMovedYet = false;


    /** The last position of the player */
    previousX: number;
    /** The last position of the player */
    previousY: number;

    constructor() {
        // starting x/y position
        super(500, 500, {width: GameImage!.man.width, height: GameImage!.man.height});

        this.previousX = this.x;
        this.previousY = this.y;
    }


    hasExpired(): boolean {

        return this.isDead;
    }


    hasCelebrated = false;

    // called when level is finished
    celebrateFinishingLevel(g: Game) {
        if(this.hasCelebrated) {
            return;
        }

        this.hasCelebrated = true;

        g.foregoundNode.addNode(new Explosion(this.x, this.y));
    }


    /** Get the current position and bounding box of the player */
    getPlayerBoundingBox() : Flatten.Polygon {

        // TODO This is also in the DeadPlayer.ts file. Copy this over

        const bbWidth = this.width/4;
        const bbHeight = this.height/4;

        return new Polygon([
            new Point(this.x - bbWidth, this.y - bbHeight),
            new Point(this.x - bbWidth, this.y + bbHeight),
            new Point(this.x + bbWidth, this.y + bbHeight),
            new Point(this.x + bbWidth, this.y - bbHeight),
        ]);
    }

    update(delta: number, g: Game): void {

        if(g.isLevelCompleted) {

            this.celebrateFinishingLevel(g);
            return;
        }

        if(this.hasPlayerMovedYet) {
            this.ttl -= delta;
        }


        if(this.isDead === false && this.ttl <= 0) { //player has died (run once)

            console.log("Player has died");
            this.isDead = true;

            // emit explosion at source
            g.foregoundNode.addNode(new Explosion(this.x, this.y));
            playAudio(GameAudio!.miniExplosion);

            // emit a dead player
            g.backgroundNode.addNode(new DeadPlayer(this.x, this.y));


            g.playerHasDied();

        }

        const previousX = this.x;
        const previousY = this.y;

        let movementSpeed = 0.35 * delta;

        if(isUserTouchingDPad()) {
            const playerMove = getDPadMovement();

            this.x += playerMove.x * movementSpeed;
            this.y += playerMove.y * movementSpeed;
        }
        else { // use arrow keys

            if(isKeyPressed(Key.UpArrow) || isKeyPressed(Key.W)) {
                this.y -= movementSpeed;
                this.hasPlayerMovedYet = true;
            }
    
            if(isKeyPressed(Key.DownArrow)  || isKeyPressed(Key.S)) {
                this.y += movementSpeed;
                this.hasPlayerMovedYet = true;
            }
    
            if(isKeyPressed(Key.LeftArrow) || isKeyPressed(Key.A)) {
                this.x -= movementSpeed;
                this.hasPlayerMovedYet = true;
            }
            if(isKeyPressed(Key.RightArrow) || isKeyPressed(Key.D)) {
                this.x += movementSpeed;
                this.hasPlayerMovedYet = true;
            }
        }


        // if it's a bad space to move to, go back to previous position
        if(! g.isClearSpace(this.x, this.y)) {
            this.x = previousX;
            this.y = previousY;
        }


        // persist this on the object
        this.previousX = previousX;
        this.previousY = previousY;

        // if space is pressed - die instantly
        if(isKeyPressed(Key.Space)) {
            this.kill();
        }

    }


    /**
     * Force the player to instantly die
     */
    kill() {
        this.ttl = -1;
    }

    render(g: CanvasRenderingContext2D): void {

        const img = GameImage!.man;

        g.save();
            g.translate(0,0); // player is ALWAYS in center of the screen
            g.drawImage(img, -this.width/2, -this.height/2);
        g.restore();
        // g.fillRect(this.renderXPos(), this.renderYPos(), this.width, this.height);
    }

}
