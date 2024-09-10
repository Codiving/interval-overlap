export type Interval<T extends Date | number = number, Extra = {}> = {
  begin: T;
  end: T;
  id: string;
} & Extra;

interface Graph {
  [key: string]: string[];
}

export class IntervalOverlap<T extends Date | number = number, Extra = {}> {
  private intervals: Map<string, Interval<T, Extra>> = new Map();
  private graph: Graph = {};

  constructor(initialIntervals: Interval<T, Extra>[]) {
    initialIntervals.forEach((interval) => this.addOrUpdateInterval(interval));
  }

  private addOrUpdateInterval(interval: Interval<T, Extra>): void {
    this.intervals.set(interval.id, interval);
    this.updateGraph();
  }

  private updateGraph(): void {
    const newGraph: Graph = {};

    for (const interval of this.intervals.values()) {
      newGraph[interval.id] = [];
      for (const other of this.intervals.values()) {
        if (interval.id !== other.id && this.isOverlapping(interval, other)) {
          newGraph[interval.id].push(other.id);
        }
      }
    }

    this.graph = newGraph;
  }

  addInterval(interval: Interval<T, Extra>): void {
    if (this.intervals.has(interval.id)) {
      throw new Error(`Interval with id "${interval.id}" already exists.`);
    }
    this.addOrUpdateInterval(interval);
  }

  removeInterval(id: string): void {
    if (this.intervals.delete(id)) {
      this.updateGraph();
    } else {
      throw new Error(`Interval with id "${id}" does not exist.`);
    }
  }

  updateInterval(updatedInterval: Interval<T, Extra>): void {
    if (this.intervals.has(updatedInterval.id)) {
      this.addOrUpdateInterval(updatedInterval);
    } else {
      throw new Error(
        `Interval with id "${updatedInterval.id}" does not exist.`
      );
    }
  }

  private isOverlapping(a: Interval<T, Extra>, b: Interval<T, Extra>): boolean {
    return !(a.end <= b.begin || b.end <= a.begin);
  }

  findOverlappingIntervals(start: string): Interval<T, Extra>[] {
    const queue: string[] = [start];
    const visited: Set<string> = new Set(queue);
    const result: Set<Interval<T, Extra>> = new Set();

    while (queue.length > 0) {
      const current = queue.shift();
      if (current) {
        const interval = this.intervals.get(current);
        if (!interval) {
          throw Error(`Interval with id "${current}" does not exist.`);
        }

        result.add(interval);
        for (const neighbor of this.graph[current]) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
          }
        }
      }
    }

    return Array.from(result);
  }

  findIntervalsInRange(begin: Date, end: Date): Interval<T, Extra>[];
  findIntervalsInRange(begin: number, end: number): Interval<T, Extra>[];

  findIntervalsInRange(
    begin: number | Date,
    end: number | Date
  ): Interval<T, Extra>[] {
    const tempInterval: Interval<T, Extra> = {
      begin,
      end,
      id: "temp",
    } as Interval<T, Extra>;
    const tempGraph: Graph = {};

    for (const interval of this.intervals.values()) {
      if (this.isOverlapping(interval, tempInterval)) {
        tempGraph[interval.id] = [];
        for (const other of this.intervals.values()) {
          if (interval.id !== other.id && this.isOverlapping(interval, other)) {
            tempGraph[interval.id].push(other.id);
          }
        }
      }
    }

    const queue: string[] = [];
    const visited: Set<string> = new Set();
    const result: Set<Interval<T, Extra>> = new Set();

    for (const intervalId in tempGraph) {
      queue.push(intervalId);
      visited.add(intervalId);
    }

    while (queue.length > 0) {
      const current = queue.shift();
      if (current && tempGraph[current]) {
        const interval = this.intervals.get(current);
        if (!interval) {
          throw Error(`Interval with id "${current}" does not exist.`);
        }

        result.add(interval);
        for (const neighbor of tempGraph[current]) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
          }
        }
      }
    }

    return Array.from(result);
  }

  private getConnectedIntervals(startId: string): Set<string> {
    const queue: string[] = [startId];
    const visited: Set<string> = new Set(queue);

    while (queue.length > 0) {
      const current = queue.shift();
      if (current) {
        for (const neighbor of this.graph[current]) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
          }
        }
      }
    }

    return visited;
  }

  getIntervalGroups(): Interval<T, Extra>[][] {
    const allIds = new Set(this.intervals.keys());
    const result: Interval<T, Extra>[][] = [];

    while (allIds.size > 0) {
      const id = allIds.values().next().value;
      if (id) {
        const connectedIds = this.getConnectedIntervals(id);
        const group: Interval<T, Extra>[] = [];

        connectedIds.forEach((connectedId) => {
          const interval = this.intervals.get(connectedId);
          if (!interval) {
            throw Error(`Interval with id "${connectedId}" does not exist.`);
          }

          group.push(interval);
          allIds.delete(connectedId);
        });

        result.push(group);
      }
    }

    return result;
  }

  values(): Interval<T, Extra>[] {
    return Array.from(this.intervals.values());
  }
}
