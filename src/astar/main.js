import { Grid } from "./grid.js"
window.addEventListener("load", () => {
  const canvas = document.querySelector("#grid");
  // define what context we are working in
  /** @type {CanvasRenderingContext2D} */
  const ctx = canvas.getContext("2d");

  canvas.height = 1000;
  canvas.width = 1000;

  const gridHeight = 10;
  const gridWidth = 10;

  let grid = new Grid(gridWidth, gridHeight); // Create the grid
  grid.render(ctx); // Render the grid
});
