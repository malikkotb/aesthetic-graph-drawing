// we need a 2d array of Cells (representing our grid)

class Grid {
  constructor(width, height, cellRadius) {
    // dimensions of grid-size
    this.width = width;
    this.height = height;
    this.cellRadius = cellRadius; // define how much space each individual cell covers
    this.grid = [];

    for (let x = 0; x < width; x++) {
      this.grid[x] = [];
      for (let y = 0; y < height; y++) {
        // Initialize each cell, can 
        this.grid[x][y] = new Cell(x, y);

        // add logic to determine if a cell is an obstacle

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

  // TODO: function for setting obstacles
}
