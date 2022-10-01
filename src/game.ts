import { Background } from "./background";
import { GameNode } from "./classes";
import { loadImages } from "./images";
import { Player } from "./player";
import { HUD } from "./ui-hud/hud";
import { assert } from "./utils/assert";
import { uuid } from "./utils/uuid";



export type GameOpts = {
    mainCanvasElementId: string
}


export class Game {

    id = uuid();

    private graphics: CanvasRenderingContext2D;

    // top level root node - all rendering will happen from here
    private rootNode: GameNode;

    public livePlayerNode: GameNode; // should only have one in it at all times!
    public deadPlayerNodes: GameNode;
    public player: Player;

    public background: Background;
    public backgroundObjects: GameNode;
    public foregoundObjects: GameNode;
    public uiNode: GameNode;

    constructor(opts: GameOpts) {

        const canvasElement = document.getElementById(opts.mainCanvasElementId);//.getContext('2d');
        assert(canvasElement instanceof HTMLCanvasElement, 'Main canvas not found!');
        const context = canvasElement.getContext('2d');
        assert(context, 'Canvas has no context (?)');
        this.graphics = context;

        this.rootNode = new GameNode();
    }


    async initilize() {
        console.log("initilize game " + this.id);

        const loadImagesPromise = loadImages();

        // THIS IS IN RENDERING ORDER

        this.background = new Background();
        this.rootNode.addNode(this.background);

        // background objects (that the player can step on)
        this.backgroundObjects = new GameNode();
        this.rootNode.addNode(this.backgroundObjects);

        // dead player nodes
        this.deadPlayerNodes = new GameNode();
        this.rootNode.addNode(this.deadPlayerNodes);


        // live player node
        this.livePlayerNode = new GameNode();
        this.rootNode.addNode(this.livePlayerNode);

        // foreground objects that are on top of the player
        this.foregoundObjects = new GameNode();
        this.rootNode.addNode(this.foregoundObjects);

        // the UI components
        this.uiNode = new GameNode();
        this.rootNode.addNode(this.uiNode);

        this.uiNode.addNode(new HUD());


        // wait for all async
        await loadImagesPromise;
        console.log("All images loaded");
        
        this.createNewPlayer();
    }

    // called on first load, and when a player dies and needs to respawn
    private createNewPlayer() {
        this.player = new Player();
        this.livePlayerNode.addNode(this.player);
    }


    playerHasDied() {
        const livePlayer = this.livePlayerNode.children[0];

        this.livePlayerNode.removeNode(livePlayer);
        this.deadPlayerNodes.addNode(livePlayer);

        this.createNewPlayer();
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

        this.rootNode.updateAll(delta);
    }



    render(g: CanvasRenderingContext2D) {

        g.save();

        g.imageSmoothingEnabled = false;

        this.rootNode.renderAll(g);

        g.restore();
    }
}

