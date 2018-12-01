import { ToolbarItem } from "../../toolbar/ToolbarItem";
import { ArrowMarker } from "./ArrowMarker";

import Icon from "./arrow-marker-toolbar-icon.svg";

export class ArrowMarkerToolbarItem implements ToolbarItem {
    public name = "arrow-marker";
    public tooltipText = "Arrow";

    public icon = Icon;
    public markerType = ArrowMarker;
}
