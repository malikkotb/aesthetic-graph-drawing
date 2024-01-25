// Class for a Cell/Node/Tile

// A cell can have two states: walkable or not-walkable (so an obstacle)

export class Cell {
  constructor(x, y, walkable) {
    this.x = x; // X coordinate
    this.y = y; // Y coordinate
    this.walkable = walkable; // Whether the cell is an obstacle
    this.parent = null; // Parent cell in the path
    this.gCost = Infinity; // Cost from the start node
    this.hCost = Infinity; // Heuristic cost to the end node
    this.fCost = Infinity; // Total cost (gCost + hCost)
  }

  draw(ctx, cellWidth, cellHeight) {
    let xPosition = this.x * cellWidth;
    let yPosition = this.y * cellHeight;
    // fill the cell
    ctx.beginPath();
    ctx.fillStyle = this.walkable ? "green" : "black";
    ctx.fillRect(xPosition, yPosition, cellWidth, cellHeight);

     // border
     ctx.strokeStyle = 'white';
     ctx.lineWidth = 1; 
     ctx.strokeRect(xPosition, yPosition, cellWidth, cellHeight);
  }

  // function to calculate costs (g, h, f)
}
