import { Grid } from "./grid.js";
import { PathFinder } from "./pathfinding.js";
window.addEventListener("load", () => {
  const canvas = document.querySelector("#grid");
  // define what context we are working in
  /** @type {CanvasRenderingContext2D} */
  const ctx = canvas.getContext("2d");

  // customizable: canvas.height, canvas.width, gridHeight, gridWidth
  canvas.height = 1000;
  canvas.width = 1000;

  const gridHeight = 20; // cells on y-axis
  const gridWidth = 20; // cells on x-axis

  const cellDim = canvas.height / gridHeight;

  let nodeCoordinates = [];
  let edgeConnections = [];

  let grid = null;
  let paths = [];

  // get state and edge configuration from input
  document.getElementById("updateButton").addEventListener("click", updateGraph);

  // call path finding meethod
  document.getElementById("findPathBtn").addEventListener("click", findPath);

  ///// popup button config
  const popupBtn = document.getElementById("popupBtn");
  const popup = document.getElementById("popup");
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
  ///// end of popup button config

  function updateGraph() {
    const nodeInput = document.getElementById("nodeInput").value;
    if (nodeInput) processNodeInput(nodeInput);

    const edgeInput = document.getElementById("edgeInput").value;
    if (edgeInput) applyUserConnections(nodeCoordinates, edgeInput); // get Edge-Connection configs from user input

    grid = new Grid(ctx, gridWidth, gridHeight, nodeCoordinates, canvas.height); // Create the grid
    redrawGraph(nodeCoordinates); // draw nodes
  }

  function findPath() {
    const a_star = new PathFinder(ctx, grid, cellDim);
    edgeConnections.map((edge) => {
      // TODO: make applicable for nodes covering multiple cells, right now this is for 1 node corresponding to 1 cell

      // Corresponding Cell -> coordinates in grid
      const startCellPos = { x: edge.startNode.x / 100, y: edge.startNode.y / 100 };
      const targetCellPos = { x: edge.targetNode.x / 100, y: edge.targetNode.y / 100 };
      console.log("edge.startNode", edge);

      // array of cells covered by starting and target node
      let startingCells = [];
      let targetingCells = [];

      for (let i = edge.startNode.x; i < edge.startNode.x + edge.startNode.width; i += cellDim) {
        // loop for cells in x direction of startNode
        startingCells.push({ x: i });
      }

      for (let i = edge.startNode.y; i < edge.startNode.y + edge.startNode.height; i += cellDim) {
        // loop for cells in y direction of startNode
        startingCells.push({ y: i });
      }

      for (let i = edge.targetNode.x; i < edge.targetNode.x + edge.targetNode.width; i += cellDim) {
        // loop for cells in x direction of targetNode
        targetingCells.push({ x: i });
      }

      for (let i = edge.targetNode.y; i < edge.targetNode.y + edge.targetNode.height; i += cellDim) {
        // loop for cells in y direction of targetNode
        targetingCells.push({ y: i });
      }

      let resultStartCells = combineCells(startingCells);
      let resultTargetCells = combineCells(targetingCells);

      // get all cells of starting node
      resultStartCells = resultStartCells.map((obj) => {
        return grid.getCell(obj.x / cellDim, obj.y / cellDim);
      });
      resultTargetCells = resultTargetCells.map((obj) => {
        // console.log(grid.getCell(obj.x / 50, obj.y / 50)); // cellDim = 50;
        return grid.getCell(obj.x / cellDim, obj.y / cellDim);
      });

      console.log("resultStartCells: ", resultStartCells);
      console.log("resultTargetCells: ", resultTargetCells);

      // TODO: specify the starting Cell -> function
      // TODO: start Coordinates of starting cell -> function

      // TODO: -> Future: calculate docking point by the angle, the edge is coming at

      // specify start and target cells of the start and target Nodes
      let startCell = specifyCell(resultStartCells)
      let targetCell = specifyCell(resultTargetCells) 

      console.log("");

      a_star.findPath(startCell, targetCell);

      // set START and END cells back to "OBSTACLE" for next iteration of a*
      startCell.state = "OBSTACLE";
      targetCell.state = "OBSTACLE";
      // draw nodes and obstacles again before executing net iteration (in main.js)
      startCell.draw(ctx, cellDim, cellDim, startCell.state);
      targetCell.draw(ctx, cellDim, cellDim, targetCell.state);

      redrawGraph(nodeCoordinates); // re-draw the ndoes on the graph for next iteration
    });

    // draw all the paths at once
    console.log("drawing all paths");
    console.log(a_star.paths);
    a_star.drawAllPaths(ctx, a_star.paths, cellDim, cellDim);
  }

  function specifyCell(availableCells) {
    // TODO: calculate the correct starting cell of a node 
    // This way, the user can specify which nodes should be connected,
    // by selecting the top-left-corner of a node and the rest will be handled
    // by the algorithm

    console.log("availableCells", availableCells);

    // TODO: check obstacles, and then select reasonable first cell in path

    // TODO: calculate shortest path to each and then select shortest path ?

    // calculate how many edges are going out of this node
    // then set standards for what cells of a node to choose depending
    // on the length of the side of the particular node

    // Docking points:
    // i.e. length of a side is 3 cells and the edge is incoming: possible cells are the outer ones
    // and then the points on that cell are the inner corners

    // if the edge is outgoing it should usually come from the middle of the middle cell
    // - so with even length sides: on the corner of the cell that is next to the middle
    // - for odd length sides: in the middle of the middle cell


    return availableCells[0];
  }


  function combineCells(arrayOfObjects) {
    let resultCells = [];

    arrayOfObjects.forEach((objX) => {
      arrayOfObjects.forEach((objY) => {
        let newObj = { ...objX, ...objY };
        if (newObj.x === undefined || newObj.y === undefined) return;
        resultCells.push(newObj);
      });
    });

    // remove duplicate objects
    resultCells = resultCells.filter((obj, index) => {
      return resultCells.findIndex((o) => o.x === obj.x && o.y === obj.y) === index;
    });

    return resultCells;
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
