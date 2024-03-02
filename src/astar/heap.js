export class Heap {
    // max. size of the heap is, since an array is difficult to resize
    // in case of our use case (poath finding) -> size-of-grid-X * size-of-grid-Y to get the max. amount of nodes that could be in the heap at any given time

    // we actually don't need to know maxHeapSize, as javascript arrays are dynamic
    constructor(context, maxHeapSize) {
        this.items = [];
        this.currentItemCount = 0;

    }

}