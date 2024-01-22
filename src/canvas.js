window.addEventListener("load", () => {
  const canvas = document.querySelector("#canvas");
  // define what context we are working in
  /** @type {CanvasRenderingContext2D} */
  const ctx = canvas.getContext("2d");

  // resizing
  canvas.height = 500; // window.innerHeight;
  canvas.width = 700; // window.innerWidth;

  // Example graph nodes and edges
  let nodes = [
    { x: 100, y: 100 },
    { x: 300, y: 300 },
    { x: 500, y: 100 },
  ];
  let edges = [
    [0, 1],
    [1, 2],
  ];

  // Slider element
  let offsetSlider = document.getElementById("offsetRange");

  const radiusX = 30;
  const radiusY = 20;

  // Function to draw nodes as ellipses
  function drawNode(node) {
    ctx.beginPath();
    ctx.ellipse(node.x, node.y, radiusX, radiusY, 0, 0, 2 * Math.PI);
    ctx.fillStyle = "blue";
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#003300";
    ctx.stroke();
  }

  // Adjust edge to touch the ellipse
  // TODO: explain this function (how to calculate intersections of node and edge)
  function adjustEdge(node1, node2) {
    let dx = node2.x - node1.x;
    let dy = node2.y - node1.y;
    let angle = Math.atan2(dy, dx);
    let adjustX = Math.cos(angle) * radiusX;
    let adjustY = Math.sin(angle) * radiusY;
    return { x: node1.x + adjustX, y: node1.y + adjustY };
  }

// Function to draw edges as Quadratic Bezier curves with consistent curvature
function drawEdge(node1, node2, offset) {
    var adjustedStart = adjustEdge(node1, node2);
    var adjustedEnd = adjustEdge(node2, node1);

    // Calculate the midpoint
    var midX = (adjustedStart.x + adjustedEnd.x) / 2;
    var midY = (adjustedStart.y + adjustedEnd.y) / 2;

    // Control point for the quadratic Bezier curve
    // Offset determines the height of the curve
    var cp1x = midX;
    var cp1y = midY - offset; // Move the control point up or down based on the offset

    ctx.beginPath();
    ctx.moveTo(adjustedStart.x, adjustedStart.y);
    ctx.quadraticCurveTo(cp1x, cp1y, adjustedEnd.x, adjustedEnd.y);
    ctx.strokeStyle = 'black';
    ctx.stroke();
}


  // Function to redraw the graph
  function redrawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    nodes.forEach(drawNode); // Redraw nodes
    let offset = parseInt(offsetSlider.value, 10);
    edges.forEach((edge) => {
      let node1 = nodes[edge[0]];
      let node2 = nodes[edge[1]];
      drawEdge(node1, node2, offset);
    });
  }

  // Event listener for the slider
  offsetSlider.addEventListener("input", redrawGraph);

  // Initial drawing
  redrawGraph();
});
