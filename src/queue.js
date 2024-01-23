export class PriorityQueue {
    constructor() {
        this.elements = [];
    }

    isEmpty() {
        return this.elements.length === 0;
    }

    enqueue(item, priority) {
        const element = { item, priority };
        this.elements.push(element);
        this.elements.sort((a, b) => a.priority - b.priority);
    }

    dequeue() {
        return this.elements.shift().item;
    }

    peek() {
        return this.elements.length === 0 ? undefined : this.elements[0].item;
    }

    size() {
        return this.elements.length;
    }
}

