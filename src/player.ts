import { Key } from "ts-keycode-enum";
import { GLOBAL_GAME } from "./app";
import { Sprite } from "./classes";
import { GAME_HEIGHT, GAME_WIDTH } from "./game";
import { isKeyPressed } from "./utils/keyevents";

const SECOND = 1000;

// Player node is expired (removed) after 30 seconds
const PLAYER_DEAD_TTL = -30 * SECOND;

/**
 * A player - which can be a live player or a dead player.
 * 
 * Once the player is dead it is attached to the expiring root nodes so the game can remove it
 */
export class Player extends Sprite {

    /** When the player is going to die (10 seconds) */
    ttl: number = 1 * SECOND;

    isDead = false;

    constructor() {
        // starting x/y position
        super(GAME_WIDTH/2, GAME_HEIGHT/2);

        this.x = Math.random() * 250;
        this.y = Math.random() * 250;
    }


    hasExpired(): boolean {

        return (this.ttl < PLAYER_DEAD_TTL);
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
            g.fillStyle = 'grey'
        }
        g.fillRect(this.x, this.y, 10, 10);
    }
}
