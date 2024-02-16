
export class PathFinder {

    constructor(context, grid) {
        this.grid = grid;
        this.context = context;
    }

    // TODO: will have to loop through all edge-Connections and call this method for each
    findPath(startCell, targetCell) {
        console.log("startCell: ", startCell);   
        console.log("targetCell: ", targetCell);   

        this.grid.getCell(startCell.x, startCell.y)
        this.grid.getCell(targetCell.x, targetCell.y)

        // open set, for now -> List but can be optimized to use a Heap
        // https://stackfull.dev/heaps-in-javascript

        // closed set
        // Map docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
    }
}