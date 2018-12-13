import { ResizeGrip } from "./ResizeGrip";

export class RectangularMarkerGrips {
    /* tslint:disable:object-literal-sort-keys */
    public topLeft: ResizeGrip;
    public topCenter: ResizeGrip;
    public topRight: ResizeGrip;
    public centerLeft: ResizeGrip;
    public centerRight: ResizeGrip;
    public bottomLeft: ResizeGrip;
    public bottomCenter: ResizeGrip;
    public bottomRight: ResizeGrip;

    public findGripByVisual = (gripVisual: SVGGraphicsElement) => {
        switch (gripVisual) {
            case this.topLeft.visual:
                return this.topLeft;
            case this.topCenter.visual:
                return this.topCenter;
            case this.topRight.visual:
                return this.topRight;
            case this.centerLeft.visual:
                return this.centerLeft;
            case this.centerRight.visual:
                return this.centerRight;
            case this.bottomLeft.visual:
                return this.bottomLeft;
            case this.bottomCenter.visual:
                return this.bottomCenter;
            case this.bottomRight.visual:
                return this.bottomRight;
        }
    }
}
