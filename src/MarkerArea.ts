import { Activator } from "./Activator";
import { SvgHelper } from "./helpers/SvgHelper";
import { Renderer } from "./Renderer";
import { Toolbar } from "./toolbar/Toolbar";
import { ToolbarItem } from "./toolbar/ToolbarItem";

import { MarkerBase } from "./markers/MarkerBase";

import { ArrowMarkerToolbarItem } from "./markers/arrow/ArrowMarkerToolbarItem";
import { CoverMarkerToolbarItem } from "./markers/cover/CoverMarkerToolbarItem";
import { HighlightMarkerToolbarItem } from "./markers/highlight/HighlightMarkerToolbarItem";
import { LineMarkerToolbarItem } from "./markers/line/LineMarkerToolbarItem";
import { RectMarkerToolbarItem } from "./markers/rect/RectMarkerToolbarItem";
import { TextMarkerToolbarItem } from "./markers/text/TextMarkerToolbarItem";

import OkIcon from "./assets/core-toolbar-icons/check.svg";
import DeleteIcon from "./assets/core-toolbar-icons/eraser.svg";
import PointerIcon from "./assets/core-toolbar-icons/mouse-pointer.svg";
import CloseIcon from "./assets/core-toolbar-icons/times.svg";

import Logo from "./assets/markerjs-logo-m.svg";

export class MarkerArea {
    private target: HTMLImageElement;
    private markerImage: SVGSVGElement;
    private markerImageHolder: HTMLDivElement;
    private defs: SVGDefsElement;

    private targetRect: ClientRect;
    private width: number;
    private height: number;

    private markers: MarkerBase[];
    private activeMarker: MarkerBase;

    private toolbar: Toolbar;
    private toolbarUI: HTMLElement;

    private logoUI: HTMLElement;

    private completeCallback: (dataUrl: string) => void;
    private cancelCallback: () => void;

    private toolbars: ToolbarItem[] = [
        {
            icon: PointerIcon,
            name: "pointer",
            tooltipText: "Pointer",
        },
        {
            icon: DeleteIcon,
            name: "delete",
            tooltipText: "Delete",
        },
        {
            name: "separator",
            tooltipText: "",
        },
        new RectMarkerToolbarItem(),
        new CoverMarkerToolbarItem(),
        new HighlightMarkerToolbarItem(),
        new LineMarkerToolbarItem(),
        new ArrowMarkerToolbarItem(),
        new TextMarkerToolbarItem(),
        {
            name: "separator",
            tooltipText: "",
        },
        {
            icon: OkIcon,
            name: "ok",
            tooltipText: "OK",
        },
        {
            icon: CloseIcon,
            name: "close",
            tooltipText: "Close",
        },
    ];

    private scale = 1.0;

    constructor(target: HTMLImageElement) {
        this.target = target;
        this.width = target.clientWidth;
        this.height = target.clientHeight;

        this.markers = [];
        this.activeMarker = null;
    }

    public show = (completeCallback: (dataUrl: string) => void, cancelCallback?: () => void) => {
        this.completeCallback = completeCallback;
        this.cancelCallback = cancelCallback;

        this.open();

        this.showUI();
    }

    public open = () => {
        this.setTargetRect();

        this.initMarkerCanvas();
        this.attachEvents();
        this.setStyles();
        if (!Activator.isLicensed) {
            this.adLogo();
        }

        window.addEventListener("resize", this.adjustUI);
    }

    public render = (completeCallback: (dataUrl: string) => void, cancelCallback?: () => void) => {
        this.completeCallback = completeCallback;
        this.cancelCallback = cancelCallback;

        this.selectMarker(null);
        this.startRender(this.renderFinished);
    }

    public close = () => {
        if (this.toolbarUI) {
            document.body.removeChild(this.toolbarUI);
        }
        if (this.markerImage) {
            document.body.removeChild(this.markerImageHolder);
        }
        if (this.logoUI) {
            document.body.removeChild(this.logoUI);
        }
    }

    public addMarker = (markerType: typeof MarkerBase) => {
        const marker = markerType.createMarker();
        marker.onSelected = this.selectMarker;

        if (marker.defs && marker.defs.length > 0) {
            for (const d of marker.defs) {
                if (d.id && !this.markerImage.getElementById(d.id)) {
                    this.defs.appendChild(d);
                }
            }
        }

        this.markers.push(marker);
        this.selectMarker(marker);

        this.markerImage.appendChild(marker.visual);

        const bbox = marker.visual.getBBox();
        const x = this.width / 2 / this.scale - bbox.width / 2;
        const y = this.height / 2 / this.scale - bbox.height / 2;

        const translate = marker.visual.transform.baseVal.getItem(0);
        translate.setMatrix(translate.matrix.translate(x, y));
        marker.visual.transform.baseVal.replaceItem(translate, 0);
    }

    public deleteActiveMarker = () => {
        if (this.activeMarker) {
            this.deleteMarker(this.activeMarker);
        }
    }

    private setTargetRect = () => {
        const targetRect = this.target.getBoundingClientRect() as DOMRect;
        const bodyRect = document.body.parentElement.getBoundingClientRect();
        this.targetRect = { left: (targetRect.left - bodyRect.left),
            top: (targetRect.top - bodyRect.top) } as ClientRect;

    }

    private startRender = (done: (dataUrl: string) => void) => {
        const renderer = new Renderer();
        renderer.rasterize(this.target, this.markerImage, done);
    }

    private attachEvents = () => {
        this.markerImage.addEventListener("mousedown", this.mouseDown);
        this.markerImage.addEventListener("mousemove", this.mouseMove);
        this.markerImage.addEventListener("mouseup", this.mouseUp);
    }

    private mouseDown = (ev: MouseEvent) => {
        /* tslint:disable:no-bitwise */
        if (this.activeMarker && (ev.buttons & 1) > 0) {
            this.activeMarker.deselect();
            this.activeMarker = null;
        }
    }

    private mouseMove = (ev: MouseEvent) => {
        /* tslint:disable:no-bitwise */
        if (this.activeMarker && (ev.buttons & 1) > 0) {
            this.activeMarker.manipulate(ev);
        }
    }

    private mouseUp = (ev: MouseEvent) => {
        if (this.activeMarker) {
            this.activeMarker.endManipulation();
        }
    }

    private initMarkerCanvas = () => {
        this.markerImageHolder = document.createElement("div");
        // fix for Edge's touch behavior
        this.markerImageHolder.style.setProperty("touch-action", "none");
        this.markerImageHolder.style.setProperty("-ms-touch-action", "none");

        this.markerImage = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.markerImage.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        this.markerImage.setAttribute("width", this.width.toString());
        this.markerImage.setAttribute("height", this.height.toString());
        this.markerImage.setAttribute("viewBox", "0 0 " + this.width.toString() + " " + this.height.toString());

        this.markerImageHolder.style.position = "absolute";
        this.markerImageHolder.style.width = `${this.width}px`;
        this.markerImageHolder.style.height = `${this.height}px`;
        this.markerImageHolder.style.transformOrigin = "top left";
        this.positionMarkerImage();

        this.defs = SvgHelper.createDefs();
        this.markerImage.appendChild(this.defs);

        this.markerImageHolder.appendChild(this.markerImage);

        document.body.appendChild(this.markerImageHolder);
    }

    private adjustUI = (ev: UIEvent) => {
        this.adjustSize();
        this.positionUI();
    }

    private adjustSize = () => {
        this.width = this.target.clientWidth;
        this.height = this.target.clientHeight;

        const scale = this.target.clientWidth / this.markerImageHolder.clientWidth;
        if (scale !== 1.0) {
            this.scale *= scale;
            this.markerImageHolder.style.width = `${this.width}px`;
            this.markerImageHolder.style.height = `${this.height}px`;

            this.markerImageHolder.style.transform = `scale(${this.scale})`;
        }

    }

    private positionUI = () => {
        this.setTargetRect();
        this.positionMarkerImage();
        this.positionToolbar();
        if (this.logoUI) {
            this.positionLogo();
        }
    }

    private positionMarkerImage = () => {
        this.markerImageHolder.style.top = this.targetRect.top + "px";
        this.markerImageHolder.style.left = this.targetRect.left + "px";
    }

    private positionToolbar = () => {
        this.toolbarUI.style.left = `${(this.targetRect.left
            + this.target.offsetWidth - this.toolbarUI.clientWidth)}px`;
        this.toolbarUI.style.top = `${this.targetRect.top - this.toolbarUI.clientHeight}px`;
    }

    private showUI = () => {
        this.toolbar = new Toolbar(this.toolbars, this.toolbarClick);
        this.toolbarUI = this.toolbar.getUI();
        document.body.appendChild(this.toolbarUI);
        this.toolbarUI.style.position = "absolute";
        this.positionToolbar();
    }

    private setStyles = () => {
        const editorStyleSheet = document.createElementNS("http://www.w3.org/2000/svg", "style");
        editorStyleSheet.innerHTML = `
            .rect-marker .render-visual {
                stroke: #ff0000;
                stroke-width: 3;
                fill: transparent;
            }
            .cover-marker .render-visual {
                stroke-width: 0;
                fill: #000000;
            }
            .highlight-marker .render-visual {
                stroke: transparent;
                stroke-width: 0;
                fill: #ffff00;
                fill-opacity: 0.4;
            }
            .line-marker .render-visual {
                stroke: #ff0000;
                stroke-width: 3;
                fill: transparent;
            }
            .arrow-marker .render-visual {
                stroke: #ff0000;
                stroke-width: 3;
                fill: transparent;
            }
            .arrow-marker-tip {
                stroke-width: 0;
                fill: #ff0000;
            }
            .text-marker text {
                fill: #ff0000;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
                    Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji",
                    "Segoe UI Emoji", "Segoe UI Symbol";
            }
            .markerjs-rect-control-box .markerjs-rect-control-rect {
                stroke: black;
                stroke-width: 1;
                stroke-opacity: 0.5;
                stroke-dasharray: 3, 2;
                fill: transparent;
            }
            .markerjs-control-grip {
                fill: #cccccc;
                stroke: #333333;
                stroke-width: 2;
            }
        `;

        this.markerImage.appendChild(editorStyleSheet);
    }

    private toolbarClick = (ev: MouseEvent, toolbarItem: ToolbarItem) => {
        if (toolbarItem.markerType) {
            this.addMarker(toolbarItem.markerType);
        } else {
            // command button
            switch (toolbarItem.name) {
                case "delete": {
                    this.deleteActiveMarker();
                    break;
                }
                case "pointer": {
                    if (this.activeMarker) {
                        this.selectMarker(null);
                    }
                    break;
                }
                case "close": {
                    this.cancel();
                    break;
                }
                case "ok": {
                    this.complete();
                    break;
                }
            }
        }
    }

    private selectMarker = (marker: MarkerBase) => {
        if (this.activeMarker && this.activeMarker !== marker) {
            this.activeMarker.deselect();
        }
        this.activeMarker = marker;
    }

    private deleteMarker = (marker: MarkerBase) => {
        this.markerImage.removeChild(marker.visual);
        if (this.activeMarker === marker) {
            this.activeMarker = null;
        }
        this.markers.splice(this.markers.indexOf(marker), 1);
    }

    private complete = () => {
        this.selectMarker(null);
        this.startRender(this.renderFinishedClose);
    }

    private cancel = () => {
        this.close();
        if (this.cancelCallback) {
            this.cancelCallback();
        }
    }

    private renderFinished = (dataUrl: string) => {
        this.completeCallback(dataUrl);
    }

    private renderFinishedClose = (dataUrl: string) => {
        this.close();
        this.completeCallback(dataUrl);
    }

    private positionLogo = () => {
        if (this.logoUI) {
            this.logoUI.style.left = `${(this.targetRect.left + 10)}px`;
            this.logoUI.style.top = `${this.targetRect.top + this.target.offsetHeight
                - this.logoUI.clientHeight - 10}px`;
        }
    }

    private adLogo = () => {
        this.logoUI = document.createElement("div");
        this.logoUI.className = "markerjs-logo";

        const link = document.createElement("a");
        link.href = "https://markerjs.com/";
        link.target = "_blank";
        link.innerHTML = Logo;
        link.title = "Powered by marker.js";

        this.logoUI.appendChild(link);

        document.body.appendChild(this.logoUI);

        this.logoUI.style.position = "absolute";
        this.positionLogo();
    }

}
