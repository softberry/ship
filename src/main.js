import Guide from "./lib/guide";

class BoatTour {
  /**
   * Construct
   * @param  {} Stage name and query for each DOM element which will be used in component.
   */
  constructor(Stage) {
    this.Stage = Stage;
    this.elements = this.getElements();

    this.prepareElements(); // Additional css properties to enable elements to be moved
    this.assignEvents(); // Add events to NavButtons

    this.guide = new Guide(this.elements.lake);
    const dataCurrentPos = this.elements.boat.getBoundingClientRect();
    dataCurrentPos.angle = 0;
    const dataMoveFrom = JSON.stringify(dataCurrentPos);
    this.elements.boat.dataset.movefrom = `${dataMoveFrom}`;
    this.elements.boat.dataset.moveto = `${dataMoveFrom}`;

    const lakePos = this.elements.lake.getBoundingClientRect();

    this.moveBoatTo(
      lakePos.x + lakePos.width / 2,
      lakePos.y + lakePos.height / 2
    );
  }

  /**
   * Collect element information from DOM defined in Stage.
   * Assign each element to {@linkcode this.elements}
   */
  getElements() {
    const myElements = {};

    for (let element in this.Stage) {
      let query = this.Stage[element];
      let el = [...document.querySelectorAll(query)];
      if (el.length === 1) {
        myElements[element.toString()] = el[0];
        //el[0].dataset.rect = JSON.stringify(el[0].getBoundingClientRect());
      } else {
        myElements[element.toString()] = el;
      }
    }
    return myElements;

    // this.elements.boat.style.position = "absolute";
    // this.elements.boat.style.transition = "all 300ms";
  }
  /**
   * Assign click events to each control button `NavButton`
   */
  assignEvents() {
    this.elements.navButtons.forEach((el, i) => {
      const myRect = this.elements.stations[i].getBoundingClientRect();
      const lakePos = this.elements.lake.getBoundingClientRect();
      el.addEventListener(
        "click",
        this.moveBoatTo.bind(this, myRect.x - lakePos.x, myRect.y - lakePos.y)
      );
    });

    this.elements.boat.addEventListener("moveboat", function(e) {
      const to = e.detail;
      e.target.style.left = `${to.x}px`;
      e.target.style.top = `${to.y}px`;
      e.target.style.transform = `rotate(${to.angle}deg)`;
      if (to.stopped) {
        e.target.dataset.movefrom = JSON.stringify(to);
      }
    });
  }
  /**
   * Set initial position, style attributes etc. So boat can be moved in lake
   */
  prepareElements() {
    this.elements.lake.style.position = "relative";
    this.elements.boat.style.position = "absolute";
    this.elements.boat.style.transformOrigin = "20px -50% 0";
  }

  getDistance(p1, p2) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }

  getAngel(p1, p2) {
    // angle in radians
    const angleRadians = Math.atan2(p2.y - p1.y, p2.x - p1.x);
    // angle in degrees
    const angleDeg = (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI;
    // console.log(angleRadians, angleDeg);
    return angleDeg;
  }

  /**
   * Moves boat to a station.
   * As stations are matching index with the NavButtons
   * its enough info to decide what the next statin is.
   *
   * @param  {number} i Index of the station to be driven.
   */
  moveBoatTo(x, y) {
    const shipPos = this.elements.boat.getBoundingClientRect();
    const lakePos = this.elements.lake.getBoundingClientRect();

    const currAngle = this.elements.boat.dataset.moveto.angle || 0;
    const dataMoveFrom = JSON.stringify({
      x: shipPos.x,
      y: shipPos.y,
      angle: currAngle
    });

    this.elements.boat.dataset.movefrom = `${dataMoveFrom}`;

    const angle = this.getAngel({ x: shipPos.x, y: shipPos.y }, { x, y });
    const dataMoveTo = JSON.stringify({ x, y, angle });
    this.elements.boat.dataset.moveto = `${dataMoveTo}`;

    this.stickToShip();
  }

  stickToShip() {
    const stage = this;
    const shipPos = this.elements.boat.getBoundingClientRect();
    const lakePos = this.elements.lake.getBoundingClientRect();
    const axis = this.guide.axis;
    const point = this.guide.point;

    const boat = stage.elements.boat;

    const from = JSON.parse(boat.dataset.movefrom);
    const to = JSON.parse(boat.dataset.moveto);

    clearInterval(this.guide.counter);
    point.style.left = "0";

    axis.style.left = `${from.x + shipPos.width - lakePos.x}px`;
    axis.style.top = `${from.y + shipPos.height / 2 - lakePos.y}px`;

    axis.style.width = this.getDistance(
      { x: from.x, y: from.y },
      { x: to.x, y: to.y }
    );

    this.guide.setRotation(from.angle);
    this.guide.setMaxRotation(to.angle);

    this.guide.counter = window.setInterval(this.rotateTo.bind(this), 40);
  }

  positionEvent(stopped = false) {
    const point = this.guide.point;
    const pointPos = point.getBoundingClientRect();
    const lakePos = this.elements.lake.getBoundingClientRect();
    let evt = new CustomEvent("moveboat", {
      detail: {
        x: pointPos.x - lakePos.x,
        y: pointPos.y - lakePos.y,
        angle: this.guide.increaseRotation(),
        stopped
      }
    });

    this.elements.boat.dispatchEvent(evt);
  }

  rotateTo() {
    const point = this.guide.point;

    const x = parseInt(point.style.left) + 1;

    if (x >= parseInt(this.guide.axis.style.width)) {
      clearInterval(this.guide.counter);
      this.positionEvent(true);
      point.style.left = "0";
      return;
    }
    point.style.left = `${x}px`;
    this.positionEvent(false);
  }
}
export default BoatTour;
