window.addEventListener("load", () => {
  const canvas = document.querySelector("#canvas");
  // define what context we are working in
  /** @type {CanvasRenderingContext2D} */
  const ctx = canvas.getContext("2d");

  // resizing
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;

  //   // Draw a quadratic Bezier curve
  //   ctx.beginPath();
  //   ctx.moveTo(50, 300); // Start point
  //   ctx.quadraticCurveTo(250, 100, 650, 300); // Control point and end point
  //   ctx.stroke();

  //   // Draw a cubic Bezier curve
  //   ctx.beginPath();
  //   ctx.moveTo(50, 100); // Start point
  //   ctx.bezierCurveTo(150, 0, 350, 200, 450, 100); // Control points and end point
  //   ctx.stroke();

  // Example graph nodes and edges
  var nodes = [
    { x: 100, y: 100 },
    { x: 300, y: 300 },
    { x: 500, y: 100 },
  ];
  var edges = [
    [0, 1],
    [1, 2],
  ];

  // Function to draw nodes as ellipses
  function drawNode(node) {
    const radiusX = 50; // radius for the x-axis
    const radiusY = 20; // radius for the y-axis
    ctx.beginPath();
    ctx.ellipse(node.x, node.y, radiusX, radiusY, 0, 0, 2 * Math.PI);
    ctx.fillStyle = "blue";
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#003300";
    ctx.stroke();
  }

  // Function to draw edges
  function drawEdge(node1, node2) {
    ctx.beginPath();
    ctx.moveTo(node1.x, node1.y);
    ctx.lineTo(node2.x, node2.y);
    ctx.strokeStyle = "black";
    ctx.stroke();
  }

  // Render the graph
  nodes.forEach(drawNode);
  edges.forEach((edge) => {
    var node1 = nodes[edge[0]];
    var node2 = nodes[edge[1]];
    drawEdge(node1, node2);
  });
});
