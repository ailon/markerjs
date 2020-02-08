import { SvgHelper } from "../../helpers/SvgHelper";
import { RectMarkerBase } from "../RectMarkerBase";

export class HighlightMarker extends RectMarkerBase {
    public static createMarker = (): RectMarkerBase => {
        const marker = new HighlightMarker();
        marker.setup();
        return marker;
    }

    constructor() {
        super();
        this.markerTypeName = 'HighlightMarker';
    }

    protected setup() {
        super.setup();
        SvgHelper.setAttributes(this.visual, [["class", "highlight-marker"]]);
    }

}
