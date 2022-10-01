import { Level } from "../../classes";
import { ExitPortal } from "../../exit-portal";
import { Game } from "../../game";
import { LazyGameImage } from "../../images";
import { Button } from "../../sprites/button";
import { assert } from "../../utils/assert";

export class Level03 extends Level {

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

        // load bounds data
        const boundsElement = document.getElementById("map_bounds_canvas");//.getContext('2d');
        assert(boundsElement instanceof HTMLCanvasElement, 'Main canvas not found!');
        const boundsContext = boundsElement.getContext('2d');
        assert(boundsContext, 'Canvas has no context (?)');

        boundsContext.resetTransform(); // clear everything
        boundsContext.drawImage(await LazyGameImage.level01_bounds(), 0,0);
        this.boundsImageData = boundsContext.getImageData(0, 0, 1000, 1000);

        // load background display image for user
        this.backgroundImage = await LazyGameImage.level01_map();
        
        // this button needs holding down
        this.button = new Button(700, 350, {needsHoldingDown: true});
        game.backgroundNode.addNode(this.button);

        // hardcoded exit portal
        this.exitPortal = new ExitPortal(855, 450);
        game.backgroundNode.addNode(this.exitPortal);
    }



    update(delta: number): void {
        
        this.exitPortal.isActive = this.button.isActive();
        
    }
}