import { Level } from "../../classes";
import { GameImage } from "../../images";
import { assert } from "../../utils/assert";

export class Level01 extends Level {


    constructor() {
        super();
    }

    async initilize() {

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
        
    }


}