import BoatTour from "./main";
import { default as Stage } from "./lib/stage.js";

window.addEventListener("DOMContentLoaded", () => {
  new BoatTour(Stage);
});
