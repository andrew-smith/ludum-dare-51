import { Background } from "./background";
import { GameNode } from "./classes";
import { Player } from "./player";

export const GAME_WIDTH = 512;
export const GAME_HEIGHT = 640;



export type GameOpts = {
    mainCanvasElementId: string
}


export class Game {

    private canvasElement;
    private graphics: CanvasRenderingContext2D;

    private rootNode: GameNode;

    constructor(opts: GameOpts) {

        this.canvasElement = document.getElementById(opts.mainCanvasElementId);//.getContext('2d');
        this.graphics = this.canvasElement.getContext('2d');

        this.rootNode = new GameNode();
    }


    async initilize() {
        console.log("initilize");

        this.rootNode.addNode(new Background());
        this.rootNode.addNode(new Player());


    }


    start() {
        console.log("starting game");

        this.gameloop();
    }


    /** When the last update was run (milliseconds ago) */
    lastUpdate = 0;

    gameloop() {
        // console.log('gameloop');

        const now = new Date().getTime();

        if(this.lastUpdate === 0) {
            this.lastUpdate = now;
        }

        const delta = now - this.lastUpdate;
        // console.log(delta);


        this.update(delta);
        this.render(this.graphics);

        this.lastUpdate = now;
        window.requestAnimationFrame(() => this.gameloop());
    }


    update(delta: number) {


        this.rootNode.update(delta);
        this.rootNode.updateChildren(delta);
    }



    render(g: CanvasRenderingContext2D) {

        g.save();

        g.imageSmoothingEnabled = false;

        this.rootNode.render(g);
        this.rootNode.renderChildren(g);

        g.restore();
    }
}

