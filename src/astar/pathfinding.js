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

        // remove currentCell from this.openSet and add it to the this.closedSet
        let indexCurrentCell = this.openSet.indexOf(currentCell);
        if (indexCurrentCell !== -1) {
          this.openSet.splice(indexCurrentCell, 1);
        }

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

        if (currentCell === targetCell) {
          // path found
          console.log("path found");
          startCell.state = "START";
          targetCell.state = "END";
          this.retracePath(startCell, targetCell);
          return;
        }

        const neighbours = this.grid.getNeighbors(currentCell);

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

        if (count === 19) return;

        count++;
      }
    }, 1000);
  }

  // retrace steps to get path from startCell to targetCell
  retracePath(startCell, targetCell) {
    const path = [];
    let currentCell = targetCell;

    while (currentCell !== startCell) {
      if (currentCell !== targetCell) {
        currentCell.state = "FINISHED";
        // console.log(currentCell);
        currentCell.draw(
          this.context,
          100,
          100,
          currentCell.state,
          `${currentCell.gCost}, ${currentCell.hCost} = ${currentCell.gCost + currentCell.hCost}`
        );
      }
      path.push(currentCell);
      currentCell = currentCell.parent;
    }

    // add startCell to path
    path.push(startCell);

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
        if (cell.state !== "FINISHED" && cell.state !== "START" && cell.state !== "END") {
          cell.clearCell(this.context, 100, 100);
        }
      }

      // draw the edge usign path
      this.drawPath(this.context, path, 100, 100);
    }, 1000);

    // TODO: set START and END cells back to "OBSTACLE" for next iteration of a*
  }

  // drawPath(ctx, path, cellWidth, cellHeight) {
  //   if (path.length < 2) return; // Need at least two points to draw a path

  //   ctx.beginPath(); // Begin the drawing path

  //   // Move to the center of the first cell in the path
  //   let startX = path[0].x * cellWidth + cellWidth / 2;
  //   let startY = path[0].y * cellHeight + cellHeight / 2;
  //   ctx.moveTo(startX, startY);

  //   // Draw a line to the center of each subsequent cell in the path
  //   path.forEach((cell) => {
  //     let x = cell.x * cellWidth + cellWidth / 2;
  //     let y = cell.y * cellHeight + cellHeight / 2;
  //     ctx.lineTo(x, y);
  //   });

  //   ctx.stroke(); // Draw the path
  // }

  drawPath(ctx, path, cellWidth, cellHeight) {
    if (path.length < 2) return;

    ctx.beginPath();

    // Start adjustment to touch the inside edge of the first cell
    let startX = path[0].x * cellWidth;
    let startY = path[0].y * cellHeight;
    let directionX = path[1].x - path[0].x;
    let directionY = path[1].y - path[0].y;

    // Adjust the start point based on the direction to the second cell
    if (directionX > 0) { // Moving right
        startX += cellWidth; // Start from the right edge of the first cell
        startY += cellHeight / 2; // Vertically centered
    } else if (directionX < 0) { // Moving left
        startY += cellHeight / 2; // Vertically centered
        // startX is already at the left edge
    } else if (directionY > 0) { // Moving down
        startX += cellWidth / 2; // Horizontally centered
        startY += cellHeight; // Start from the bottom edge of the first cell
    } else if (directionY < 0) { // Moving up
        startX += cellWidth / 2; // Horizontally centered
        // startY is already at the top edge
    }
    
    ctx.moveTo(startX, startY);

    // Draw through intermediate points
    for (let i = 1; i < path.length - 1; i++) {
        let x = path[i].x * cellWidth + cellWidth / 2;
        let y = path[i].y * cellHeight + cellHeight / 2;
        ctx.lineTo(x, y);
    }

    // The end cell logic remains unchanged from the previous correct implementation
        // Calculate the ending point with fine adjustments
    let last = path.length - 1 ;
    let endX = path[last].x * cellWidth + (cellWidth / 2);
    let endY = path[last].y * cellHeight + (cellHeight / 2);
    if (path[last].x > path[last - 1].x) { // Coming from left
        endX -= (cellWidth / 2) ;
    } else if (path[last].x < path[last - 1].x) { // Coming from right
        endX += (cellWidth / 2) ;
    } else if (path[last].y > path[last - 1].y) { // Coming from top
        endY -= (cellHeight / 2) ;
    } else if (path[last].y < path[last - 1].y) { // Coming from bottom
        endY += (cellHeight / 2) ;
    }
    ctx.lineTo(endX, endY);

    ctx.stroke();
}

  
  getDistance(cellA, cellB) {
    // first count on X-axis, how many cells cellA is away from cellB
    // then count on Y-axis, ""
    // then take lowest number (either x or y axis count)
    // => will determine how many diagonal moves it will take,
    // to be either horizontally or vertically inline with the targetCell
    // ...then subtract the higher count (either x or y) from the lower count (= how many steps to get to the node, going either straight up or across)
    // ...if distance vertically and horizontally = 10 (as a cell right now is 10x10 units), and distance diagonally is ≈ 14 (pyhagoras theorem)
    // => equation:
    // if x > y
    // 14y + 10(x-y)
    // ...else if y > x
    // 14x + 10(y-x)

    let distanceX = Math.abs(cellA.x - cellB.x);
    let distanceY = Math.abs(cellA.y - cellB.y);

    if (distanceX > distanceY) return 14 * distanceY + 10 * (distanceX - distanceY);
    return 14 * distanceX + 10 * (distanceY - distanceX);
  }
}
