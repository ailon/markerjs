import { ToolbarButton } from "./ToolbarButton";
import { ToolbarItem } from "./ToolbarItem";

export class Toolbar {
    private toolbarItems: ToolbarItem[];
    private toolbarUI: HTMLElement;

    private clickHandler: (ev: MouseEvent, toolbarItem: ToolbarItem) => void;

    constructor(
        toolbarItems: ToolbarItem[],
        clickHandler: (ev: MouseEvent, toolbarItem: ToolbarItem) => void) {

        this.toolbarItems = toolbarItems;
        this.clickHandler = clickHandler;
    }

    public getUI = (): HTMLElement => {
        this.toolbarUI = document.createElement("div");
        this.toolbarUI.className = "markerjs-toolbar";

        for (const toolbarItem of this.toolbarItems) {
            const toolbarButton = new ToolbarButton(toolbarItem, this.clickHandler);
            this.toolbarUI.appendChild(toolbarButton.getElement());
        }

        return this.toolbarUI;
    }
}
