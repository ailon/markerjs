import { ToolbarItem } from "../../toolbar/ToolbarItem";
import { CoverMarker } from "./CoverMarker";

import Icon from "./cover-marker-toolbar-icon.svg";

export class CoverMarkerToolbarItem implements ToolbarItem {
    public name = "cover-marker";
    public tooltipText = "Cover";

    public icon = Icon;
    public markerType = CoverMarker;
}
