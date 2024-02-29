export class PathFinder {
  constructor(context, grid) {
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

    // open set of cells, can be optimized to use a Heap https://stackfull.dev/heaps-in-javascript
    const openSet = [];
    const closedSet = [];

    // add starting to node to Open Set
    openSet.push(startCell);



    let count = 0;

    setTimeout(() => {
      // timeout reached
      while (openSet.length > 0) {
        let currentCell = openSet[0]; // current node with lowest f_cost

        // loop through all nodes in openSet and find node with lowest f_cost
        // start at i = 1, as currentCell = openSet[0] 
        for (let i = 1; i < openSet.length; i++) {
          // if (count === 3) {
          //   console.log("openSet[i]: ", openSet[i], " - fCost: ", openSet[i].fCost());
          //   console.log("currentCell[i]: ", currentCell, " - fCost: ", currentCell.fCost());
          //   console.log("currentCell[i]: ", currentCell, " - fCost: ", typeof(currentCell.fCost()));
          // }
          if (
            openSet[i].fCost() < currentCell.fCost() ||
            (openSet[i].fCost() === currentCell.fCost() && openSet[i].hCost < currentCell.hCost)
          ) {
            // if they have equal fCost, compare hCosts ( and select cell closest to targetNode (lowest hCost))
            currentCell = openSet[i];
          } 
        }

        console.log("currentCell", currentCell);

        // remove currentCell from openSet and add it to the closedSet
        console.log("openSet before remocal: ", JSON.parse(JSON.stringify(openSet)));
        let indexCurrentCell = openSet.indexOf(currentCell);
        if (indexCurrentCell !== -1) {
          openSet.splice(indexCurrentCell, 1);
        }
        console.log("openSet AFTER remocal: ", JSON.parse(JSON.stringify(openSet)));
        console.log("closedSet Before adding currentCell: ", JSON.parse(JSON.stringify(closedSet)));
        
        currentCell.state = "CLOSED";

        closedSet.push(currentCell);
        if (currentCell !== startCell && currentCell !== targetCell) {
          currentCell.draw(this.context, 100, 100, currentCell.state, `${currentCell.gCost}, ${currentCell.hCost} = ${currentCell.gCost + currentCell.hCost}`);
        }
        console.log("closedSet After adding currentCell: ", JSON.parse(JSON.stringify(closedSet)));


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
          if (neighbourCell.state === "OBSTACLE" || closedSet.includes(neighbourCell)) {
            // can't traverse this cell -> skip ahead to next neighbour
            continue;
          }

          // mark neighbour as OPEN
          // if (neighbourCell.state !== "END") {
          //   neighbourCell.state = "OPEN";
          //   neighbourCell.draw(this.context, 100, 100, neighbourCell.state);
          // }

          // if new path to neighbour is shorter than old path OR if neighbour is not in openSet:
          let newMovementCostToNeighbour = currentCell.gCost + this.getDistance(currentCell, neighbourCell);
          if (newMovementCostToNeighbour < neighbourCell.gCost || !openSet.includes(neighbourCell)) {
            // set f_cost of neighbour
            neighbourCell.gCost = newMovementCostToNeighbour;
            neighbourCell.hCost = this.getDistance(neighbourCell, targetCell);

            neighbourCell.parent = currentCell; // set parent of neighbourCell to currentCell

            neighbourCell.state = "OPEN"

            // draw label on cell
            neighbourCell.draw(this.context, 100, 100, neighbourCell.state, `${neighbourCell.gCost}, ${neighbourCell.hCost} = ${neighbourCell.gCost + neighbourCell.hCost}`);

            if (!openSet.includes(neighbourCell)) openSet.push(neighbourCell);
          } else {
            neighbourCell.draw(this.context, 100, 100, neighbourCell.state, `${neighbourCell.gCost}, ${neighbourCell.hCost} = ${neighbourCell.gCost + neighbourCell.hCost}`);
          }
        }
        console.log("openSet after adding new neighbours: ", JSON.parse(JSON.stringify(openSet)));
        console.log("closedSet after adding new neighbours: ", JSON.parse(JSON.stringify(closedSet)));
  
        console.log("");
        // if (count === 3) return;

        count++;
      }
    }, 2000);
  }

  // retrace steps to get path from startCell to targetCell
  retracePath(startCell, targetCell) {
    const path = [];
    let currentCell = targetCell;
    while (currentCell !== startCell) {
      if (currentCell !== targetCell) {
        currentCell.state = "FINISHED";
        // console.log(currentCell);
        currentCell.draw(this.context, 100, 100, currentCell.state);
      }
      path.push(currentCell);
      currentCell = currentCell.parent;
    }
    // path is backwards -> reverse it
    path.reverse();

    this.grid.path = path;
    console.log("path", path);
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
