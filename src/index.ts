export type Interval =
  | {
      begin: number;
      end: number;
      id: string;
    }
  | {
      begin: Date;
      end: Date;
      id: string;
    };

interface Graph {
  [key: string]: string[];
}

export class IntervalOverlap {
  private intervals: Map<string, Interval> = new Map();
  private graph: Graph = {};

  constructor(initialIntervals: Interval[]) {
    initialIntervals.forEach(interval => this.addOrUpdateInterval(interval));
  }

  private addOrUpdateInterval(interval: Interval): void {
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

  addInterval(interval: Interval): void {
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

  updateInterval(updatedInterval: Interval): void {
    if (this.intervals.has(updatedInterval.id)) {
      this.addOrUpdateInterval(updatedInterval);
    } else {
      throw new Error(
        `Interval with id "${updatedInterval.id}" does not exist.`
      );
    }
  }

  private isOverlapping(a: Interval, b: Interval): boolean {
    return !(a.end <= b.begin || b.end <= a.begin);
  }

  findOverlappingIntervals(start: string): Interval[] {
    const queue: string[] = [start];
    const visited: Set<string> = new Set(queue);
    const result: Set<Interval> = new Set();

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

  findIntervalsInRange(begin: Date, end: Date): Interval[];
  findIntervalsInRange(begin: number, end: number): Interval[];

  findIntervalsInRange(begin: number | Date, end: number | Date): Interval[] {
    const tempInterval: Interval = { begin, end, id: "temp" } as Interval;
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
    const result: Set<Interval> = new Set();

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

  getIntervalGroups(): Interval[][] {
    const allIds = new Set(this.intervals.keys());
    const result: Interval[][] = [];

    while (allIds.size > 0) {
      const id = allIds.values().next().value;
      const connectedIds = this.getConnectedIntervals(id);
      const group: Interval[] = [];

      connectedIds.forEach(connectedId => {
        const interval = this.intervals.get(connectedId);
        if (!interval) {
          throw Error(`Interval with id "${connectedId}" does not exist.`);
        }

        group.push(interval);
        allIds.delete(connectedId);
      });

      result.push(group);
    }

    return result;
  }

  values(): Interval[] {
    return Array.from(this.intervals.values());
  }
}
