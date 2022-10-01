import { loadAudio } from "./audio";
import { Background } from "./background";
import { GameNode, Level } from "./classes";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants";
import { loadImages } from "./images";
import { Player } from "./player";
import { HUD } from "./ui-hud/hud";
import { assert } from "./utils/assert";
import { uuid } from "./utils/uuid";
import { GameImage } from "./images";
import { ExitPortal } from "./exit-portal";
import { Button } from "./sprites/button";



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
    private uiNode: GameNode;


    public player: Player;



    /** True once the level is completed */
    isLevelCompleted = false;


    level: Level;

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

        const loadPromises = Promise.all([
            this.level.initilize()
        ]);

        // THIS IS IN RENDERING ORDER

        // first render all background objects
        this.backgroundNode = new Background(this.level);

        // then render the player
        this.playerNode = new GameNode();

        // then render foreground objects
        this.foregoundNode = new GameNode();

        // then render the UI
        this.uiNode = new HUD();

        // FINISH RENDERING ORDER SETUP

        // wait for all async
        await loadPromises;
        console.log("All resources loaded");



        // hardcoded exit portal
        this.testExitPortal = new ExitPortal(855, 450);
        // exitPortal.isActive = true;
        this.backgroundNode.addNode(this.testExitPortal);

        // hardcoded button
        const button = new Button(700, 350);
        this.backgroundNode.addNode(button);

        
        this.createNewPlayer();
    }


    testExitPortal: ExitPortal;

    // called on first load, and when a player dies and needs to respawn
    private createNewPlayer() {
        this.player = new Player();
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
        this.isLevelCompleted = true;
    }


    start() {
        console.log("starting game " + this.id);

        this.gameloop();
    }



    /** When the last update was run (milliseconds ago) */
    lastUpdate = 0;

    gameloop() {
        // console.log('gameloop ' + this.id);

        const now = new Date().getTime();

        if(this.lastUpdate === 0) { // first time 
            this.lastUpdate = now;
        }

        const delta = now - this.lastUpdate;
        // console.log(1000/delta);


        this.update(delta);
        this.render(this.graphics);

        this.lastUpdate = now;
        window.requestAnimationFrame(() => this.gameloop());
    }


    update(delta: number) {

        [this.backgroundNode, this.playerNode, this.foregoundNode, this.uiNode].forEach(node => {
            node.updateAll(delta);
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
    }
}

