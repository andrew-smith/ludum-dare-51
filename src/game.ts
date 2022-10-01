import { loadAudio } from "./audio";
import { Background } from "./background";
import { GameNode } from "./classes";
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
    mainCanvasElementId: string,
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

    /** Stores black/white image data so we can look up if there is a collision for the player */
    private boundsImageData: ImageData;


    /** True once the level is completed */
    isLevelCompleted = false;


    constructor(opts: GameOpts) {

        const canvasElement = document.getElementById(opts.mainCanvasElementId);//.getContext('2d');
        assert(canvasElement instanceof HTMLCanvasElement, 'Main canvas not found!');
        const context = canvasElement.getContext('2d');
        assert(context, 'Canvas has no context (?)');
        this.graphics = context;

        // this.rootNode = new GameNode();
    }


    async initilize() {
        console.log("initilize game " + this.id);

        const loadPromises = Promise.all([
            loadImages(),
            loadAudio(),
        ]);

        // THIS IS IN RENDERING ORDER

        // first render all background objects
        this.backgroundNode = new Background();

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

        // setup bounds
        const boundsElement = document.getElementById("map_bounds_canvas");//.getContext('2d');
        assert(boundsElement instanceof HTMLCanvasElement, 'Main canvas not found!');
        const boundsContext = boundsElement.getContext('2d');
        assert(boundsContext, 'Canvas has no context (?)');

        boundsContext.resetTransform(); // clear everything
        boundsContext.drawImage(GameImage!.level01_bounds, 0,0);
        this.boundsImageData = boundsContext.getImageData(0, 0, 1000, 1000);


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

        x = Math.floor(x);
        y = Math.floor(y);

        if(x < 0 || x >= 1000 || y < 0 || y >= 1000) {
            return false;
        }

        const index = y * (1000 * 4) + x * 4;

        if(index < 0 || index >= this.boundsImageData.data.length) {
            return false;
        }

        return this.boundsImageData.data[index] > 0;

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

