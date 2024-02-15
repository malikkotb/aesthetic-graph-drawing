import { Grid } from "./grid.js";
window.addEventListener("load", () => {
  const canvas = document.querySelector("#grid");
  // define what context we are working in
  /** @type {CanvasRenderingContext2D} */
  const ctx = canvas.getContext("2d");

  canvas.height = 10000;
  canvas.width = 10000;

  const gridHeight = 100; // 100 cells on y-axis
  const gridWidth = 100; // 100 cells on x-axis

  let nodeCoordinates = [];

  // get state and edge configuration from input
  document.getElementById("updateButton").addEventListener("click", updateGraph);

  function updateGraph() {
    const nodeInput = document.getElementById("nodeInput").value;
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

    // console.log("updateGraph main, nodeCoords: ", nodeCoordinates);

    // TODO: get Edge-Connection configs from user input
    const edgeInput = document.getElementById("edgeInput").value
    if (edgeInput)
      applyUserConnections(nodeCoordinates, edgeInput);

    // GRID
    let grid = new Grid(ctx, gridWidth, gridHeight, nodeCoordinates); // Create the grid

    // draw nodes
    redrawGraph(nodeCoordinates);
  }

  // Function to parse user input and apply connections
  function applyUserConnections(nodes, edgeInput) {
    // Split the user input by semicolons to separate individual connections
    var connections = edgeInput.split(";").map((connection) => connection.trim());

    // Iterate over each connection
    connections.forEach((connection) => {
      // Extract x and y coordinates of the two nodes from the connection string
      var [x1, y1, x2, y2] = connection.match(/\d+/g).map(Number);

      // Find the nodes in the nodes array using their coordinates
      var node1 = nodes.find((node) => node.x === x1 && node.y === y1);
      var node2 = nodes.find((node) => node.x === x2 && node.y === y2);

      // Check if both nodes are found
      if (node1 && node2) {
        // Apply logic to connect nodes (e.g., draw a line between them)
        console.log("Connecting nodes:", node1, "and", node2);
      } else {
        // Display an error message if nodes cannot be found
        console.log("Invalid node coordinates:", connection);
      }
    });
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
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, [15]);
    ctx.stroke();
  }
});
