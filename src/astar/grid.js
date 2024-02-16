import { Cell } from "./Cell.js";
// we need a 2d array of Cells (representing our grid)

export class Grid {
  constructor(context, width, height, nodeCoordinates) {
    this.context = context;
    // dimensions of grid-size
    this.width = width;
    this.height = height;
    this.grid = [];
    this.nodeCoordinates = nodeCoordinates; // list of coordinates of nodes

    // Steps before running A*
    // 1. Create the grid (not marked yet; just the grid)
    // 2. check the configuration of states (they are given in coordinates)
    //    -> if coordinates of a state is inside a specific cell then mark that cell as obstacle

    // Top-Left Corner (Given): (nodeX, nodeY)
    // Top-Right Corner: (nodeX + nodeWidth, nodeY)
    // Bottom-Left Corner: (nodeX, nodeY + nodeHeight)
    // Bottom-Right Corner: (nodeX + nodeWidth, nodeY + nodeHeight)

    // create the grid
    for (let x = 0; x < width; x++) {
      this.grid[x] = [];
      for (let y = 0; y < height; y++) {
        const cellX = x * 10; // adjust to have same dimenions as pixels (cell = 100x100 pixels)
        const cellY = y * 10;

        //TODO: add functionality for MARKED-status for A* (start, end, open, closed)
        let state = "";

        nodeCoordinates.forEach((node) => {
          const { x: nodeX, y: nodeY, width: nodeWidth, height: nodeHeight } = node;

          // get area of entire cell
          const cellRight = cellX + 10; // Assuming cellSize is 10
          const cellBottom = cellY + 10;

          // Check if any part of the node intersects with the cell's area
          if (nodeX / 10 < cellRight && (nodeX + nodeWidth) / 10 > cellX && nodeY / 10 < cellBottom && (nodeY + nodeHeight) / 10 > cellY) {
            state = "OBSTACLE";
          } else {
            state = "WALKABLE"
          }
        });

        this.grid[x][y] = new Cell(context, x, y, 100, 100, state); // cellWidth and height are 10
      }
    }
  }
  

  // Method to get a cell at a specific coordinate
  getCell(x, y) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      console.log(this.grid[x][y]);
      return this.grid[x][y];
    }
    return null; // Return null if the coordinates are out of bounds
  }
}
