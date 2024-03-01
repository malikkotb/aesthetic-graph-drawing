export class PathFinder {
  constructor(context, grid) {
    // open set of cells, can be optimized to use a Heap https://stackfull.dev/heaps-in-javascript
    this.openSet = [];
    this.closedSet = [];
    this.grid = grid;
    this.context = context;
  }

  // TODO: will have to loop through all edge-Connections and call this method for each
  findPath(startCellPos, targetCellPos) {
    const startCell = this.grid.getCell(startCellPos.x, startCellPos.y);
    const targetCell = this.grid.getCell(targetCellPos.x, targetCellPos.y);

    startCell.state = "START";
    targetCell.state = "END";
    startCell.draw(this.context, 100, 100, startCell.state);
    targetCell.draw(this.context, 100, 100, targetCell.state);

    

    // add starting to node to Open Set
    this.openSet.push(startCell);

    let count = 0;

    setTimeout(() => {
      // timeout reached
      while (this.openSet.length > 0) {
        let currentCell = this.openSet[0]; // current node with lowest f_cost

        // loop through all nodes in this.openSet and find node with lowest f_cost
        // start at i = 1, as currentCell = this.openSet[0]
        for (let i = 1; i < this.openSet.length; i++) {
          if (
            this.openSet[i].fCost() < currentCell.fCost() ||
            (this.openSet[i].fCost() === currentCell.fCost() && this.openSet[i].hCost < currentCell.hCost)
          ) {
            // if they have equal fCost, compare hCosts ( and select cell closest to targetNode (lowest hCost))
            currentCell = this.openSet[i];
          }
        }

        console.log("currentCell", currentCell);

        // remove currentCell from this.openSet and add it to the this.closedSet
        console.log("this.openSet before remocal: ", JSON.parse(JSON.stringify(this.openSet)));
        let indexCurrentCell = this.openSet.indexOf(currentCell);
        if (indexCurrentCell !== -1) {
          this.openSet.splice(indexCurrentCell, 1);
        }
        console.log("this.openSet AFTER remocal: ", JSON.parse(JSON.stringify(this.openSet)));
        console.log("this.closedSet Before adding currentCell: ", JSON.parse(JSON.stringify(this.closedSet)));

        currentCell.state = "CLOSED";

        this.closedSet.push(currentCell);
        if (currentCell !== startCell && currentCell !== targetCell) {
          currentCell.draw(
            this.context,
            100,
            100,
            currentCell.state,
            `${currentCell.gCost}, ${currentCell.hCost} = ${currentCell.gCost + currentCell.hCost}`
          );
        }
        console.log("this.closedSet After adding currentCell: ", JSON.parse(JSON.stringify(this.closedSet)));

        if (currentCell === targetCell) {
          // path found
          console.log("path found");
          this.retracePath(startCell, targetCell);
          return;
        }

        const neighbours = this.grid.getNeighbors(currentCell);
        console.log("neighbours of currentCell: ", JSON.parse(JSON.stringify(neighbours)));

        // foreach neihgbour of currentCell
        for (let neighbourCell of neighbours) {
          if (neighbourCell.state === "OBSTACLE" || this.closedSet.includes(neighbourCell)) {
            // can't traverse this cell -> skip ahead to next neighbour
            continue;
          }

          // if new path to neighbour is shorter than old path OR if neighbour is not in this.openSet:
          let newMovementCostToNeighbour = currentCell.gCost + this.getDistance(currentCell, neighbourCell);
          if (newMovementCostToNeighbour < neighbourCell.gCost || !this.openSet.includes(neighbourCell)) {
            // set f_cost of neighbour
            neighbourCell.gCost = newMovementCostToNeighbour;
            neighbourCell.hCost = this.getDistance(neighbourCell, targetCell);

            neighbourCell.parent = currentCell; // set parent of neighbourCell to currentCell

            if (neighbourCell.state !== "END") neighbourCell.state = "OPEN";
            

            // draw label on cell
            neighbourCell.draw(
              this.context,
              100,
              100,
              neighbourCell.state,
              `${neighbourCell.gCost}, ${neighbourCell.hCost} = ${neighbourCell.gCost + neighbourCell.hCost}`
            );

            if (!this.openSet.includes(neighbourCell)) this.openSet.push(neighbourCell);
          } else {
            neighbourCell.draw(
              this.context,
              100,
              100,
              neighbourCell.state,
              `${neighbourCell.gCost}, ${neighbourCell.hCost} = ${neighbourCell.gCost + neighbourCell.hCost}`
            );
          }
        }
        console.log("this.openSet after adding new neighbours: ", JSON.parse(JSON.stringify(this.openSet)));
        console.log("this.closedSet after adding new neighbours: ", JSON.parse(JSON.stringify(this.closedSet)));

        console.log("");
        if (count === 18) return;

        count++;
      }
    }, 2000);
  }

  // retrace steps to get path from startCell to targetCell
  retracePath(startCell, targetCell) {
    const path = [];
    console.log(targetCell);
    let currentCell = targetCell;
    while (currentCell !== startCell) {
      if (currentCell !== targetCell) {
        currentCell.state = "FINISHED";
        // console.log(currentCell);
        currentCell.draw(this.context, 100, 100, currentCell.state, `${currentCell.gCost}, ${currentCell.hCost} = ${currentCell.gCost + currentCell.hCost}`);
      }
      path.push(currentCell);
      currentCell = currentCell.parent;
    }
    // path is backwards -> reverse it
    path.reverse();

    this.grid.path = path;
    console.log("path", path);

    // remove labels, markings of other cells
    setTimeout(() => {
      for (let cell of this.openSet) {
        cell.clearCell(this.context, 100, 100);
      } 

      for (let cell of this.closedSet) {
        if (cell.state !== "FINISHED" && cell.state !== "CLOSED") {
          cell.clearCell(this.context, 100, 100)
        }
      }

    }, 2000)


    // TODO: set START and END cells back to "OBSTACLE" for next iteration of a*
  

  }

  // get distance between 2 cells
  getDistance(cellA, cellB) {
    // first count on X-axis, how many cells cellA is away from cellB
    // then count on Y-axis, ""
    // then take lowest number (either x or y axis count)
    // => will determine how many diagonal moves it will take,
    // to be either horizontally or vertically inline with the targetCell

    // then subtract the higher count (either x or y) from the lower count (= how many steps to get to the node, going either straight up or across)

    // if distance vertically and horizontally = 10 (as a cell right now is 10x10 units), and distance diagonally is ≈ 14 (pyhagoras theorem)
    // => equation:
    // if x > y
    // 14y + 10(x-y)

    // else if y > x
    // 14x + 10(y-x)

    let distanceX = Math.abs(cellA.x - cellB.x);
    let distanceY = Math.abs(cellA.y - cellB.y);

    if (distanceX > distanceY) return 14 * distanceY + 10 * (distanceX - distanceY);
    return 14 * distanceX + 10 * (distanceY - distanceX);
  }
}
