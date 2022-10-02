import { moveToNextLevel } from "./app";
import { GameAudio, playAudio } from "./audio";
import { Background } from "./background";
import { GameNode, Level } from "./classes";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants";
import { Player } from "./player";
import { HUD } from "./ui-hud/hud";
import { assert } from "./utils/assert";
import { uuid } from "./utils/uuid";



export type GameOpts = {

}


export class Game {

    id = uuid();

    private graphics: CanvasRenderingContext2D;

    // top level root node - all rendering will happen from here
    // private rootNode: GameNode;

    // secondary nodes
    public backgroundNode: GameNode;
    private playerNode: GameNode;
    public foregoundNode: GameNode;
    public uiNode: GameNode;


    public player: Player;


    /** Set to true once this game has finished and needs to be cleaned up by app.ts */
    private DESTROY_GAME = false;


    /** True once the level is completed */
    isLevelCompleted = false;


    level: Level;

    customLevelSuccessMessage?: string;
    customLevelSuccessMessageOffset?: number

    constructor(level: Level, opts?: GameOpts) {

        const canvasElement = document.getElementById("main_canvas");//.getContext('2d');
        assert(canvasElement instanceof HTMLCanvasElement, 'Main canvas not found!');
        const context = canvasElement.getContext('2d');
        assert(context, 'Canvas has no context (?)');
        this.graphics = context;

        this.level = level;
    }


    async initilize() {
        console.log("initilize game " + this.id);

        // THIS IS IN RENDERING ORDER

        // first render all background objects
        this.backgroundNode = new GameNode(); //new Background(this.level);

        // then render the player
        this.playerNode = new GameNode();

        // then render foreground objects
        this.foregoundNode = new GameNode();

        // then render the UI
        this.uiNode = new HUD();

        // FINISH RENDERING ORDER SETUP

        this.createNewPlayer();

        this.backgroundNode.addNode(new Background(this.level));

        // wait for all async
        await this.level.initilize(this);
        console.log("All resources loaded");



    }

    /**
     * Called when this game should no longer be rendered and everything can stop
     */
    async shutdownGame() {
        this.DESTROY_GAME = true;
    }


    // called on first load, and when a player dies and needs to respawn
    private createNewPlayer() {

        let startX = 500;
        let startY = 500;

        if(this.level.startingPlayerPosition) {
            startX = this.level.startingPlayerPosition.x;
            startY = this.level.startingPlayerPosition.y;
        }

        this.player = new Player(startX, startY);
        this.playerNode.addNode(this.player);
    }

    isClearSpace(x: number, y: number) : boolean {
        return this.level.isClearSpace(x, y);
    }
    

    playerHasDied() {
        const previouslyAlivePlayer = this.playerNode.children[0];

        this.playerNode.removeNode(previouslyAlivePlayer);
        this.backgroundNode.addNode(previouslyAlivePlayer);

        // create a new player in a little bit, so the player can enjoy the death animationd
        setTimeout(() => {
            this.createNewPlayer();
        }, 500) 
    }

    playerWonLevel() {

        if(this.isLevelCompleted) {
            // don't run it again.
            return;
        }

        this.isLevelCompleted = true;
        playAudio(GameAudio!.enterPortal);


        setTimeout(moveToNextLevel, 2000);
    }


    start() {
        console.log("starting game " + this.id);

        this.gameloop();
    }



    /** When the last update was run (milliseconds ago) */
    lastUpdate = 0;

    gameloop() {

        if(this.DESTROY_GAME) {
            return; // nothing left to do
        }
        // console.log('gameloop ' + this.id);

        const now = new Date().getTime();

        if(this.lastUpdate === 0) { // first time 
            this.lastUpdate = now;
        }

        const delta = now - this.lastUpdate;
        // console.log(1000/delta);


        this.update(delta);
        this.level.update(delta, this);
        this.render(this.graphics);

        this.lastUpdate = now;
        window.requestAnimationFrame(() => this.gameloop());
    }


    update(delta: number) {
        const self = this;
        [this.backgroundNode, this.playerNode, this.foregoundNode, this.uiNode].forEach(node => {
            node.updateAll(delta, self);
        });
    }



    render(g: CanvasRenderingContext2D) {

        g.save();
            g.imageSmoothingEnabled = false;

            g.save();

                // move to the center of the canvas before rendering anything
                g.translate(CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
                g.translate(-this.player.x, -this.player.y);

                this.backgroundNode.renderAll(g);

            g.restore();


            g.save();
                g.translate(CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
                this.playerNode.renderAll(g);
            g.restore();


            g.save();
                g.translate(CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
                g.translate(-this.player.x, -this.player.y);
                this.foregoundNode.renderAll(g);
            g.restore();


            g.save()
                this.uiNode.renderAll(g);
            g.restore();

        g.restore();


        if(this.isLevelCompleted) {

            g.save();

                const FONTSIZE = 40;
                let MSG = "LEVEL COMPLETE!";

                if(this.customLevelSuccessMessage) {
                    MSG = this.customLevelSuccessMessage;
                }

                g.fillStyle = "white";
                g.font = `bold ${FONTSIZE}px Courier New`;
                g.fillText(MSG, CANVAS_WIDTH/2 - (MSG.length * FONTSIZE/4), CANVAS_HEIGHT/2);

            g.restore();
        }
    }
}

