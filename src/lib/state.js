/**
 * @description Holds state information and global functions related to state
 * @class State
 */
class State {
  constructor() {
    this.offset = {};
    this.station = {
      history: [],
      last: {},
      current: {}
    };
    this.boat = {
      from: { x: 0, y: 0 },
      to: { x: 0, y: 0 },
      angle: 0,
      angleDiff: 0,

      set: (prop, val) => {
        this.boat[prop] = Object.assign(this.boat[prop], val);
      }
    };
    this.speed = {};
    this.distance = 0;
    this.moving = false;
  }
  /**
   * Lake is not placed at the 0,0 coordinates. SO avoid multiple calculations to
   * find correct position, offest is used
   * @param {{}} newOffset
   */
  setOffset(newOffset) {
    this.offset = Object.assign(this.offset, newOffset);
  }
  /**
   * @description On each change of the the target station, current and last station state saved and last
   * station pushed in to history.
   * It's may also be used to send boat the a destination in the history at the new version of the project :)
   * @param {{}} targetStation
   */
  setStation(targetStation) {
    this.station.history.push(this.station.current);
    this.station.last = this.station.current;
    this.station.current = targetStation;
    const detail = this.station;
    const evt = new CustomEvent("stationstate", { detail });
    window.dispatchEvent(evt);
  }
  /**
   * @description Set speed information of the boat. Not in use at the current version :)
   * @param {number} speed
   */
  setSpeed(speed) {
    this.speed = speed;
  }
  /**
   * @description add current elapsed distance to all distance
   * @param {number} distance
   */
  setDistance(distance) {
    this.distance += distance;
    const evt = new CustomEvent("updatedistance", {
      detail: { distance: this.distance.toString() }
    });
    window.dispatchEvent(evt);
  }

  /**
   * Setter of moving state of the boat
   * @param {Boolean} moving
   */
  setMoving(moving) {
    this.moving = moving;
    const evt = new CustomEvent("movestate", {
      detail: { isMoving: Number(moving).toString() }
    });
    window.dispatchEvent(evt);
  }
  /**
   * @description Creates simple Object from DomRect of the fiven DOM element
   * @param {{}} el DOM Element
   * @param {{}} ext New properties for this elements
   */
  getRectFromElement(el, ext) {
    const rect = el.getBoundingClientRect();

    const elRect = {
      x: Math.round(el.offsetLeft), // rect.x,
      y: Math.round(el.offsetTop), //rect.y,
      width: rect.width,
      height: rect.height,
      left: rect.left,
      top: rect.top,
      id: el.getAttribute("id")
    };

    ext = ext || {};
    return Object.assign(elRect, ext);
  }
}

export default State;
