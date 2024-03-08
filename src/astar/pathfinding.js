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

    // direction for first to second cell
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

    const lastCell = path[path.length - 1];
    const secondLastCell = path[path.length - 2];

    // TODO: idea
    // Example: if direction is "down-left" -> that means the second-to-last-cell is the top-right neighbour of the last cell
    // In this case we need to check if there is an obstacle on top of the last cell, or on the right of the last cell
    // those are the 2 options (2 sides of the target-/end-/last-cell) where the edge can end at
    // now if there is an obstacle on the right of the last-cell then the edge needs to finish on the top side of the last-cell

    // if there is an obstacle on top of the last-cell, then the edge has to finish on the right side of the last-cell

    // if there is an obstacle both on top and on the left of the last cell, the edge has to finish in the top right corner of the last-cell

    // TODO: do this for starting point as well. I believe it should be slightly different. Because direction will not be IN going TO the last cell
    // but OUTgoing FROM the start cell

    let { endX, endY } = this.getEndCoordinates(lastCell, secondLastCell, 100, 100);
    console.log("end X, Y", endX, endY);

    ctx.lineTo(endX, endY);

    ctx.stroke();
  }

  getEndCoordinates(lastCell, secondLastCell, cellWidth, cellHeight) {
    // Determine the direction from the second to the last cell
    let directionX = lastCell.x - secondLastCell.x;
    let directionY = lastCell.y - secondLastCell.y;

    const direction = this.getDirection(directionX, directionY);
    console.log(direction);

    // Check for obstacles in all adjacent cells to the last cell
    const leftObstacle = this.grid.getCell(lastCell.x - 1, lastCell.y).state === "OBSTACLE";
    const rightObstacle = this.grid.getCell(lastCell.x + 1, lastCell.y).state === "OBSTACLE";
    const topObstacle = this.grid.getCell(lastCell.x, lastCell.y - 1).state === "OBSTACLE";
    const bottomObstacle = this.grid.getCell(lastCell.x, lastCell.y + 1).state === "OBSTACLE";
    const topLeftObstacle = this.grid.getCell(lastCell.x - 1, lastCell.y - 1).state === "OBSTACLE";
    const topRightObstacle = this.grid.getCell(lastCell.x + 1, lastCell.y - 1).state === "OBSTACLE";
    const bottomLeftObstacle = this.grid.getCell(lastCell.x - 1, lastCell.y + 1).state === "OBSTACLE";
    const bottomRightObstacle = this.grid.getCell(lastCell.x + 1, lastCell.y + 1).state === "OBSTACLE";

    let endX = 0;
    let endY = 0;

    // TODO: these need to be adjusted for multiple edges going in on a single node

    // End adjustment to touch the middle of the top edge of the last cell
    // endX = lastCell.x * cellWidth + cellWidth / 2;
    // endY = lastCell.y * cellHeight;

    // // End adjustment to touch middle of the right edge of the last cell
    // endX = lastCell.x * cellWidth + cellWidth;
    // endY = lastCell.y * cellHeight + cellHeight / 2;

    // End adjustment to touch middle of the left edge of the last cell
    // endX = (lastCell.x * cellWidth);
    // endY = lastCell.y * cellHeight + cellHeight / 2;

    // End adjustment to touch middle of the bottom edge of the last cell
    // endX = lastCell.x * cellWidth + cellWidth / 2;
    // endY = lastCell.y * cellHeight + cellHeight;

    // End adjustment to touch top right corner of the last cell
    // endX = lastCell.x * cellWidth + cellWidth;
    // endY = lastCell.y * cellHeight;

    // End adjustment to touch top left corner of the last cell
    // endX = lastCell.x * cellWidth;
    // endY = lastCell.y * cellHeight;

    // End adjustment to touch bottom left corner of the last cell
    // endX = lastCell.x * cellWidth;
    // endY = lastCell.y * cellHeight + cellHeight;

    // End adjustment to touch bottom right corner of the last cell
    endX = lastCell.x * cellWidth + cellWidth;
    endY = lastCell.y * cellHeight + cellHeight;

    // function should return x, y coordinates of docking point of edge
    return { endX, endY };
  }

  getDirection(directionX, directionY) {
    if (directionX === 0 && directionY < 0) {
      return "up";
    } else if (directionX === 0 && directionY > 0) {
      return "down";
    } else if (directionX > 0 && directionY === 0) {
      return "right";
    } else if (directionX < 0 && directionY === 0) {
      return "left";
    } else if (directionX > 0 && directionY < 0) {
      return "up-right";
    } else if (directionX < 0 && directionY < 0) {
      return "up-left";
    } else if (directionX > 0 && directionY > 0) {
      return "down-right";
    } else if (directionX < 0 && directionY > 0) {
      return "down-left";
    } else {
      return "stationary"; // This case implies no movement
    }
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
