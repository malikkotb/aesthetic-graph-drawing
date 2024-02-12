// Class for a Cell/Node/Tile

// A cell can have two states: walkable or not-walkable (so an obstacle)

export class Cell {
  constructor(context, x, y, width, height, walkable, marked) {
    // position of cell in the grid
    this.x = x; // X coordinate
    this.y = y; // Y coordinate
    this.walkable = walkable; // Whether the cell is an obstacle
    this.marked = marked;
    this.parent = null; // Parent cell in the path
    this.gCost = Infinity; // Cost from the start node
    this.hCost = Infinity; // Heuristic cost to the end node
    this.fCost = Infinity; // Total cost (gCost + hCost)

    this.draw(context, width, height, walkable)

  }

  draw(ctx, cellWidth, cellHeight, marked) {
    let xPosition = this.x * cellWidth;
    let yPosition = this.y * cellHeight;

    // fill the cell
    let color = "white";
    switch (marked) {
      case "START":
        color = "orange";
        break;
      case "END":
        color = "blue";
        break;
      case "OPEN":
        color = "GREEN";
        break;
      case "CLOSED":
        color = "RED";
        break;
      case "OBSTACLE":
        color = "black";
        break;
      default:
        break;
    }
    ctx.fillStyle = color;
    ctx.fillRect(xPosition, yPosition, cellWidth, cellHeight);

    // border
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.strokeRect(xPosition, yPosition, cellWidth, cellHeight);
  }

  // function to calculate costs (g, h, f)
}
