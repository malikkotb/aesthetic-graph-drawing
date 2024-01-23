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
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "red";
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

  function drawArrowhead(ctx, x, y, radians) {
    let arrowLength = 10; // Length of the arrow
    let arrowWidth = 4; // Width of the base of the arrow

    ctx.save();
    ctx.beginPath();
    ctx.translate(x, y);
    ctx.rotate(radians);
    ctx.moveTo(0, 0); // tip of arrow
    ctx.lineTo(-arrowWidth, -arrowLength);
    ctx.lineTo(arrowWidth, -arrowLength);
    ctx.closePath();
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.restore();
  }

  // Updated function to draw edges as Quadratic Bezier curves
  function drawEdge(node1, node2, offset, arrowPosition) {
    var adjustedStart = adjustEdge(node1, node2);
    var adjustedEnd = adjustEdge(node2, node1);

    var midX = (adjustedStart.x + adjustedEnd.x) / 2;
    var midY = (adjustedStart.y + adjustedEnd.y) / 2;

    var cp1x = midX;
    var cp1y = midY - offset;

    ctx.beginPath();
    ctx.moveTo(adjustedStart.x, adjustedStart.y);
    ctx.quadraticCurveTo(cp1x, cp1y, adjustedEnd.x, adjustedEnd.y);
    ctx.strokeStyle = "black";
    ctx.stroke();

    // Calculate the angle for the arrowhead
    var angleAtEnd = Math.atan2(adjustedEnd.y - cp1y, adjustedEnd.x - cp1x);
    var angleAtStart = Math.atan2(
      adjustedStart.y - cp1y,
      adjustedStart.x - cp1x
    );

    // Draw arrow at the specified positions
    if (arrowPosition === "start" || arrowPosition === "both") {
      drawArrowhead(
        ctx,
        adjustedStart.x,
        adjustedStart.y,
        angleAtStart - Math.PI / 2
      );
    }
    if (arrowPosition === "end" || arrowPosition === "both") {
      drawArrowhead(
        ctx,
        adjustedEnd.x,
        adjustedEnd.y,
        angleAtEnd - Math.PI / 2
      );
    }
  }

  // Function to redraw the graph
  function redrawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    nodes.forEach(drawNode);
    edges.forEach((edge, index) => {
      var node1 = nodes[edge[0]];
      var node2 = nodes[edge[1]];
      var offset = parseInt(
        index === 0 ? offsetSlider1.value : offsetSlider2.value,
        10
      );
      drawEdge(node1, node2, offset, "end"); // Change "end" to "start", "both", or other logic as needed
    });
  }

  // Event listeners for the sliders
  offsetSlider1.addEventListener("input", redrawGraph);
  offsetSlider2.addEventListener("input", redrawGraph);

  redrawGraph();
});
