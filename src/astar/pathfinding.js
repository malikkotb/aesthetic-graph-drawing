export class PathFinder {
  constructor(context, grid) {
    this.grid = grid;
    this.context = context;
  }

  // TODO: will have to loop through all edge-Connections and call this method for each
  findPath(startCellPos, targetCellPos) {
    console.log("startCellPos: ", startCellPos);
    console.log("targetCellPos: ", targetCellPos);

    const startCell = this.grid.getCell(startCellPos.x, startCellPos.y);
    const targetCell = this.grid.getCell(targetCellPos.x, targetCellPos.y);
    startCell;
    // open set of cells, can maybe be optimized to use a Heap https://stackfull.dev/heaps-in-javascript
    const openSet = [];
    const closedSet = new Set();

    // add starting to node to Open Set
    openSet.push(startCell);

    while (openSet.length > 0) {
      let currentCell = openSet[0]; // current node with lowest f_cost

      // loop through all nodes in openSet and find node with lowest f_cost
      // start at i = 1, as currentCell = openSet[0]
      for (let i = 1; i < openSet.length; i++) {
        if (
          openSet[i].fCost < currentCell.fCost ||
          (openSet[i].fCost === currentCell.fCost && openSet[i].hCost < currentCell.hCost)
        ) {
          // if they have equal fCost, compare hCosts ( and select cell closest to targetNode (lowest hCost))
          currentCell = openSet[i];
        }
      }

      // remove currentCell from openSet and add it to the closedSet
      let indexCurrentCell = openSet.indexOf(currentCell);
      if (indexCurrentCell !== -1) {
        openSet.splice(indexCurrentCell, 1);
      }
      closedSet.add(currentCell);


      if (currentCell === targetCell) {// path found
        return;
      }

      // foreach neihgbour of currentCell
      for (let neighbour of this.grid.getNeighbors(currentCell)) {

        if (neighbour.state === "OBSTACLE" || closedSet.has(neighbour)) {
            // can't traverse this cell -> skip ahead to next neighbour
            continue;
        }
      }
      return;
    }
  }
}
