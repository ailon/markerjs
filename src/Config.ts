import { MarkerAreaState } from './MarkerAreaState';

export default interface Config {
  // root element of the target's DOM - document.body by default
  targetRoot?: HTMLElement; 
  renderAtNaturalSize?: boolean;
  markerColors?: MarkerColors;
  strokeWidth?: number;
  renderImageType?: string;
  renderImageQuality?: number;
  renderMarkersOnly?: boolean;
  previousState?: MarkerAreaState;
}

export interface MarkerColors {
  mainColor: string;
  highlightColor: string;
  coverColor: string;
}