import { Level } from "../../classes";
import { ExitPortal } from "../../exit-portal";
import { Game } from "../../game";
import { GameImage } from "../../images";
import { Button } from "../../sprites/button";
import { assert } from "../../utils/assert";

export class Level01 extends Level {

    width = 1000;
    height = 1000;

    game: Game;

    constructor() {
        super();
    }


    // the only button on this level
    button: Button;

    // the only exit portal
    exitPortal: ExitPortal;

    async initilize(game: Game) {

        this.game = game;

        // load the background images
        // this is already been done - but would be nice to do it here individually

        // load bounds data
        const boundsElement = document.getElementById("map_bounds_canvas");//.getContext('2d');
        assert(boundsElement instanceof HTMLCanvasElement, 'Main canvas not found!');
        const boundsContext = boundsElement.getContext('2d');
        assert(boundsContext, 'Canvas has no context (?)');

        boundsContext.resetTransform(); // clear everything
        boundsContext.drawImage(GameImage!.level01_bounds, 0,0);
        this.boundsImageData = boundsContext.getImageData(0, 0, 1000, 1000);

        // load background display image for user
        this.backgroundImage = GameImage!.level01_map;
        

        this.button = new Button(700, 350);
        game.backgroundNode.addNode(this.button);

        // hardcoded exit portal
        this.exitPortal = new ExitPortal(855, 450);
        game.backgroundNode.addNode(this.exitPortal);
    }



    update(delta: number): void {
        
        this.exitPortal.isActive = this.button.isActive;
    }
}