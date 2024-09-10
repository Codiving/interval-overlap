# IntervalOverlap

A class for efficiently managing and analyzing intervals, including detecting overlaps and grouping connected intervals.

## Installation

Package manager

Using npm:  
`npm install interval-overlap`

Using yarn:  
`yarn add interval-overlap`

Using pnpm:  
`pnpm add interval-overlap`

## Features

```typescript
const intervalOverlap = new IntervalOverlap([]);
```

`intervalOverlap.addInterval`  
Add interval

`intervalOverlap.updateInterval`  
Update interval

`intervalOverlap.removeInterval`  
Remove interval

`intervalOverlap.findOverlappingIntervals`  
Find intervals that overlap with a specific interval

`intervalOverlap.findIntervalsInRange`  
Find intervals that overlap with a specific range

`intervalOverlap.getIntervalGroups`  
Group intervals that are directly or indirectly overlapping

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

// Find intervals that overlap with a specific interval
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

// Find intervals that overlap with a specific range
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

// Group intervals that are directly or indirectly overlapping
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
