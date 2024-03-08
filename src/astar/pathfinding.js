export class PathFinder {
  constructor(context, grid) {
    // open set of cells, can be optimized to use a Heap https://stackfull.dev/heaps-in-javascript
    this.openSet = [];
    this.closedSet = [];
    this.grid = grid;
    this.context = context;
  }

  // TODO: will have to loop through all edge-Connections and call this method for each
  findPath(startCell, targetCell) {
    // const startCell = this.grid.getCell(startCellPos.x, startCellPos.y);
    // const targetCell = this.grid.getCell(targetCellPos.x, targetCellPos.y);

    startCell.state = "START";
    targetCell.state = "END";
    startCell.draw(this.context, 100, 100, startCell.state);
    targetCell.draw(this.context, 100, 100, targetCell.state);

    // add starting to node to Open Set
    this.openSet.push(startCell);

    let count = 0;

    // setTimeout(() => {
    // timeout reached
    while (this.openSet.length > 0) {
      let currentCell = this.openSet[0]; // current node with lowest f_cost

      // this is the slowest part of the algorithm -> in each iteration I have to search through the entire openSet to try and find the node with the lowest f_cost 

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
    // }, 1000);
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
    // setTimeout(() => {
    for (let cell of this.openSet) {
      cell.clearCell(this.context, 100, 100);
    }

    for (let cell of this.closedSet) {
      if (cell.state !== "START" && cell.state !== "END") {
        // cell.state !== "FINISHED" &&
        cell.clearCell(this.context, 100, 100);
      }
    }

    // clear everything in closedSet and openSet for next iteration to work properly
    this.openSet = [];
    this.closedSet = [];

    // draw the edge usign path
    this.drawPath(this.context, path, 100, 100);
    // }, 1000);
  }

  // draw edge
  drawPath(ctx, path, cellWidth, cellHeight) {
    if (path.length < 2) return;

    // TODO: respect OBSTACLES along the path
    // TODO: adjust direction of start and end point of edge, its still fucked for some configuration of edge-connections

    // the path should touch the middle of the top edge of the cell, when coming in diagonally (so coming in at an angle)

    ctx.beginPath();

    // Start adjustment to touch the middle of the top edge of the cell
    let startX = path[0].x * cellWidth + cellWidth / 2;
    let startY = path[0].y * cellHeight;

    let directionX = path[1].x - path[0].x;
    let directionY = path[1].y - path[0].y;

    // Check if there's an obstacle diagonally adjacent to the starting cell
    const obstacleX = path[0].x + directionX;
    const obstacleY = path[0].y + directionY;
    const hasObstacle = this.grid.getCell(obstacleX, obstacleY) === 1;

    // Adjust the start point based on the direction to the second cell and obstacle presence
    if (directionX > 0 && directionY < 0 && hasObstacle) {
        // Moving diagonally (coming in from top-right) and there's an obstacle
        startX += cellWidth / 2; // Start from the middle of the top edge of the cell
    }

    ctx.moveTo(startX, startY);

    // Draw through intermediate points
    for (let i = 1; i < path.length - 1; i++) {
      let x = path[i].x * cellWidth + cellWidth / 2;
      let y = path[i].y * cellHeight + cellHeight / 2;
      ctx.lineTo(x, y);
    }

     // Determine the direction from the second to the last cell
     directionX = path[path.length - 1].x - path[path.length - 2].x;
     directionY = path[path.length - 1].y - path[path.length - 2].y;
 
     // Check if there's an obstacle diagonally adjacent to the last cell
     const lastObstacleX = path[path.length - 1].x + directionX;
     const lastObstacleY = path[path.length - 1].y + directionY;
     const hasLastObstacle = this.grid.getCell(lastObstacleX, lastObstacleY) === 1;

       // End adjustment to touch the middle of the top edge of the last cell
    let endX = path[path.length - 1].x * cellWidth + cellWidth / 2;
    let endY = path[path.length - 1].y * cellHeight;
 
     // Adjust the end point based on the direction from the second to the last cell and obstacle presence
     if (directionX < 0 && directionY < 0 && hasLastObstacle) {
         // Moving diagonally (going out to top-left) and there's an obstacle
         endX -= cellWidth / 2; // End at the middle of the top edge of the cell
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

