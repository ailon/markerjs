import { ToolbarItem } from "../../toolbar/ToolbarItem";
import { EllipseMarker } from "./EllipseMarker";

import Icon from "./ellipse-marker-toolbar-icon.svg";

export class EllipseMarkerToolbarItem implements ToolbarItem {
    public name = "ellipse-marker";
    public tooltipText = "Ellipse";

    public icon = Icon;
    public markerType = EllipseMarker;
}
