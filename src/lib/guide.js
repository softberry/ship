class Guide {
  constructor(container) {
    this.axis = document.createElement("div");
    this.point = document.createElement("div");
    this.axis = document.createElement("div");
    this.axis.appendChild(this.point);
    container.appendChild(this.axis);
    this.styleElements();

    this.counter = 0;
  }

  styleElements() {
    this.axis.style.width = "80px";
    this.axis.style.height = "1px";
    this.axis.style.position = "absolute";
    this.axis.style.left = "0";
    this.axis.style.top = "0";
    this.axis.style.backgroundColor = "black";
    this.axis.style.transformOrigin = "left center";
    // this.axis.style.transition = "all 1s";

    this.point.style.width = "1px";
    this.point.style.height = "1px";
    this.point.style.position = "absolute";
    this.point.style.left = "0";
    this.point.style.backgroundColor = "yellow";
  }

  setRotation(num) {
    this.axis.dataset.rotateFrom = num.toString();
    this.axis.style.transform = `rotate(${num}deg)`;
  }

  setMaxRotation(num) {
    this.axis.dataset.rotateTo = num.toString();
  }

  getRotation() {
    return parseFloat(this.axis.dataset.rotateFrom);
  }
  getMaxRotation() {
    return parseFloat(this.axis.dataset.rotateTo);
  }

  increaseRotation() {
    let r = this.getRotation();
    if (r > this.getMaxRotation()) return;
    r++;
    this.setRotation(r);
    return r;
  }
}

export default Guide;
