import { Cell } from "./Cell.js";
// we need a 2d array of Cells (representing our grid)

export class Grid {
  constructor(width, height, cellRadius) {
    // dimensions of grid-size
    this.width = width;
    this.height = height;
    this.cellRadius = cellRadius; // define how much space each individual cell covers
    this.grid = [];

    // create the grid
    for (let x = 0; x < width; x++) {
      this.grid[x] = [];
      for (let y = 0; y < height; y++) {
        // TODO: function for determining if cell is walkable or marked already
        // based on method that is run before making the grid
        // which should determine if a state is there or not
        // -> basically do collision detection 
        this.grid[x][y] = new Cell(x, y, Math.random() < 0.9);
      }
    }
  }

  // TODO: function for setting unwalkable tiles

  // Steps before running A*
  // 1. Create the grid (not marked yet; just the grid)
  // 2. check the configuration of states (they are given in coordinates)
  // 3. if coordinates of a state is inside a specific cell then mark that cell
  // 4. (figure out way of marking other cells before rendering each edge to make edge follow aesthetic path)
  // 

   updateGraph() {
    let nodeInput = document.getElementById("nodeInput").value;
    let edgeInput = document.getElementById("edgeInput").value;

    nodes = nodeInput.split(";").map((entry) => {
      let [x, y, label] = entry.split(",");
      x = Number(x);
      y = Number(y);
      if (isNaN(x) || isNaN(y)) {
        throw new Error("Invalid node coordinates");
      }
      return { x, y, label };
    });

    edges = edgeInput.split(";").map((pair) => pair.split(",").map(Number));
    
    // redrawGraph();
  }


  // before I render my grid I want you to create a function that checks whether 
  // a state in my graph is on a specific cell and then mark that cell

  render(ctx) {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
          let cell = this.grid[x][y];

          // add parameters: marked: "START", "END", "OPEN", "CLOSED", "OBSTACLE"
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
