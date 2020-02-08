import { MarkerBaseState } from './markers/MarkerBaseState';
import { MarkerBase } from './markers/MarkerBase';

export class MarkerAreaState {
  constructor(markers?: MarkerBase[]) {
    if (markers) {
      this.markers = [];
      markers.forEach(m => this.markers.push(m.getState()))
    }
  }

  public markers?: MarkerBaseState[];

  public getJSON(): string {
    return JSON.stringify(this);
  }
}