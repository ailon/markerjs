export default interface Config {
  // root element of the target's DOM - document.body by default
  targetRoot?: HTMLElement; 
  renderAtNaturalSize?: boolean;
  markerColors?: MarkerColors;
  renderImageType?: string;
  renderImageQuality?: number;
  renderMarkersOnly?: boolean
}

export interface MarkerColors {
  mainColor: string;
  highlightColor: string;
  coverColor: string;
}