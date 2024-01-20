window.addEventListener("load", () => {
  const canvas = document.querySelector("#canvas");
  // define what context we are working in
  /** @type {CanvasRenderingContext2D} */
  const ctx = canvas.getContext("2d");

  // resizing
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;

  // Draw Lines
  ctx.beginPath();
  ctx.moveTo(200, 80); // starting position of line
  ctx.lineTo(300, 80);
  ctx.lineTo(300, 150);
  ctx.closePath(); // connects remaining path
  ctx.stroke();

  // Draw beziercurves
  ctx.beginPath();
  ctx.moveTo(30, 30);
  ctx.bezierCurveTo(120, 160, 180, 10, 220, 140);
  ctx.stroke();
});
