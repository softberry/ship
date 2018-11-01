/**
 * I prefer to use Plain JavaScript, so to keep project entry point as is,
 * I have initialized the project from index.ts file,
 */
/**
 * Import all initially required modules
 */
import BoatTour from "./boattour";
import State from "./lib/state";
import { default as Stage } from "./lib/stage.js";
/**
 * Wait for DOM to be ready
 */
window.addEventListener("DOMContentLoaded", () => {
  new BoatTour(Stage, new State());
});
