import { SvgHelper } from "../helpers/SvgHelper";

export class MarkerBase {
    public static createMarker = (): MarkerBase => {
        const marker = new MarkerBase();
        marker.setup();
        return marker;
    }

    public visual: SVGGElement;
    public renderVisual: SVGGElement;

    public onSelected: (marker: MarkerBase) => void;

    public defs: SVGElement[] = [];

    protected width: number = 200;
    protected height: number = 50;

    protected isActive: boolean = true;
    protected isResizing: boolean = false;

    private isDragging: boolean = false;

    // constructor() {
    // }

    public manipulate = (ev: MouseEvent) => {
        if (this.isDragging) {
            this.move(ev.movementX, ev.movementY);
        }
        if (this.isResizing) {
            this.resize(ev.movementX, ev.movementY);
        }
    }

    public endManipulation() {
        this.isDragging = false;
    }

    public select() {
        this.isActive = true;
        if (this.onSelected) {
            this.onSelected(this);
        }
        return;
    }

    public deselect() {
        this.isActive = false;
        this.endManipulation();
        return;
    }

    protected setup() {
        this.visual = SvgHelper.createGroup();
        // translate
        this.visual.transform.baseVal.appendItem(SvgHelper.createTransform());

        this.visual.addEventListener("mousedown", this.mouseDown);
        this.visual.addEventListener("mouseup", this.mouseUp);
        this.visual.addEventListener("mousemove", this.mouseMove);

        this.renderVisual = SvgHelper.createGroup([["class", "render-visual"]]);
        this.visual.appendChild(this.renderVisual);
    }

    protected addToVisual = (el: SVGElement) => {
        this.visual.appendChild(el);
    }

    protected addToRenderVisual = (el: SVGElement) => {
        this.renderVisual.appendChild(el);
    }

    protected resize(x: number, y: number) {
        return;
    }

    private mouseDown = (ev: MouseEvent) => {
        ev.stopPropagation();
        this.select();
        this.isDragging = true;
    }
    private mouseUp = (ev: MouseEvent) => {
        ev.stopPropagation();
        this.endManipulation();
    }
    private mouseMove = (ev: MouseEvent) => {
        ev.stopPropagation();
        this.manipulate(ev);
    }

    private move = (dx: number, dy: number) => {
        const translate = this.visual.transform.baseVal.getItem(0);
        translate.setMatrix(translate.matrix.translate(dx, dy));
        this.visual.transform.baseVal.replaceItem(translate, 0);
    }
}
