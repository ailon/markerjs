import { SvgHelper } from "../helpers/SvgHelper";
import { MarkerBase } from "./MarkerBase";
import { ResizeGrip } from "./ResizeGrip";
import { LineMarkerBaseState } from './LineMarkerBaseState';

export class LineMarkerBase extends MarkerBase {
    public static createMarker = (): LineMarkerBase => {
        const marker = new LineMarkerBase();
        marker.setup();
        return marker;
    }

    protected markerLine: SVGLineElement;

    private readonly MIN_LENGTH = 20;

    private markerBgLine: SVGLineElement; // touch target

    private controlBox: SVGGElement;

    private controlGrip1: ResizeGrip;
    private controlGrip2: ResizeGrip;
    private activeGrip: ResizeGrip;

    private x1: number = 0;
    private y1: number = 0;
    private x2: number = this.width;
    private y2: number = 0;

    public endManipulation() {
        super.endManipulation();
        this.isResizing = false;
        this.activeGrip = null;
    }

    public select() {
        super.select();
        this.controlBox.style.display = "";
    }

    public deselect() {
        super.deselect();
        this.controlBox.style.display = "none";
    }

    public getState(): LineMarkerBaseState {
        const state: LineMarkerBaseState = Object.assign( 
            { 
                x1: this.x1,
                y1: this.y1,
                x2: this.x2,
                y2: this.y2
            }, 
            super.getState()
        ); 
        return state;
    }

    public restoreState(state: LineMarkerBaseState) {
        this.x1 = state.x1;
        this.y1 = state.y1;
        this.x2 = state.x2;
        this.y2 = state.y2;
        super.restoreState(state);
        this.adjustLine();
    }

    protected setup() {
        super.setup();

        this.markerBgLine = SvgHelper.createLine(0, 0, this.x2, 0,
            [["stroke", "transparent"], ["stroke-width", "30"]]);
        this.addToRenderVisual(this.markerBgLine);
        this.markerLine = SvgHelper.createLine(0, 0, this.x2, 0);
        this.addToRenderVisual(this.markerLine);

        this.addControlBox();
    }

    protected resize(x: number, y: number) {
        if (this.activeGrip) {
            if (this.activeGrip === this.controlGrip1
                && this.getLineLength(this.x1 + x, this.y1 + 1, this.x2, this.y2) >= this.MIN_LENGTH) {
                this.x1 += x;
                this.y1 += y;
            } else if (this.activeGrip === this.controlGrip2
                && this.getLineLength(this.x1, this.y1, this.x2 + x, this.y2 + y) >= this.MIN_LENGTH) {
                this.x2 += x;
                this.y2 += y;
            }
        }

        this.adjustLine();
        this.adjustControlBox();
    }

    protected adjustLine() {
        this.markerBgLine.setAttribute("x1", this.x1.toString());
        this.markerBgLine.setAttribute("y1", this.y1.toString());
        this.markerLine.setAttribute("x1", this.x1.toString());
        this.markerLine.setAttribute("y1", this.y1.toString());
        this.markerBgLine.setAttribute("x2", this.x2.toString());
        this.markerBgLine.setAttribute("y2", this.y2.toString());
        this.markerLine.setAttribute("x2", this.x2.toString());
        this.markerLine.setAttribute("y2", this.y2.toString());
}

    private getLineLength = (x1: number, y1: number, x2: number, y2: number): number => {
        const dx = Math.abs(x1 - x2);
        const dy = Math.abs(y1 - y2);

        return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    }

    private addControlBox = () => {
        this.controlBox = SvgHelper.createGroup([["class", "markerjs-line-control-box"]]);
        this.addToVisual(this.controlBox);

        this.addControlGrips();
    }

    private adjustControlBox = () => {
        this.positionGrips();
    }

    private addControlGrips = () => {
        this.controlGrip1 = this.createGrip();
        this.controlGrip2 = this.createGrip();

        this.positionGrips();
    }

    private createGrip = (): ResizeGrip => {
        const grip = new ResizeGrip();
        grip.visual.transform.baseVal.appendItem(SvgHelper.createTransform());
        this.controlBox.appendChild(grip.visual);

        grip.visual.addEventListener("mousedown", this.gripMouseDown);
        grip.visual.addEventListener("mousemove", this.gripMouseMove);
        grip.visual.addEventListener("mouseup", this.gripMouseUp);

        grip.visual.addEventListener("touchstart", this.onTouch, { passive: false });
        grip.visual.addEventListener("touchend", this.onTouch, { passive: false });
        grip.visual.addEventListener("touchmove", this.onTouch, { passive: false });

        return grip;
    }

    private positionGrips = () => {
        const gripSize = this.controlGrip1.GRIP_SIZE;

        const x1 = this.x1 - gripSize / 2;
        const y1 = this.y1 - gripSize / 2;
        const x2 = this.x2 - gripSize / 2;
        const y2 = this.y2 - gripSize / 2;

        this.positionGrip(this.controlGrip1.visual, x1, y1);
        this.positionGrip(this.controlGrip2.visual, x2, y2);
    }

    private positionGrip = (grip: SVGGraphicsElement, x: number, y: number) => {
        const translate = grip.transform.baseVal.getItem(0);
        translate.setTranslate(x, y);
        grip.transform.baseVal.replaceItem(translate, 0);
    }

    private gripMouseDown = (ev: MouseEvent) => {
        this.isResizing = true;
        this.activeGrip = (ev.target as SVGGraphicsElement) === this.controlGrip1.visual ?
            this.controlGrip1 : this.controlGrip2;
        this.previousMouseX = ev.screenX;
        this.previousMouseY = ev.screenY;
        ev.stopPropagation();
    }

    private gripMouseUp = (ev: MouseEvent) => {
        this.isResizing = false;
        this.activeGrip = null;
        ev.stopPropagation();
    }

    private gripMouseMove = (ev: MouseEvent) => {
        if (this.isResizing) {
            this.resize(ev.movementX, ev.movementY);
        }
    }
}
