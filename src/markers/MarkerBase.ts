import { SvgHelper } from "../helpers/SvgHelper";
import { MarkerBaseState } from "./MarkerBaseState";

export class MarkerBase {
    public static createMarker = (): MarkerBase => {
        const marker = new MarkerBase();
        marker.setup();
        return marker;
    }

    public markerTypeName: string = "MarkerBase";

    public visual: SVGGElement;
    public renderVisual: SVGGElement;

    public onSelected: (marker: MarkerBase) => void;

    public defs: SVGElement[] = [];

    protected width: number = 200;
    protected height: number = 50;

    protected isActive: boolean = true;
    protected isResizing: boolean = false;

    protected previousMouseX: number = 0;
    protected previousMouseY: number = 0;

    protected previousState: MarkerBaseState;

    private isDragging: boolean = false;

    // constructor() {
    // }

    public manipulate = (ev: MouseEvent) => {
        let scale: number;
        // Prefer getting the scale from the markerArea
        const markerArea = this.visual.closest("div");
        if (markerArea && markerArea.style) {
            const transform = markerArea.style.transform;
            if (transform && transform.includes("scale(")) {
                scale = parseFloat(transform.replace("scale(", "").replace(")", ""));
            }
        }
        if (!scale) {
            // As fallback try to get scale from getScreenCTM
            // because on Firefox it always returns 1, see http://jsfiddle.net/ps_svg/4x73N/
            scale = this.visual.getScreenCTM().a || 1;
        }

        // Prefer screenX (over offsetX) as it works also in Firefox
        // Apply scale in case the markerArea was resized
        const dx = (ev.screenX - this.previousMouseX) / scale;
        const dy = (ev.screenY - this.previousMouseY) / scale;

        if (this.isDragging) {
            this.move(dx, dy);
        }
        if (this.isResizing) {
            this.resize(dx, dy);
        }
    }

    public endManipulation() {
        this.isDragging = false;
        this.isResizing = false;
    }

    public select() {
        this.isActive = true;
        if (this.onSelected) {
            this.onSelected(this);
        }
        return;
    }

    public deselect() {
        this.isActive = false;
        this.endManipulation();
        return;
    }

    public getState(): MarkerBaseState {
        const config: MarkerBaseState = {
            markerType: this.markerTypeName,
            width: this.width,
            height: this.height,
            translateX: this.visual.transform.baseVal.getItem(0).matrix.e,
            translateY: this.visual.transform.baseVal.getItem(0).matrix.f,
        };

        return config;
    }

    public restoreState(state: MarkerBaseState) {
        this.width = state.width;
        this.height = state.height;

        this.resize(state.width, state.height);

        const translate = this.visual.transform.baseVal.getItem(0);
        translate.matrix.e = state.translateX;
        translate.matrix.f = state.translateY;
        this.visual.transform.baseVal.replaceItem(translate, 0);
    }

    protected setup() {
        this.visual = SvgHelper.createGroup();
        // translate
        this.visual.transform.baseVal.appendItem(SvgHelper.createTransform());

        this.visual.addEventListener("mousedown", this.mouseDown);
        this.visual.addEventListener("mouseup", this.mouseUp);
        this.visual.addEventListener("mousemove", this.mouseMove);
        this.visual.addEventListener("touchstart", this.onTouch, { passive: false });
        this.visual.addEventListener("touchend", this.onTouch, { passive: false });
        this.visual.addEventListener("touchmove", this.onTouch, { passive: false });

        this.renderVisual = SvgHelper.createGroup([["class", "render-visual"]]);
        this.visual.appendChild(this.renderVisual);
    }

    protected addToVisual = (el: SVGElement) => {
        this.visual.appendChild(el);
    }

    protected addToRenderVisual = (el: SVGElement) => {
        this.renderVisual.appendChild(el);
    }

    protected resize(x: number, y: number) {
        return;
    }

    protected onTouch(ev: TouchEvent) {
        ev.preventDefault();
        const newEvt = document.createEvent("MouseEvents");
        const touch = ev.changedTouches[0];
        let type = null;

        switch (ev.type) {
          case "touchstart":
            type = "mousedown";
            break;
          case "touchmove":
            type = "mousemove";
            break;
          case "touchend":
            type = "mouseup";
            break;
        }

        newEvt.initMouseEvent(type, true, true, window, 0,
            touch.screenX, touch.screenY, touch.clientX, touch.clientY,
            ev.ctrlKey, ev.altKey, ev.shiftKey, ev.metaKey, 0, null);
        ev.target.dispatchEvent(newEvt);
    }

    private mouseDown = (ev: MouseEvent) => {
        ev.stopPropagation();
        this.select();
        this.isDragging = true;
        this.previousMouseX = ev.screenX;
        this.previousMouseY = ev.screenY;
        this.previousState = this.getState();
    }
    private mouseUp = (ev: MouseEvent) => {
        ev.stopPropagation();
        this.endManipulation();
    }
    private mouseMove = (ev: MouseEvent) => {
        ev.stopPropagation();
        this.manipulate(ev);
    }

    private move = (dx: number, dy: number) => {
        const previousX = this.previousState ? this.previousState.translateX : 0;
        const previousY = this.previousState ? this.previousState.translateY : 0;

        const translate = this.visual.transform.baseVal.getItem(0);
        translate.setTranslate(previousX + dx, previousY + dy);
        this.visual.transform.baseVal.replaceItem(translate, 0);
    }
}
