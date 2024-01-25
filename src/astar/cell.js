// Class for a Cell/Node/Tile

// A cell can have two states: walkable or not-walkable (so an obstacle)

class Cell {
  constructor(x, y, walkable) {
    this.x = x; // X coordinate
    this.y = y; // Y coordinate
    this.walkable = walkable; // Whether the cell is an obstacle
    this.parent = null; // Parent cell in the path
    this.gCost = Infinity; // Cost from the start node
    this.hCost = Infinity; // Heuristic cost to the end node
    this.fCost = Infinity; // Total cost (gCost + hCost)
  }

  renderCell() {

  }

  // function to calculate costs (g, h, f)

}
