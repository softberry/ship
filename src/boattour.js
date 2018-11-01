/**
 * @description BoatTour class is the mainconstructor of the project.
 * @class BoatTour
 */

import Guide from "./lib/guide";

class BoatTour {
  constructor(Stage, State) {
    this.stage = Stage;
    this.state = State;

    this.elements = this.getElements();

    this.prepareElements(); // Additional css properties to enable elements to be moved

    this.guide = new Guide(this.elements.lake);

    const offset = State.getRectFromElement(this.elements.lake);
    State.setOffset(offset, {});

    this.state.boat.from = this.state.getRectFromElement(this.elements.boat, {
      angle: 0,
      moving: false
    });
    this.state.boat.from.x = 0;
    this.state.boat.from.y = 0;

    this.state.boat.to = this.state.getRectFromElement(this.elements.boat, {
      angle: 0,
      moving: false
    });

    this.assignEvents(); // Add events to NavButtons
    this.moveToCenter();
  }

  /**
   * @description Move the boat the center of the lake initially
   * creates a div in the middle of the stage, so the boat can be simply targeted to this position
   *  like other stations in the lake
   */
  moveToCenter() {
    const center = document.createElement("div");
    center.style.left = `${this.state.offset.width * 0.5}px`;
    center.style.top = `${this.state.offset.height * 0.5}px`;
    center.style.position = "relative";
    center.style.width = "10px";
    center.style.height = "10px";
    center.setAttribute("id", "center");
    this.elements.lake.appendChild(center);
    center.addEventListener("click", e => {
      this.moveBoatTo(center, { x: -5, y: -5 });
    });
    center.click();
  }
  /**
   * Initially collect all DOM elements (items in the lake) to reuse it during the
   * life time of the project
   */
  getElements() {
    const myElements = {};

    for (let element in this.stage) {
      let query = this.stage[element];
      let el = [...document.querySelectorAll(query)];
      if (el.length === 1) {
        myElements[element.toString()] = el[0];
      } else {
        myElements[element.toString()] = el;
      }
    }

    return myElements;
  }
  /**
   * Assign click events to each control button `NavButton`
   */
  assignEvents() {
    this.elements.navButtons.forEach((el, i) => {
      const targetStation = this.elements.stations[i];
      this.elements.stations[i].id = i + 1; // station ID
      const correction = [
        { x: 40, y: 0 },
        { x: -40, y: 0 },
        { x: 0, y: 40 },
        { x: 0, y: -40 }
      ];

      el.addEventListener(
        "click",
        this.moveBoatTo.bind(this, targetStation, correction[i])
      );
    });

    this.elements.boat.addEventListener("moveboat", function(e) {
      const to = e.detail;
      e.target.style.top = `${to.y}px`;
      e.target.style.left = `${to.x}px`;
      e.target.style.transform = `rotate(${to.angle}deg)`;
    });

    window.addEventListener("movestate", e => {
      this.elements.moving.innerText = e.detail.isMoving;
      if (e.detail.isMoving === "1") {
        this.elements.navButtons.forEach(btn => {
          btn.setAttribute("disabled", "disabled");
          btn.style.opacity = ".2";
        });
      } else {
        this.elements.navButtons.forEach((btn, i) => {
          if ((i + 1).toString() !== this.state.station.current.id) {
            btn.removeAttribute("disabled");
            btn.style.opacity = "1";
          }
        });
      }
    });
    window.addEventListener("stationstate", e => {
      this.elements.lastStation.innerText = e.detail.current.id;
    });
    window.addEventListener("updatedistance", e => {
      this.elements.distance.innerText = `${e.detail.distance}px`;
    });
  }

  /**
   * Set initial position, style attributes etc. So boat can be moved in lake
   */
  prepareElements() {
    this.elements.lake.style.position = "relative";
    this.elements.boat.style.position = "absolute";
    this.elements.boat.style.transformOrigin = "center center";
  }
  /**
   *
   * @param {{}} p1 From point (x1,y1)
   * @param {{}} p2 To point (x2,y2)
   * @returns {number} Distance between from and to points in pixles
   */
  getDistance(p1, p2) {
    return Math.round(
      Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
    );
  }

  /**
   *
   * @param {{}} p1 From point (x1,y1)
   * @param {{}} p2 To point (x2,y2)
   * @returns {number} Angle in degrees for the line between from and to points to the x axis.
   */
  getAngle(p1, p2) {
    // angle in degrees
    const angleDeg = (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI;

    return Math.round(angleDeg);
  }
  /**
   * Convert target DOM element to destination object
   * @param {{}} target DOM object of this.elements
   * @param {{}} correction Coordinations should be correceted for each station
   */
  moveBoatTo(target, correction) {
    target = this.state.getRectFromElement(target);
    const x = target.x + correction.x;
    const y = target.y + correction.y;

    let angle = this.getAngle(this.state.boat.from, { x, y });

    this.state.boat.set("to", { x, y, angle });
    this.state.setMoving(true);
    this.state.setStation(target);
    this.stickToShip();
  }
  /**
   * To set Boats movements more realistic, it needs to be calculate rotation angle on an axis
   */
  stickToShip() {
    const axis = this.guide.axis;
    const point = this.guide.point;

    clearInterval(this.guide.counter);
    point.style.left = "0";
    axis.style.left = `${this.state.boat.from.x}px`;
    axis.style.top = `${this.state.boat.from.y}px`;

    axis.style.width = this.getDistance(
      { x: this.state.boat.from.x, y: this.state.boat.from.y },
      { x: this.state.boat.to.x, y: this.state.boat.to.y }
    );

    this.guide.setRotation(this.state.boat.from.angle);
    this.guide.setMaxRotation(this.state.boat.to.angle);

    this.guide.counter = window.setInterval(this.rotateTo.bind(this), 10);
  }

  /**
   * Every given milisecond, updates Boats position to let it arrive to target destination
   */
  rotateTo() {
    const point = this.guide.point;

    let x = parseInt(point.style.left) + 1;
    const max = parseInt(this.guide.axis.style.width);
    x = x <= max ? x : max;

    if (this.guide.getRotation() === this.guide.getMaxRotation() && x === max) {
      clearInterval(this.guide.counter);

      this.state.setMoving(false);
      this.positionEvent();
      return;
    }
    point.style.left = `${x}px`;
    this.state.setMoving(true);
    this.positionEvent();
  }

  /**
   * Move boat on the axis
   */
  positionEvent() {
    const point = this.guide.point;
    const pointPos = point.getBoundingClientRect();

    const detail = Object.assign(this.state.boat.to, {
      x: this.state.moving
        ? pointPos.x - this.state.offset.x
        : this.state.boat.to.x,
      y: this.state.moving
        ? pointPos.y - this.state.offset.y
        : this.state.boat.to.y,
      angle: this.guide.increaseRotation()
    });

    const distance = this.getDistance(
      { x: this.elements.boat.offsetLeft, y: this.elements.boat.offsetTop },
      this.state.boat.to
    );

    this.state.setDistance(distance);

    let evt = new CustomEvent("moveboat", { detail });

    if (!this.state.moving) {
      this.state.boat.set("from", this.state.boat.to);
    }

    this.elements.boat.dispatchEvent(evt);
  }
}
export default BoatTour;
