import { MarkerBase } from "../markers/MarkerBase";

export interface ToolbarItem {
    name: string;
    tooltipText: string;
    icon?: string;
    markerType?: typeof MarkerBase;
}
