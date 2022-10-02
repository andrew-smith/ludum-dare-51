import { Level } from "../../classes";
import { ExitPortal } from "../../exit-portal";
import { Game } from "../../game";
import { LazyGameImage } from "../../images";
import { assert } from "../../utils/assert";
import { SplashScreenNode } from "./SplashScreenNode";

export class SpashScreen extends Level {

    width = 1000;
    height = 1000;

    game: Game;

    main_canvas: HTMLElement;

    hasUserInteracted = false;

    constructor() {
        super();
    }


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
        

        const main_canvas = document.getElementById("main_canvas");//.getContext('2d');
        assert(main_canvas);

        this.main_canvas = main_canvas;
        const self = this;

        function interactionActivated() {
            console.log("User has interacted.");
            self.main_canvas.removeEventListener('click', interactionActivated);
            self.main_canvas.removeEventListener('touchend', interactionActivated);

            self.hasUserInteracted = true;
        }

        main_canvas.addEventListener('click', interactionActivated);
        main_canvas.addEventListener('touchend', interactionActivated);

        game.uiNode.addNode(new SplashScreenNode());
        game.customLevelSuccessMessage = "Let's GO!";
    }



    update(delta: number, g: Game): void {

        if(this.hasUserInteracted) {
            g.playerWonLevel();
        }
        
    }

}