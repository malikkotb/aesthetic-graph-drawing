import { Grid } from "./grid.js";
import { PathFinder } from "./pathfinding.js";
window.addEventListener("load", () => {
  const canvas = document.querySelector("#grid");
  // define what context we are working in
  /** @type {CanvasRenderingContext2D} */
  const ctx = canvas.getContext("2d");

  // customizable: canvas.height, canvas.width, gridHeight, gridWidth
  canvas.height = 2000;
  canvas.width = 2000;

  const gridHeight = 20; // 100 cells on y-axis
  const gridWidth = 20; // 100 cells on x-axis

  let nodeCoordinates = [];
  let edgeConnections = [];

  let grid = null;
  let paths = [];

  // get state and edge configuration from input
  document.getElementById("updateButton").addEventListener("click", updateGraph);

  // call path finding meethod
  document.getElementById("findPathBtn").addEventListener("click", findPath);

  // get a specific cell (and its marked-status, so its color)
  document.getElementById("cellButton").addEventListener("click", () => grid.getCell(3, 4));

  // Get the button and the popup
  const popupBtn = document.getElementById("popupBtn");
  const popup = document.getElementById("popup");

  // Get the close button inside the popup
  const closeBtn = document.getElementById("closeBtn");

  // When the button is clicked, show the popup
  popupBtn.addEventListener("click", function () {
    popup.style.display = "block";
  });

  // When the close button is clicked, hide the popup
  closeBtn.addEventListener("click", function () {
    popup.style.display = "none";
  });

  // When the user clicks anywhere outside of the popup, close it
  window.addEventListener("click", function (event) {
    if (event.target === popup) {
      popup.style.display = "none";
    }
  });

  function updateGraph() {
    const nodeInput = document.getElementById("nodeInput").value;
    if (nodeInput) processNodeInput(nodeInput);

    const edgeInput = document.getElementById("edgeInput").value;
    if (edgeInput) applyUserConnections(nodeCoordinates, edgeInput); // get Edge-Connection configs from user input

    grid = new Grid(ctx, gridWidth, gridHeight, nodeCoordinates); // Create the grid
    redrawGraph(nodeCoordinates); // draw nodes
  }

  function findPath() {
    const a_star = new PathFinder(ctx, grid);
    edgeConnections.map((edge) => {
      // TODO: figure out what Cell should be startCell
      // TODO: make applicable for nodes covering multiple cells, right now this is for 1 node corresponding to 1 cell
      // Corresponding Cell -> coordinates in grid
      const startCellPos = { x: edge.startNode.x / 100, y: edge.startNode.y / 100 };
      const targetCellPos = { x: edge.targetNode.x / 100, y: edge.targetNode.y / 100 };
      const startCell = grid.getCell(startCellPos.x, startCellPos.y);
      const targetCell = grid.getCell(targetCellPos.x, targetCellPos.y);

      a_star.findPath(startCell, targetCell);
      // set START and END cells back to "OBSTACLE" for next iteration of a*
      // console.log("startCell: ", grid.getCell(startCellPos.x, startCellPos.y));
      startCell.state = "OBSTACLE";
      targetCell.state = "OBSTACLE";
      // draw nodes and obstacles again before executing net iteration (in main.js)
      startCell.draw(ctx, 100, 100, startCell.state);
      targetCell.draw(ctx, 100, 100, targetCell.state);

      redrawGraph(nodeCoordinates);
    });

    // draw all the paths at once
    console.log("drawing all paths");
    console.log(a_star.paths);
    a_star.drawAllPaths(ctx, a_star.paths, 100, 100);
  }

  function processNodeInput(nodeInput) {
    nodeCoordinates = nodeInput.split(";").map((entry) => {
      // x = x-axis coordinate of the rectangle's starting point, in pixels. (top left corner of node) // y = y-axis coordinate of the rectangle's starting point, in pixels. (top left corner of node) // width = rectangle's width. Positive values are to the right, and negative to the left. // height = rectangle's height. Positive values are down, and negative are up.
      let [x, y, width, height] = entry.split(",").map(Number);
      if (isNaN(x) || isNaN(y) || isNaN(width) || isNaN(height)) {
        throw new Error("Invalid node input");
      }
      return { x, y, width, height };
    });
  }

  // Function to parse user input and apply connections
  function applyUserConnections(nodes, edgeInput) {
    // Split the user input by semicolons to separate individual connections
    let connections = edgeInput.split(";").map((connection) => connection.trim());

    // Iterate over each connection
    connections.forEach((connection) => {
      // Extract x and y coordinates of the two nodes from the connection string
      let [x1, y1, x2, y2] = connection.match(/\d+/g).map(Number);

      // Find the nodes in the nodes array using their coordinates
      let startNode = nodes.find((node) => node.x === x1 && node.y === y1);
      let targetNode = nodes.find((node) => node.x === x2 && node.y === y2);

      // Check if both nodes are found
      if (startNode && targetNode) {
        // Apply logic to connect nodes (e.g., draw a line between them)
        console.log("Connecting nodes:", startNode, "and", targetNode);
        edgeConnections.push({ startNode, targetNode });
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
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, [15]);
    ctx.stroke();
  }
});
