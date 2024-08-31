import { IntervalOverlap } from "..";

describe("IntervalOverlap", () => {
  let intervalOverlap: IntervalOverlap;

  beforeEach(() => {
    const intervals = [
      { begin: 1, end: 2, id: "interval-1" },
      { begin: 1, end: 3, id: "interval-2" },
      { begin: 1, end: 6, id: "interval-3" },
      { begin: 6, end: 8, id: "interval-4" },
      { begin: 8, end: 10, id: "interval-5" }
    ];
    intervalOverlap = new IntervalOverlap(intervals);
  });

  test("Add new interval", () => {
    intervalOverlap.addInterval({
      begin: 11,
      end: 12,
      id: "interval-6"
    });
    const result = intervalOverlap.getIntervalGroups();
    const expected = [
      [
        { begin: 1, end: 2, id: "interval-1" },
        { begin: 1, end: 3, id: "interval-2" },
        { begin: 1, end: 6, id: "interval-3" }
      ],
      [{ begin: 6, end: 8, id: "interval-4" }],
      [{ begin: 8, end: 10, id: "interval-5" }],
      [{ begin: 11, end: 12, id: "interval-6" }]
    ];
    expect(result).toEqual(expect.arrayContaining(expected));
  });

  test("Prevent adding duplicate interval", () => {
    expect(() =>
      intervalOverlap.addInterval({ begin: 1, end: 2, id: "interval-1" })
    ).toThrow(`Interval with id "interval-1" already exists.`);
  });

  test("Remove existing interval", () => {
    intervalOverlap.removeInterval("interval-1");
    const result = intervalOverlap.getIntervalGroups();
    const expected = [
      [
        { begin: 1, end: 3, id: "interval-2" },
        { begin: 1, end: 6, id: "interval-3" }
      ],
      [{ begin: 6, end: 8, id: "interval-4" }],
      [{ begin: 8, end: 10, id: "interval-5" }]
    ];
    expect(result).toEqual(expect.arrayContaining(expected));
  });

  test("Handle removal of non-existent interval", () => {
    expect(() => intervalOverlap.removeInterval("interval-6")).toThrow(
      `Interval with id "interval-6" does not exist.`
    );
  });

  test("Update existing interval", () => {
    intervalOverlap.updateInterval({
      begin: 9,
      end: 10,
      id: "interval-1"
    });
    const result = intervalOverlap.getIntervalGroups();
    const expected = [
      [
        { begin: 9, end: 10, id: "interval-1" },
        { begin: 8, end: 10, id: "interval-5" }
      ],
      [
        { begin: 1, end: 3, id: "interval-2" },
        { begin: 1, end: 6, id: "interval-3" }
      ],
      [{ begin: 6, end: 8, id: "interval-4" }]
    ];
    expect(result).toEqual(expect.arrayContaining(expected));
  });

  test("Prevent updating non-existent interval", () => {
    expect(() =>
      intervalOverlap.updateInterval({ begin: 11, end: 12, id: "interval-6" })
    ).toThrow(`Interval with id "interval-6" does not exist.`);
  });

  test("Find overlapping intervals", () => {
    const result = intervalOverlap.findOverlappingIntervals("interval-1");
    const expected = [
      { begin: 1, end: 2, id: "interval-1" },
      { begin: 1, end: 3, id: "interval-2" },
      { begin: 1, end: 6, id: "interval-3" }
    ];
    expect(result).toEqual(expect.arrayContaining(expected));
  });

  test("Find intervals within a range", () => {
    const result = intervalOverlap.findIntervalsInRange(1, 4);
    const expected = [
      { begin: 1, end: 2, id: "interval-1" },
      { begin: 1, end: 3, id: "interval-2" },
      { begin: 1, end: 6, id: "interval-3" }
    ];
    expect(result).toEqual(expect.arrayContaining(expected));
  });

  test("Retrieve interval groups", () => {
    const result = intervalOverlap.getIntervalGroups();
    const expected = [
      [
        { begin: 1, end: 2, id: "interval-1" },
        { begin: 1, end: 3, id: "interval-2" },
        { begin: 1, end: 6, id: "interval-3" }
      ],
      [{ begin: 6, end: 8, id: "interval-4" }],
      [{ begin: 8, end: 10, id: "interval-5" }]
    ];
    expect(result).toEqual(expect.arrayContaining(expected));
  });

  test("Throw error for non-existent interval in findOverlappingIntervals", () => {
    const nonExistentId = "non-existent-id";
    expect(() => {
      intervalOverlap.findOverlappingIntervals(nonExistentId);
    }).toThrow(`Interval with id "${nonExistentId}" does not exist.`);
  });

  test("Throw error for missing interval during grouping", () => {
    intervalOverlap["intervals"].delete("interval-4"); // Simulate removal

    jest
      .spyOn(intervalOverlap as any, "getConnectedIntervals")
      .mockImplementation(id => {
        if (id === "interval-1") {
          return new Set(["interval-2", "interval-4"]); // 'interval-4' is removed
        }
        return new Set();
      });

    expect(() => {
      intervalOverlap.getIntervalGroups();
    }).toThrow(/does not exist/);
  });
});
