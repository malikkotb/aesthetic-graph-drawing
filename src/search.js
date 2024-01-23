import { PriorityQueue } from './queue.js';

// Create an instance of PriorityQueue
const pq = new PriorityQueue();

// Enqueue some tasks with priorities
pq.enqueue("Task 1", 3); // Lower number indicates higher priority
pq.enqueue("Task 2", 1);
pq.enqueue("Task 3", 2);

// Process the tasks
while (!pq.isEmpty()) {
    let task = pq.dequeue();
    console.log("Processing:", task);
    // Output will be: Task 2, Task 3, Task 1 (based on priority)
}

// Check the size of the queue
console.log("Number of tasks in the queue:", pq.size());
pq.enqueue("Task 4", 2);

// Peek at the next task without removing it
let nextTask = pq.peek();
console.log("Next task to be processed:", nextTask);

// The output will show the tasks being processed in the order of their priority,
// with Task 2 (priority 1) being processed first, followed by Task 3 (priority 2),
// and finally Task 1 (priority 3).
