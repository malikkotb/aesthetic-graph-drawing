window.addEventListener('load', () => {
    const canvas = document.querySelector("#canvas");
    // define what context we are working in
    /** @type {CanvasRenderingContext2D} */
    const ctx = canvas.getContext("2d");

    // resizing
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    // Draw Rectangles
    // source: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Applying_styles_and_colors?retiredLocale=de
    ctx.strokeStyle = "red"; // the style always affecs the next context rendered
    ctx.lineWidth = 5;
    ctx.strokeRect(100, 100, 200, 500)

    ctx.strokeStyle = "blue";
    ctx.lineWidth = 1;
    ctx.strokeRect(200, 200, 200, 500)


    // Draw Lines 
    ctx.beginPath()
    ctx.moveTo(100, 80) // starting position of line
    ctx.lineTo(200, 80)
    ctx.stroke()


    // Draw beziercurves
    // ctx.bezierCurveTo()

})

// window.addEventListener('resize', () => {
//     canvas.height = window.innerHeight;
//     canvas.width = window.innerWidth;
// })