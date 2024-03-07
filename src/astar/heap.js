class HeapItem {
  constructor(value) {
    this.value = value;
    this.heapIndex = 0; // Initialized heap index
  }

  // Example implementation of compareTo method
  compareTo(otherItem) {
    // Compare based on value
    return this.value - otherItem.value;
  }
}

export class Heap {
  // max. size of the heap is, since an array is difficult to resize
  // in case of our use case (poath finding) -> size-of-grid-X * size-of-grid-Y to get the max. amount of nodes that could be in the heap at any given time

  // we actually don't need to know maxHeapSize, as javascript arrays are dynamic
  constructor(context) {
    this.items = [];
    this.currentItemCount = 0;
  }

  // Method to add an item to the heap
  addItem(heapItem) {
    // I want each item to keep track of its own index in the heap and two items need to be comparable -> to say which item has the higher priority and
    // sort it in the heap
    this.items.push(heapItem);
    heapItem.heapIndex = this.currentItemCount;
    this.currentItemCount++;
    this.sortUp(heapItem);
  }

  // Helper method to maintain heap property (min or max) after adding an item
  sortUp(heapItem) {
    let currentIndex = heapItem.heapIndex;
    while (true) {
      let parentIndex = Math.floor((currentIndex - 1) / 2);
      let parentItem = this.items[parentIndex];
      if (heapItem.compareTo(parentItem) < 0) {
        this.swapItems(heapItem, parentItem);
      } else {
        break;
      }
      currentIndex = parentIndex;
    }
  }

  // Method to swap items in the heap
  swapItems(item1, item2) {
    const index1 = item1.heapIndex;
    const index2 = item2.heapIndex;
    this.items[index1] = item2;
    this.items[index2] = item1;
    item1.heapIndex = index2;
    item2.heapIndex = index1;
  }
}

// // Example usage
// const heap = new Heap();
// heap.addItem(new HeapItem(5));
// heap.addItem(new HeapItem(3));
// heap.addItem(new HeapItem(8));
// heap.addItem(new HeapItem(1));

// console.log(heap.items.map(item => item.value)); // Output: [1, 3, 8, 5] (heapified array)
