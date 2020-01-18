export { Activator } from "./Activator";
export { MarkerArea } from "./MarkerArea";

export { ArrowMarker } from "./markers/arrow/ArrowMarker";
export { CoverMarker } from "./markers/cover/CoverMarker";
export { HighlightMarker } from "./markers/highlight/HighlightMarker";
export { LineMarker } from "./markers/line/LineMarker";
export { RectMarker } from "./markers/rect/RectMarker";
export { TextMarker } from "./markers/text/TextMarker";
export { EllipseMarker } from "./markers/ellipse/EllipseMarker";

import css from "./assets/style.css";
// toucht CSS to trigger bundling
const style = css;
