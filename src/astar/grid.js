import { Cell } from "./Cell.js";
// we need a 2d array of Cells (representing our grid)

export class Grid {
  constructor(width, height, cellRadius) {
    // dimensions of grid-size
    this.width = width;
    this.height = height;
    this.cellRadius = cellRadius; // define how much space each individual cell covers
    this.grid = [];

    for (let x = 0; x < width; x++) {
      this.grid[x] = [];
      for (let y = 0; y < height; y++) {
        // TODO: if-statement for determining if cell is walkable or not
        // based on method that is run before making the grid
        // which should determine if a state is there or not
        this.grid[x][y] = new Cell(x, y, Math.random() < 0.7);
      }
    }
  }

  // TODO: function for setting unwalkable tiles

  render(ctx) {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        let cell = this.grid[x][y];
        cell.draw(ctx, 100, 100);
      }
    }
  }

  // Method to get a cell at a specific coordinate
  getCell(x, y) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      return this.grid[x][y];
    }
    return null; // Return null if the coordinates are out of bounds
  }
}
