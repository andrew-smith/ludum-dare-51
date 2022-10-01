import { uuid } from "./utils/uuid";



export enum NodeType {

    GENERAL_NODE,
    GENERAL_SPRITE,

    BUTTON,
    EXIT_PORTAL,
    DEAD_PLAYER
}


export interface IGameNode {
    id: string;

    type: NodeType;

    addNode(node: IGameNode): void;
    removeNode(node: IGameNode): void;
    update(delta: number): void;
    updateAll(delta: number): void;
    render(g: CanvasRenderingContext2D): void;
    renderAll(g: CanvasRenderingContext2D): void;

    hasExpired(): boolean;
}



export abstract class Level {

    /** Stores black/white image data so we can look up if there is a collision for the player. */
    boundsImageData: ImageData;

    /** The background image to display to the user */
    backgroundImage: ImageBitmap;

    /** Width of the level */
    width: number;
    /** height of the level */
    height: number;

    abstract initilize(): Promise<void>;

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

}

export class GameNode<ChildT extends IGameNode = IGameNode> implements IGameNode {

    children: ChildT[] = [];
    id: string;

    type = NodeType.GENERAL_NODE;

    constructor() {
        this.id = uuid();
    }

    addNode(node: ChildT) {
        this.children.push(node);
    }

    removeNode(node: ChildT) {
        this.children = this.children.filter((n) => n.id !== node.id);
    }

    update(delta: number) {};

    updateAll(delta: number) {
        this.update(delta);
        this.children.forEach(c => {
            c.updateAll(delta);

            if(c.hasExpired()) {
                this.removeNode(c);
            }
        });
    }

    render(g: CanvasRenderingContext2D) {};

    renderAll(g: CanvasRenderingContext2D) {

        g.save();

        this.render(g);

        this.children.forEach(c => {
            g.save();
            c.renderAll(g)
            g.restore();
        });

        g.restore();
    }

    hasExpired() {
        return false;
    }
}


export type SpriteOpts = {
    width?: number;
    height?: number;
    // TODO image as well?
}

export class Sprite extends GameNode {

    /** Middle x position of the sprite */
    x : number = 0;
    /** Middle y position of the sprite */
    y : number = 0;

    width : number = 0;
    height: number = 0;

    /** great for filtering what type of node this is */
    type: NodeType = NodeType.GENERAL_SPRITE;

    constructor(x: number, y: number, opts?: SpriteOpts) {
        super();
        this.x = x;
        this.y = y;

        this.width = opts?.width || 0;
        this.height = opts?.height || 0;
    }

    /** 
     * Top left x coordinate (based on width)
     */
    renderXPos() : number {
        return this.x - this.width/2; 
    }

    /**
     * Top left y coordinate (based on height)
     */
    renderYPos() : number {
        return this.y - this.height/2; 
    }

    /**
     * Check if a sprite x/y is within THIS sprite
     */
    isPointInSprite(otherSprite: Sprite) : boolean {

        if(Math.abs(otherSprite.x - this.x) < this.width/2 && Math.abs(otherSprite.y - this.y) < this.height/2) {
            return true;
        }

        return false;
    }

    update(delta: number) {};
    render(g: CanvasRenderingContext2D) {};
}
