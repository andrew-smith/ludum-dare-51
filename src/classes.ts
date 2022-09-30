import { v4 as uuid } from 'uuid';

export class GameNode {

    private children: GameNode[] = [];
    private id: string;

    constructor() {
        this.id = uuid();
    }

    addNode(node: GameNode) {
        this.children.push(node);
    }

    removeNode(node: GameNode) {
        this.children = this.children.filter((n) => n.id === node.id);
    }

    update(delta: number) {};

    updateChildren(delta: number) {
        this.children.forEach(c => c.update(delta));
    }

    render(g: CanvasRenderingContext2D) {};

    renderChildren(g: CanvasRenderingContext2D) {
        this.children.forEach(c => c.render(g));
    }
}




export class Sprite extends GameNode {
    x : number = 0;
    y : number = 0;

    constructor(x: number, y: number) {
        super();
        this.x = x;
        this.y = y;
    }

    update(delta: number) {};
    render(g: CanvasRenderingContext2D) {};
}
