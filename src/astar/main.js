import { Grid } from "./grid.js";
window.addEventListener("load", () => {
  const canvas = document.querySelector("#grid");
  // define what context we are working in
  /** @type {CanvasRenderingContext2D} */
  const ctx = canvas.getContext("2d");

  canvas.height = 1000;
  canvas.width = 1000;

  const gridHeight = 10; // 10 cells height
  const gridWidth = 10; // 10 cells width

  let nodeCoordinates = []

  // get state and edge configuration from input
  document
    .getElementById("updateButton")
    .addEventListener("click", updateGraph);

  function updateGraph() {
    let nodeInput = document.getElementById("nodeInput").value;
    nodeCoordinates = nodeInput.split(";").map((entry) => {
      // x = x-axis coordinate of the rectangle's starting point, in pixels. (top left corner of node)
      // y = y-axis coordinate of the rectangle's starting point, in pixels. (top left corner of node)
      // width = rectangle's width. Positive values are to the right, and negative to the left.
      // height = rectangle's height. Positive values are down, and negative are up.
      let [x, y, width, height] = entry.split(",").map(Number);
      if (isNaN(x) || isNaN(y) || isNaN(width) || isNaN(height)) {
        throw new Error("Invalid node input");
      }
      return { x, y, width, height };
    });

    console.log("updateGraph main, nodeCoords: ", nodeCoordinates);

    // GRID
    let grid = new Grid(ctx, gridWidth, gridHeight, nodeCoordinates); // Create the grid

    // draw nodes
    redrawGraph(nodeCoordinates);
    
  }

  // Function to draw the graph
  function redrawGraph(nodes) {
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    nodes.forEach((node) => drawNode(node));

    // edges.forEach((edge, index) => {}); // draw edges
  }

  function drawNode(node) {
    const { x, y, width, height } = node;
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, [15]);
    ctx.stroke();
  }
});
