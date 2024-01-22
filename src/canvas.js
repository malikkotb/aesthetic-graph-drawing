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
  let nodes = [
    { x: 100, y: 100 },
    { x: 300, y: 300 },
    { x: 500, y: 100 },
  ];
  let edges = [
    [0, 1],
    [1, 2],
  ];
  const radiusX = 30;
  const radiusY = 20;

  // To ensure that the edges of the graph only touch the ellipse
  // and don't go inside it, you need to calculate the intersection points between
  // the edges and the ellipses. This involves some geometry, as you have to find the
  // point where the line (representing the edge) touches the ellipse (representing the node)
  // without intersecting it.

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
  function adjustEdge(node1, node2) {
    let dx = node2.x - node1.x;
    let dy = node2.y - node1.y;
    let angle = Math.atan2(dy, dx);
    let adjustX = Math.cos(angle) * radiusX;
    let adjustY = Math.sin(angle) * radiusY;
    return { x: node1.x + adjustX, y: node1.y + adjustY };
  }

  // Function to draw edges
  function drawEdge(node1, node2) {
    let adjustedStart = adjustEdge(node1, node2);
    let adjustedEnd = adjustEdge(node2, node1);

    ctx.beginPath();
    ctx.moveTo(adjustedStart.x, adjustedStart.y);
    ctx.lineTo(adjustedEnd.x, adjustedEnd.y);
    ctx.strokeStyle = "black";
    ctx.stroke();
  }

  // Render the graph
  nodes.forEach(drawNode);
  edges.forEach((edge) => {
    let node1 = nodes[edge[0]];
    let node2 = nodes[edge[1]];
    drawEdge(node1, node2);
  });
});
