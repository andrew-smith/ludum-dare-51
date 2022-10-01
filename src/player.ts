import { Key } from "ts-keycode-enum";
import { DisappearingSmokePuff } from "./animations/SmokePuff";
import { GLOBAL_GAME } from "./app";
import { Sprite } from "./classes";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./game";
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

    isDead = false;

    constructor() {
        // starting x/y position
        super(CANVAS_WIDTH/2, CANVAS_HEIGHT/2, {width: 10, height: 18});
    }


    hasExpired(): boolean {

        return (this.ttl < Player.PLAYER_EXPIRE_TTL);
    }


    update(delta: number): void {

        this.ttl -= delta;


        if(this.isDead === false && this.ttl <= 0) { //player has died (run once)

            console.log("Player has died");
            GLOBAL_GAME.playerHasDied();

            this.isDead = true;
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

        if(isKeyPressed(Key.UpArrow)) {
            this.y -= movementSpeed;
        }

        if(isKeyPressed(Key.DownArrow)) {
            this.y += movementSpeed;
        }

        if(isKeyPressed(Key.LeftArrow)) {
            this.x -= movementSpeed;
        }
        if(isKeyPressed(Key.RightArrow)) {
            this.x += movementSpeed;
        }
    }

    render(g: CanvasRenderingContext2D): void {
        
        g.fillStyle = "red";

        if(this.isDead) {
            g.fillStyle = 'grey';

            // slowly fade out the player
            g.globalAlpha = 1- Math.abs(this.ttl / Player.PLAYER_EXPIRE_TTL);
        }

        g.translate(this.renderXPos(), this.renderYPos());

        g.fillRect(0, 0, this.width, this.height);
    }
}
