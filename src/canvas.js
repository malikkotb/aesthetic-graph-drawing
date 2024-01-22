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

  // Slider elements
  let offsetSlider1 = document.getElementById("offsetRange1");
  let offsetSlider2 = document.getElementById("offsetRange2");

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
  function drawEdge(node1, node2, edgeIndex) {
    let adjustedStart = adjustEdge(node1, node2);
    let adjustedEnd = adjustEdge(node2, node1);

    let offset =
      edgeIndex === 1
        ? parseInt(offsetSlider1.value, 10)
        : parseInt(offsetSlider2.value, 10);

    let midX = (adjustedStart.x + adjustedEnd.x) / 2;
    let midY = (adjustedStart.y + adjustedEnd.y) / 2;

    let cp1x = midX;
    let cp1y = midY - offset;

    ctx.beginPath();
    ctx.moveTo(adjustedStart.x, adjustedStart.y);
    ctx.quadraticCurveTo(cp1x, cp1y, adjustedEnd.x, adjustedEnd.y);
    ctx.strokeStyle = "black";
    ctx.stroke();
  }

  // Function to redraw the graph
  function redrawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    nodes.forEach(drawNode);
    edges.forEach((edge, index) => {
      let node1 = nodes[edge[0]];
      let node2 = nodes[edge[1]];
      drawEdge(node1, node2, index);
    });
  }

  // Event listeners for the sliders
  offsetSlider1.addEventListener("input", redrawGraph);
  offsetSlider2.addEventListener("input", redrawGraph);

  redrawGraph();
});
