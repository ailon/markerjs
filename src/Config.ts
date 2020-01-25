export default interface Config {
  // root element of the target's DOM - document.body by default
  targetRoot?: HTMLElement; 
  renderAtNaturalSize?: boolean;
  markerColors?: MarkerColors;
  renderImageType?: string;
  renderImageQuality?: number;
}

export interface MarkerColors {
  mainColor: string;
  highlightColor: string;
  coverColor: string;
}