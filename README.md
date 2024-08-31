# IntervalOverlap

A class for efficiently managing and analyzing intervals, including detecting overlaps and grouping connected intervals.

## Installation

Package manager

Using npm:
`npm install dental-notation`

Using yarn:
`yarn add dental-notation`

Using pnpm:
`pnpm add dental-notation`

## Example

```typescript
const intervals = [
  { begin: 1, end: 2, id: "interval-1" },
  { begin: 1, end: 3, id: "interval-2" },
  { begin: 1, end: 6, id: "interval-3" },
  { begin: 6, end: 8, id: "interval-4" },
  { begin: 8, end: 10, id: "interval-5" }
];

const intervalOverlap = new IntervalOverlap(intervals);

// find intervals that overlap with a specific interval
const overlappingIntervals =
  intervalOverlap.findOverlappingIntervals("interval-1");
console.log(overlappingIntervals);
// [
//   {
//     begin: 1, end: 2, id: "interval-1"
//   },
//   {
//     begin: 1, end: 3, id: "interval-2"
//   },
//   {
//     begin: 1, end: 6, id: "interval-3"
//   }
// ];

// find intervals that overlap with a specific range
const intervalsInRange = intervalOverlap.findIntervalsInRange(2, 7);
console.log(intervalsInRange);
// [
//   {
//     begin: 1, end: 3, id: "interval-2"
//   },
//   {
//     begin: 1, end: 6, id: "interval-3"
//   },
//   {
//     begin: 6, end: 8, id: "interval-4"
//   }
// ];

// group intervals that are directly or indirectly overlapping
const overlappingGroups = intervalOverlap.getIntervalGroups();
console.log(overlappingGroups);
// [
//   [
//     {
//       begin: 1, end: 2, id: "interval-1"
//     },
//     {
//       begin: 1, end: 3, id: "interval-2"
//     },
//     {
//       begin: 1, end: 6, id: "interval-3"
//     }
//   ],
//   [
//     {
//       begin: 6, end: 8, id: "interval-4"
//     }
//   ],
//   [
//     {
//       begin: 8, end: 10, id: "interval-5"
//     }
//   ]
// ];
```
