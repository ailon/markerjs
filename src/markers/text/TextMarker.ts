import { SvgHelper } from "../../helpers/SvgHelper";
import { RectangularMarkerBase } from "../RectangularMarkerBase";

export class TextMarker extends RectangularMarkerBase {
    public static createMarker = (): TextMarker => {
        const marker = new TextMarker();
        marker.setup();
        return marker;
    }

    protected readonly MIN_SIZE = 50;

    private isNew = true;
    private text: string = `Start typing...`;
    private textElement: SVGTextElement;

    protected setup() {
        super.setup();
        this.textElement = SvgHelper.createText();
        this.addToRenderVisual(this.textElement);
        SvgHelper.setAttributes(this.visual, [["class", "text-marker"]]);

        this.textElement.transform.baseVal.appendItem(SvgHelper.createTransform()); // translate transorm
        this.textElement.transform.baseVal.appendItem(SvgHelper.createTransform()); // scale transorm

        this.renderText();

        document.addEventListener("keydown", this.keyDown);
        document.addEventListener("keyup", this.keyUp);
        document.addEventListener("keypress", this.keyPress);
    }

    protected resize(x: number, y: number) {
        super.resize(x, y);
        this.sizeText();
    }

    private renderText = () => {
        const LINE_SIZE = "1.2em";

        while (this.textElement.lastChild) {
            this.textElement.removeChild(this.textElement.lastChild);
        }

        const lines = this.text.split(/\r\n|[\n\v\f\r\x85\u2028\u2029]/);
        for (let line of lines) {
            if (line.trim() === "") {
                line = " "; // workaround for swallowed empty lines
            }
            this.textElement.appendChild(SvgHelper.createTSpan(line, [["x", "0"], ["dy", LINE_SIZE]]));
        }

        setTimeout(this.sizeText, 10);
    }

    private sizeText = () => {
        const textSize = this.textElement.getBBox();
        let x = 0;
        let y = 0;
        let scale = 1.0;
        if (textSize.width > 0 && textSize.height > 0) {
            const xScale = this.width * 1.0 / textSize.width;
            const yScale = this.height * 1.0 / textSize.height;
            scale = Math.min(xScale, yScale);

            x = (this.width - textSize.width * scale) / 2;
            y = (this.height - textSize.height * scale) / 2;
        }

        this.textElement.transform.baseVal.getItem(0).setTranslate(x, y);
        this.textElement.transform.baseVal.getItem(1).setScale(scale, scale);
    }

    private keyEntered = () => {
        if (this.isNew) {
            this.text = "";
            this.isNew = false;
        }
    }

    private keyDown = (ev: KeyboardEvent) => {
        if (this.isActive) {
            if (ev.keyCode === 13) {
                ev.preventDefault();
                this.keyEntered();
                this.text += `\n`;
                this.isNew = false;
                this.renderText();
            } else if (ev.key === "Backspace") {
                ev.preventDefault();
                this.keyEntered();
                if (this.text.length > 0) {
                    this.text = this.text.substr(0, this.text.length - 1);
                    this.renderText();
                }
            }
        }
    }

    private keyUp = (ev: KeyboardEvent) => {
        // if (this.isActive && ev.key === "Backspace") {
        //     ev.preventDefault();
        //     this.keyEntered();
        //     if (this.text.length > 0) {
        //         this.text = this.text.substr(0, this.text.length - 1);
        //         this.renderText();
        //     }
        // }
    }

    private keyPress = (ev: KeyboardEvent) => {
        if (this.isActive) {
            ev.preventDefault();
            this.keyEntered();
            this.text += ev.key;
            this.renderText();
        }
    }
}
