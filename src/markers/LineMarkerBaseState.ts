import { MarkerBaseState } from "./MarkerBaseState";

export interface LineMarkerBaseState extends MarkerBaseState {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
