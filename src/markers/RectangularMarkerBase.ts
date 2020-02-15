import { SvgHelper } from "../helpers/SvgHelper";
import { MarkerBase } from "./MarkerBase";
import { RectangularMarkerGrips } from "./RectangularMarkerGrips";
import { ResizeGrip } from "./ResizeGrip";

export class RectangularMarkerBase extends MarkerBase {
    public static createMarker = (): RectangularMarkerBase => {
        const marker = new RectangularMarkerBase();
        marker.setup();
        return marker;
    }

    protected MIN_SIZE = 5;

    private controlBox: SVGGElement;
    private readonly CB_DISTANCE: number = 10;
    private controlRect: SVGRectElement;

    private controlGrips: RectangularMarkerGrips;
    private activeGrip: ResizeGrip;

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

    protected setup() {
        super.setup();

        this.addControlBox();
    }

    protected resize(x: number, y: number) {
        let translateX = 0;
        let translateY = 0;

        switch (this.activeGrip) {
            case this.controlGrips.topLeft:
                this.width -= x;
                this.height -= y;
                translateX += x;
                translateY += y;
                break;
            case this.controlGrips.bottomLeft:
                this.width -= x;
                this.height += y;
                translateX += x;
                break;
            case this.controlGrips.topRight:
                this.width += x;
                this.height -= y;
                translateY += y;
                break;
            case this.controlGrips.bottomRight:
                this.width += x;
                this.height += y;
                break;
            case this.controlGrips.centerLeft:
                this.width -= x;
                translateX += x;
                break;
            case this.controlGrips.centerRight:
                this.width += x;
                break;
            case this.controlGrips.topCenter:
                this.height -= y;
                translateY += y;
                break;
            case this.controlGrips.bottomCenter:
                this.height += y;
                break;
        }

        if (this.width < this.MIN_SIZE) {
            const offset = this.MIN_SIZE - this.width;
            this.width = this.MIN_SIZE;
            if (translateX !== 0) {
                translateX -= offset;
            }
        }
        if (this.height < this.MIN_SIZE) {
            const offset = this.MIN_SIZE - this.height;
            this.height = this.MIN_SIZE;
            if (translateY !== 0) {
                translateY -= offset;
            }
        }

        if (translateX !== 0 || translateY !== 0) {
            const translate = this.visual.transform.baseVal.getItem(0);
            translate.setMatrix(translate.matrix.translate(translateX, translateY));
            this.visual.transform.baseVal.replaceItem(translate, 0);
        }

        this.adjustControlBox();
    }

    protected onTouch(ev: TouchEvent) {
        super.onTouch(ev);
    }

    private addControlBox = () => {

        this.controlBox = SvgHelper.createGroup([["class", "markerjs-rect-control-box"]]);
        const translate = SvgHelper.createTransform();
        translate.setTranslate(-this.CB_DISTANCE / 2, -this.CB_DISTANCE / 2);
        this.controlBox.transform.baseVal.appendItem(translate);

        this.addToVisual(this.controlBox);

        this.controlRect = SvgHelper.createRect(
            this.width + this.CB_DISTANCE,
            this.height + this.CB_DISTANCE,
            [["class", "markerjs-rect-control-rect"]]);

        this.controlBox.appendChild(this.controlRect);

        this.controlGrips = new RectangularMarkerGrips();
        this.addControlGrips();
    }

    private adjustControlBox = () => {
        this.controlRect.setAttribute("width", (this.width + this.CB_DISTANCE).toString());
        this.controlRect.setAttribute("height", (this.height + this.CB_DISTANCE).toString());

        this.positionGrips();
    }

    private addControlGrips = () => {
        this.controlGrips.topLeft = this.createGrip();
        this.controlGrips.topCenter = this.createGrip();
        this.controlGrips.topRight = this.createGrip();
        this.controlGrips.centerLeft = this.createGrip();
        this.controlGrips.centerRight = this.createGrip();
        this.controlGrips.bottomLeft = this.createGrip();
        this.controlGrips.bottomCenter = this.createGrip();
        this.controlGrips.bottomRight = this.createGrip();

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
        const gripSize = this.controlGrips.topLeft.GRIP_SIZE;

        const left = -gripSize / 2;
        const top = left;
        const cx = (this.width + this.CB_DISTANCE) / 2 - gripSize / 2;
        const cy = (this.height + this.CB_DISTANCE) / 2 - gripSize / 2;
        const bottom = this.height + this.CB_DISTANCE - gripSize / 2;
        const right = this.width + this.CB_DISTANCE - gripSize / 2;

        this.positionGrip(this.controlGrips.topLeft.visual, left, top);
        this.positionGrip(this.controlGrips.topCenter.visual, cx, top);
        this.positionGrip(this.controlGrips.topRight.visual, right, top);
        this.positionGrip(this.controlGrips.centerLeft.visual, left, cy);
        this.positionGrip(this.controlGrips.centerRight.visual, right, cy);
        this.positionGrip(this.controlGrips.bottomLeft.visual, left, bottom);
        this.positionGrip(this.controlGrips.bottomCenter.visual, cx, bottom);
        this.positionGrip(this.controlGrips.bottomRight.visual, right, bottom);
    }

    private positionGrip = (grip: SVGGraphicsElement, x: number, y: number) => {
        const translate = grip.transform.baseVal.getItem(0);
        translate.setTranslate(x, y);
        grip.transform.baseVal.replaceItem(translate, 0);
    }

    private gripMouseDown = (ev: MouseEvent) => {
        this.isResizing = true;
        this.activeGrip = this.controlGrips.findGripByVisual(ev.target as SVGGraphicsElement);
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
            this.manipulate(ev);
        }
    }

}
