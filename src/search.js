import { PriorityQueue } from './queue.js';

// Create an instance of PriorityQueue
const pq = new PriorityQueue();


function a_star(graph, startNode, targetNode) {
    let OPEN = [] // queue of nodes to be evaluated
    let CLOSED = [] // queue of nodes already evaluated

    // add start node to OPEN
    open[0] = startNode;

    while (true) {
        // TODO: loop through OPEN and set current node to 
        // node in OPEN with lowest f-cost
        let current = open[0]

        // TODO: remove current from OPEN
        // TODO: add current to CLOSED


        if (current === targetNode) // path has been found
            // draw edge to node
            return

        
        // foreach neighbour of the current node
            // if neighbour is not traversable or neighbour is in CLOSED
                // skip to the next neighbour
            
            // if new path to neighbour is shorter OR neighbour is not in OPEN
                // set f_cost of neighbour
                // set parent of neighbour to current
                // if neighbour is not in OPEN
                    // add neighbour to OPEN


    }

}