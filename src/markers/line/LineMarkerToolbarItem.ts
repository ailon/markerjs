import { ToolbarItem } from "../../toolbar/ToolbarItem";
import { LineMarker } from "./LineMarker";

import Icon from "./line-marker-toolbar-icon.svg";

export class LineMarkerToolbarItem implements ToolbarItem {
    public name = "line-marker";
    public tooltipText = "Line";

    public icon = Icon;
    public markerType = LineMarker;
}
