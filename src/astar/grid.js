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

    // TODO: function for setting unwalkable/obstacle tiles
    // Steps before running A*
    // 1. Create the grid (not marked yet; just the grid)
    // 2. check the configuration of states (they are given in coordinates)
    // 3. if coordinates of a state is inside a specific cell then mark that cell as obstacle
    // 4. (figure out way of marking other cells before rendering each edge to make edge follow aesthetic path)
    // 5. add a layer on top of that grid representing the unwalkable areas or obstacles
    //  -> extract positions of nodes from the user-input and make all those tiles/cells where
    // the nodes are rendered on -> an obstacle




    // Top-Left Corner (Given): (nodeX, nodeY)

    // Top-Right Corner:
    // Calculation: (nodeX + nodeWidth, nodeY)

    // Bottom-Left Corner:
    // Calculation: (nodeX, nodeY + nodeHeight)

    // Bottom-Right Corner:
    // Calculation: (nodeX + nodeWidth, nodeY + nodeHeight)

    // create the grid
    for (let x = 0; x < width; x++) {
      this.grid[x] = [];
      for (let y = 0; y < height; y++) {
        const cellX = x*10;
        const cellY = y*10;
        const {x:nodeX ,y:nodeY, width: nodeWidth, height: nodeHeight} = nodeCoordinates[0]
        
        // determine marked-state of tile and pass that into the constructor of Cell
        //TODO: add functionality for MARKED-status for A* (start, end, open, closed)
        let marked = "";


      
        if (cellX >= nodeX/10 && cellX < nodeX/10 + nodeWidth/10 && cellY >= nodeY/10 && cellY < nodeY/10 + nodeHeight/10) {
        //   // The cell is within the node's bounds or at its corners
          console.log("MARK CELL");        
          console.log("cellX, cellY ", cellX, cellY);
          console.log("nodeX, nodeY ", nodeX/10, nodeY/10); // divide node-position by grid width (# of cells)
          marked = "OBSTACLE";

        }
        this.grid[x][y] = new Cell(context, x, y, 100, 100, marked);
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
