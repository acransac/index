// Copyright (c) Adrien Cransac
// License: MIT

const { makeAssetsValue } = require('../src/assetsvalue.js');
const { relativeMarketValue } = require('../src/index.js');
const { plotIndex, plotTimeline } = require('../src/plot.js');

// # Index

test("Plot Interval Matches Index", () => {
  const assetsValues = [
    makeAssetsValue(new Date(2021, 0, 24), 1000.0, 0.0),
    makeAssetsValue(new Date(2021, 0, 25), 2000.0, 0.0),
    makeAssetsValue(new Date(2021, 0, 26), 1500.0, 0.0)
  ];

  const control = [
    "     200.00 ┤╭╮ ",
    "     190.00 ┤││ ",
    "     180.00 ┤││ ",
    "     170.00 ┤││ ",
    "     160.00 ┤││ ",
    "     150.00 ┤│╰ ",
    "     140.00 ┤│  ",
    "     130.00 ┤│  ",
    "     120.00 ┤│  ",
    "     110.00 ┤│  ",
    "     100.00 ┼╯  "
  ].join("\n");

  expect(plotIndex(
    assetsValues,
    relativeMarketValue(assetsValues),
    new Date(2021, 0, 24),
    new Date(2021, 0, 26),
    17,
    11))
    .toBe(control);
});

test("Plot Interval Earlier Than Index", () => {
  const assetsValues = [
    makeAssetsValue(new Date(2021, 0, 24), 1000.0, 0.0),
    makeAssetsValue(new Date(2021, 0, 25), 2000.0, 0.0),
    makeAssetsValue(new Date(2021, 0, 26), 1500.0, 0.0)
  ];

  const control = [
    "     200.00 ┤╭ ",
    "     190.00 ┤│ ",
    "     180.00 ┤│ ",
    "     170.00 ┤│ ",
    "     160.00 ┤│ ",
    "     150.00 ┤│ ",
    "     140.00 ┤│ ",
    "     130.00 ┤│ ",
    "     120.00 ┤│ ",
    "     110.00 ┤│ ",
    "     100.00 ┼╯ "
  ].join("\n");

  expect(plotIndex(
    assetsValues,
    relativeMarketValue(assetsValues),
    new Date(2021, 0, 23),
    new Date(2021, 0, 25),
    17,
    11))
    .toBe(control);
});

test("Plot Interval Later Than Index", () => {
  const assetsValues = [
    makeAssetsValue(new Date(2021, 0, 24), 1000.0, 0.0),
    makeAssetsValue(new Date(2021, 0, 25), 2000.0, 0.0),
    makeAssetsValue(new Date(2021, 0, 26), 1500.0, 0.0)
  ];

  const control = [
    "     200.00 ┼╮  ",
    "     195.00 ┤│  ",
    "     190.00 ┤│  ",
    "     185.00 ┤│  ",
    "     180.00 ┤│  ",
    "     175.00 ┤│  ",
    "     170.00 ┤│  ",
    "     165.00 ┤│  ",
    "     160.00 ┤│  ",
    "     155.00 ┤│  ",
    "     150.00 ┤╰─ "
  ].join("\n");

  expect(plotIndex(
    assetsValues,
    relativeMarketValue(assetsValues),
    new Date(2021, 0, 25),
    new Date(2021, 0, 27),
    17,
    11))
    .toBe(control);
});

test("Plot Interval Within Index", () => {
  const assetsValues = [
    makeAssetsValue(new Date(2021, 0, 23), 1000.0, 0.0),
    makeAssetsValue(new Date(2021, 0, 24), 1500.0, 0.0),
    makeAssetsValue(new Date(2021, 0, 25), 2000.0, 0.0),
    makeAssetsValue(new Date(2021, 0, 26), 1500.0, 0.0),
    makeAssetsValue(new Date(2021, 0, 27), 1000.0, 0.0)
  ];

  const control = [
    "     200.00 ┤╭╮ ",
    "     195.00 ┤││ ",
    "     190.00 ┤││ ",
    "     185.00 ┤││ ",
    "     180.00 ┤││ ",
    "     175.00 ┤││ ",
    "     170.00 ┤││ ",
    "     165.00 ┤││ ",
    "     160.00 ┤││ ",
    "     155.00 ┤││ ",
    "     150.00 ┼╯╰ "
  ].join("\n");

  expect(plotIndex(
    assetsValues,
    relativeMarketValue(assetsValues),
    new Date(2021, 0, 24),
    new Date(2021, 0, 26),
    17,
    11))
    .toBe(control);
});

test("Plot Height", () => {
  const assetsValues = [
    makeAssetsValue(new Date(2021, 0, 24), 1000.0, 0.0),
    makeAssetsValue(new Date(2021, 0, 25), 2000.0, 0.0),
    makeAssetsValue(new Date(2021, 0, 26), 1500.0, 0.0)
  ];

  expect(plotIndex(
    assetsValues,
    relativeMarketValue(assetsValues),
    new Date(2021, 0, 24),
    new Date(2021, 0, 26),
    17,
    10)
    .split("\n").length)
    .toBe(10);
});

test("Plot Width Bigger Than Interval", () => {
  const assetsValues = [
    makeAssetsValue(new Date(2021, 0, 24), 1000.0, 0.0),
    makeAssetsValue(new Date(2021, 0, 25), 2000.0, 0.0),
    makeAssetsValue(new Date(2021, 0, 26), 1500.0, 0.0)
  ];

  expect(plotIndex(
    assetsValues,
    relativeMarketValue(assetsValues),
    new Date(2021, 0, 24),
    new Date(2021, 0, 26),
    17,
    11)
    .split("\n").every(line => line.length <= 17))
    .toBe(true);
});

test("Plot Width Smaller Than Interval", () => {
  const assetsValues = [
    makeAssetsValue(new Date(2021, 0, 24), 1000.0, 0.0),
    makeAssetsValue(new Date(2021, 1, 10), 2000.0, 0.0),
    makeAssetsValue(new Date(2021, 1, 24), 1500.0, 0.0)
  ];

  expect(plotIndex(
    assetsValues,
    relativeMarketValue(assetsValues),
    new Date(2021, 0, 24),
    new Date(2021, 1, 24),
    17,
    11)
    .split("\n").every(line => line.length <= 17))
    .toBe(true);
});

// # Timeline

test("Plot Timeline", () => {
  const control1 = [
    "─────>",
    "D Jan",
    "  21 "
  ].join("\n");

  const control2 = [
    "────────>",
    "ASONDJFM",
    "2020 21 "
  ].join("\n");

  expect(plotTimeline(new Date(2020, 11, 30), new Date(2021, 0, 4), 6, 0)).toBe(control1);

  expect(plotTimeline(new Date(2020, 7, 1), new Date(2021, 3, 6), 9, 0)).toBe(control2);
});

test("Plot Timeline Width", () => {
  expect(plotTimeline(new Date(2020, 11, 30), new Date(2021, 0, 4), 5, 0)
    .split("\n").every(line => line.length <= 5))
    .toBe(true);
});

test("Plot Timeline Offset", () => {
  const control = [
    "  ─────>",
    "  D Jan",
    "    21 "
  ].join("\n");

  expect(plotTimeline(new Date(2020, 11, 30), new Date(2021, 0, 4), 8, 2)).toBe(control);
});
