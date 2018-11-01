/**
 * @description prepare axis and moving point
 * @class Guide
 */
class Guide {
  constructor(container) {
    this.data = {};
    this.axis = document.createElement("div");
    this.point = document.createElement("div");
    this.axis = document.createElement("div");
    this.axis.appendChild(this.point);
    container.appendChild(this.axis);
    this.styleElements();

    this.counter = 0;
  }
  /**
   * @description Prepare invisible guide element
   */
  styleElements() {
    this.axis.style.width = "80px";
    this.axis.style.height = "1px";
    this.axis.style.position = "absolute";
    this.axis.style.left = "0";
    this.axis.style.top = "0";
    this.axis.style.transformOrigin = "left center";

    this.point.style.width = "1px";
    this.point.style.height = "1px";
    this.point.style.position = "absolute";
    this.point.style.left = "0";
  }
  /**
   * @description setter for Rotation angle
   * @param {number} num
   */
  setRotation(num) {
    this.data.from = num;
    this.axis.style.transform = `rotate(${num}deg)`;
  }
  /**
   * Setter for Maximum rotation angle
   * @param {number} num
   */
  setMaxRotation(num) {
    this.data.to = num;
  }
  /**
   * Getter for rotation angle
   */
  getRotation() {
    return this.data.from;
  }

  /**
   * Getter for max rotation angle
   */
  getMaxRotation() {
    return this.data.to;
  }
  /**
   * @description Increses current rotation angle by 1 degree
   * current rotation angle may be positive but the target can be negative,
   * so it should be considered accordingly to calculate increase
   */
  increaseRotation() {
    let r = this.getRotation();
    const max = this.getMaxRotation();

    if (max >= 0) {
      if (r < max) {
        r++;
      }
      if (r > max) {
        r--;
      }
    } else {
      // r--;
      if (r > max) {
        r--;
      }
      if (r < max) {
        r++;
      }
    }
    this.setRotation(r);
    return r;
  }
}

export default Guide;
