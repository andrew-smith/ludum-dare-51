import { uuid } from "./utils/uuid";

export interface IGameNode {
    id: string;

    addNode(node: IGameNode): void;
    removeNode(node: IGameNode): void;
    update(delta: number): void;
    updateAll(delta: number): void;
    render(g: CanvasRenderingContext2D): void;
    renderAll(g: CanvasRenderingContext2D): void;

    hasExpired(): boolean;
}

export class GameNode<ChildT extends IGameNode = IGameNode> implements IGameNode {

    children: ChildT[] = [];
    id: string;

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

        this.children.forEach(c => c.renderAll(g));

        g.restore();
    }

    hasExpired() {
        return false;
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
