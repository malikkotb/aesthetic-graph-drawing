window.addEventListener("load", () => {
  const canvas = document.querySelector("#canvas");
  // define what context we are working in
  /** @type {CanvasRenderingContext2D} */
  const ctx = canvas.getContext("2d");

  // resizing
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;

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

  // Function to draw edges as Quadratic Bezier curves with more pronounced curvature
  function drawEdge(node1, node2) {
    let adjustedStart = adjustEdge(node1, node2);
    let adjustedEnd = adjustEdge(node2, node1);

    // Calculate the midpoint
    let midX = (adjustedStart.x + adjustedEnd.x) / 2;
    let midY = (adjustedStart.y + adjustedEnd.y) / 2;

    // Control point for the quadratic Bezier curve
    // Increase the offset to make the curve more pronounced
    let offset = 160; // Adjust this value to make the curve more or less pronounced
    let cp1x = midX + Math.random() * offset - offset / 2;
    let cp1y = midY + Math.random() * offset - offset / 2;

    ctx.beginPath();
    ctx.moveTo(adjustedStart.x, adjustedStart.y);
    ctx.quadraticCurveTo(cp1x, cp1y, adjustedEnd.x, adjustedEnd.y);
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
