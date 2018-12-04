export class Renderer {
    public rasterize(target: HTMLImageElement, markerImage: SVGSVGElement, done: (dataUrl: string) => void) {
        const canvas = document.createElement("canvas");
        canvas.width = markerImage.width.baseVal.value;
        canvas.height = markerImage.height.baseVal.value;

        const data = markerImage.outerHTML;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(target, 0, 0, canvas.width, canvas.height);

        const DOMURL = window.URL; // || window.webkitURL || window;

        const img = new Image(canvas.width, canvas.height);
        img.setAttribute("crossOrigin", "anonymous");

        const blob = new Blob([data], { type: "image/svg+xml" });

        const url = DOMURL.createObjectURL(blob);

        img.onload = () => {
            ctx.drawImage(img, 0, 0);
            DOMURL.revokeObjectURL(url);

            done(canvas.toDataURL("image/png"));
        };

        img.src = url;
    }
}
