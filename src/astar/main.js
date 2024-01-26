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

  let grid = new Grid(gridWidth, gridHeight); // Create the grid
  grid.render(ctx); // Render the grid

  // get state and edge configuration from input

  document
    .getElementById("updateButton")
    .addEventListener("click", updateGraph);

  const radiusX = 30;
  const radiusY = 20;

  function drawNode(node) {
    ctx.beginPath();
    ctx.ellipse(node.x, node.y, radiusX, radiusY, 0, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "red";
    ctx.stroke();

    // draw label
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(node.label, node.x, node.y);
  }

  function updateGraph() {
    let nodeInput = document.getElementById("nodeInput").value;
    // let edgeInput = document.getElementById("edgeInput").value;

    let nodes = nodeInput.split(";").map((entry) => {
      let [x, y, label] = entry.split(",");
      x = Number(x);
      y = Number(y);
      if (isNaN(x) || isNaN(y)) {
        throw new Error("Invalid node coordinates");
      }
      return { x, y, label };
    });

    // let edges = edgeInput.split(";").map((pair) => pair.split(",").map(Number));
    let edges = []
    redrawGraph(nodes, edges);
  }

  // Function to draw the graph
  function redrawGraph(nodes, edges) {
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    nodes.forEach(drawNode);
    edges.forEach((edge, index) => {
      var node1 = nodes[edge[0]];
      var node2 = nodes[edge[1]];

      const slider = document.getElementById("edgeSlider" + index);
      const offset = parseInt(slider.value, 10);
      drawEdge(node1, node2, offset, "end"); // Change "end" to "start", "both", or other logic as needed
    });
  }
});
