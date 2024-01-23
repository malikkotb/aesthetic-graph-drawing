import { PriorityQueue } from './queue.js';

// Create an instance of PriorityQueue
const pq = new PriorityQueue();

// Enqueue some tasks with priorities
pq.enqueue("Task 1", 3); // Lower number indicates higher priority
pq.enqueue("Task 2", 1);
pq.enqueue("Task 3", 2);

// Process the tasks
while (!pq.isEmpty()) {
    // let task = pq.dequeue();
    // console.log("Processing:", task);
    // Output will be: Task 2, Task 3, Task 1 (based on priority)
    const { item, priority} = pq.dequeue();
    console.log("Item: ", item, ", prio: ", priority);

}

// Check the size of the queue
console.log("Number of tasks in the queue:", pq.size());

pq.enqueue("Task 4", 2);

// Peek at the next task without removing it
let nextTask = pq.peek();
console.log("Next task to be processed:", nextTask);

// output will show the tasks being processed in the order of their priority
