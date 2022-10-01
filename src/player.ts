import assert from "assert";
import { Key } from "ts-keycode-enum";
import { Explosion } from "./animations/Explosion";
import { DisappearingSmokePuff } from "./animations/SmokePuff";
import { GLOBAL_GAME } from "./app";
import { GameAudio, playAudio } from "./audio";
import { Sprite } from "./classes";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants";
import { GameImage } from "./images";
import { isKeyPressed } from "./utils/keyevents";

const SECOND = 1000;




/**
 * A player - which can be a live player or a dead player.
 * 
 * Once the player is dead it is attached to the expiring root nodes so the game can remove it
 */
export class Player extends Sprite {

    
    /** Player node is expired (removed) after 30 seconds */
    static PLAYER_EXPIRE_TTL = -3 * SECOND; 

    /** How much time the player starts with */
    static PLAYER_STARTING_TTL = 3 * SECOND;


    /** When the player is going to die (10 seconds) */
    ttl: number = Player.PLAYER_STARTING_TTL;

    /** once player is dead this will be true */
    isDead = false;

    /** true if the player has moved yet, starts as false and will be set to true once player does first move */
    hasPlayerMovedYet = false;

    constructor() {
        // starting x/y position
        super(CANVAS_WIDTH/2, CANVAS_HEIGHT/2, {width: GameImage!.man.width, height: GameImage!.man.height});
    }


    hasExpired(): boolean {

        return (this.ttl < Player.PLAYER_EXPIRE_TTL);
    }


    update(delta: number): void {

        if(this.hasPlayerMovedYet) {
            this.ttl -= delta;
        }


        if(this.isDead === false && this.ttl <= 0) { //player has died (run once)

            console.log("Player has died");
            this.isDead = true;

            // emit explosion at source
            GLOBAL_GAME.foregoundObjects.addNode(new Explosion(this.x, this.y));
            playAudio(GameAudio!.miniExplosion);

            GLOBAL_GAME.playerHasDied();

        }


        if(this.isDead) {
            return this.updateDeadPlayer(delta);
        }


        // else we are alive, so update live player
        this.updateLivePlayer(delta);


    }

    updateDeadPlayer(delta: number) {

        // todo something?

        if(this.hasExpired())  {// this will only run once - because next iteration it will be removed from the tree

            // emit smoke puff!!
            GLOBAL_GAME.backgroundObjects.addNode(new DisappearingSmokePuff(this.x, this.y));
        }
    }

    updateLivePlayer(delta: number) {

        const movementSpeed = 0.35 * delta;

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

    render(g: CanvasRenderingContext2D): void {

        const img = GameImage!.man;
        
        
        g.fillStyle = "red";

        if(this.isDead) {
            g.fillStyle = 'grey';

            // slowly fade out the player
            g.globalAlpha = 1- Math.abs(this.ttl / Player.PLAYER_EXPIRE_TTL);
        }

        g.drawImage(img, this.renderXPos(), this.renderYPos());

        // g.fillRect(this.renderXPos(), this.renderYPos(), this.width, this.height);
    }
}
