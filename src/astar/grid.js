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
        const cellX = x * 10; // adjust to have same dimenions as pixels (cell = 100x100 pixels)
        const cellY = y * 10;

        //TODO: add functionality for MARKED-status for A* (start, end, open, closed)
        let marked = "";

        nodeCoordinates.forEach((node) => {
          const {
            x: nodeX,
            y: nodeY,
            width: nodeWidth,
            height: nodeHeight,
          } = node;

          // Calculate cell corners
          const cellTopLeft = {x: cellX, y: cellY};
          const cellTopRight = {x: cellX + 10, y: cellY};
          const cellBottomLeft = {x: cellX, y: cellY + 10};
          const cellBottomRight = {x: cellX + 10, y: cellY + 10};

          // Check if any cell corner falls within the node
          const corners = [cellTopLeft, cellTopRight, cellBottomLeft, cellBottomRight];
          const withinNode = corners.some(corner => {
              return corner.x >= nodeX/10 && corner.x <= (nodeX + nodeWidth)/10 &&
                    corner.y >= nodeY/10 && corner.y <= (nodeY + nodeHeight) /10;
          });

          if (withinNode) {
            console.log("");
              console.log("cellTopLeft", cellTopLeft);
              console.log(cellTopLeft.x > nodeX/10);
              console.log("nodeX ", nodeX/10);
              marked = "OBSTACLE";
          }

          
        });

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
