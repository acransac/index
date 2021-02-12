// Copyright (c) Adrien Cransac
// License: No license

const { makeAssetsValue } = require('../src/assetsvalue.js');
const { index } = require('../src/index.js');
const { plotIndex, plotTimeline } = require('../src/plot.js');
const Test = require('@acransac/tester');

// # Index

function test_plotIntervalMatchesIndex(finish, check) {
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

  return finish(check(
    plotIndex(assetsValues, index(assetsValues), new Date(2021, 0, 24), new Date(2021, 0, 26), 17, 11) === control));
}

function test_plotIntervalEarlierThanIndex(finish, check) {
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

  return finish(check(
    plotIndex(assetsValues, index(assetsValues), new Date(2021, 0, 23), new Date(2021, 0, 25), 17, 11) === control));
}

function test_plotIntervalLaterThanIndex(finish, check) {
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

  return finish(check(
    plotIndex(assetsValues, index(assetsValues), new Date(2021, 0, 25), new Date(2021, 0, 27), 17, 11) === control));
}

function test_plotIntervalWithinIndex(finish, check) {
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

  return finish(check(
    plotIndex(assetsValues, index(assetsValues), new Date(2021, 0, 24), new Date(2021, 0, 26), 17, 11) === control));
}

function test_plotHeight(finish, check) {
  const assetsValues = [
    makeAssetsValue(new Date(2021, 0, 24), 1000.0, 0.0),
    makeAssetsValue(new Date(2021, 0, 25), 2000.0, 0.0),
    makeAssetsValue(new Date(2021, 0, 26), 1500.0, 0.0)
  ];

  return finish(check(
    plotIndex(assetsValues, index(assetsValues), new Date(2021, 0, 24), new Date(2021, 0, 26), 17, 10)
      .split("\n").length === 10));
}

function test_plotWidthBiggerThanInterval(finish, check) {
  const assetsValues = [
    makeAssetsValue(new Date(2021, 0, 24), 1000.0, 0.0),
    makeAssetsValue(new Date(2021, 0, 25), 2000.0, 0.0),
    makeAssetsValue(new Date(2021, 0, 26), 1500.0, 0.0)
  ];

  return finish(check(
    plotIndex(assetsValues, index(assetsValues), new Date(2021, 0, 24), new Date(2021, 0, 26), 17, 11)
      .split("\n").every(line => line.length <= 17)));
}

function test_plotWidthSmallerThanInterval(finish, check) {
  const assetsValues = [
    makeAssetsValue(new Date(2021, 0, 24), 1000.0, 0.0),
    makeAssetsValue(new Date(2021, 1, 10), 2000.0, 0.0),
    makeAssetsValue(new Date(2021, 1, 24), 1500.0, 0.0)
  ];

  return finish(check(
    plotIndex(assetsValues, index(assetsValues), new Date(2021, 0, 24), new Date(2021, 1, 24), 17, 11)
      .split("\n").every(line => line.length <= 17)));
}

// # Timeline

function test_plotTimeline(finish, check) {
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

  return finish(check(
    plotTimeline(new Date(2020, 11, 30), new Date(2021, 0, 4), 6, 0) === control1
      && plotTimeline(new Date(2020, 7, 1), new Date(2021, 3, 6), 9, 0) === control2));
}

function test_plotTimelineWidth(finish, check) {
  return finish(check(
    plotTimeline(new Date(2020, 11, 30), new Date(2021, 0, 4), 5, 0).split("\n").every(line => line.length <= 5)));
}

function test_plotTimelineOffset(finish, check) {
  const control = [
    "  ─────>",
    "  D Jan",
    "    21 "
  ].join("\n");

  return finish(check(plotTimeline(new Date(2020, 11, 30), new Date(2021, 0, 4), 6, 2) === control));
}

Test.run([
  Test.makeTest(test_plotIntervalMatchesIndex, "Plot Interval Matches Index"),
  Test.makeTest(test_plotIntervalEarlierThanIndex, "Plot Interval Earlier Than Index"),
  Test.makeTest(test_plotIntervalLaterThanIndex, "Plot Interval Later Than Index"),
  Test.makeTest(test_plotIntervalWithinIndex, "Plot Interval Within Index"),
  Test.makeTest(test_plotHeight, "Plot Height"),
  Test.makeTest(test_plotWidthBiggerThanInterval, "Plot Width Bigger Than Interval"),
  Test.makeTest(test_plotWidthSmallerThanInterval, "Plot Width Smaller Than Interval"),
  Test.makeTest(test_plotTimeline, "Plot Timeline"),
  Test.makeTest(test_plotTimelineWidth, "Plot Timeline Width"),
  Test.makeTest(test_plotTimelineOffset, "Plot Timeline Offset")
], "Test Plot");
