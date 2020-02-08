import { SvgHelper } from "../../helpers/SvgHelper";
import { RectMarkerBase } from "../RectMarkerBase";

export class RectMarker extends RectMarkerBase {
    public static createMarker = (): RectMarkerBase => {
        const marker = new RectMarker();
        marker.setup();
        return marker;
    }

    constructor() {
        super();
        this.markerTypeName = 'RectMarker';
    }

    protected setup() {
        super.setup();
        SvgHelper.setAttributes(this.visual, [["class", "rect-marker"]]);
    }

}
