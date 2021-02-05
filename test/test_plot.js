// Copyright (c) Adrien Cransac
// License: No license

const { makeAssetsValue } = require('../src/assetsvalue.js');
const { index } = require('../src/index.js');
const { plotIndex } = require('../src/plot.js');
const Test = require('@acransac/tester');

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
    plotIndex(assetsValues, index(assetsValues), new Date(2021, 0, 24), new Date(2021, 0, 26), 10, 11) === control));
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
    plotIndex(assetsValues, index(assetsValues), new Date(2021, 0, 23), new Date(2021, 0, 25), 10, 11) === control));
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
    plotIndex(assetsValues, index(assetsValues), new Date(2021, 0, 25), new Date(2021, 0, 27), 10, 11) === control));
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
    plotIndex(assetsValues, index(assetsValues), new Date(2021, 0, 24), new Date(2021, 0, 26), 10, 11) === control));
}

function test_plotHeight(finish, check) {
  const assetsValues = [
    makeAssetsValue(new Date(2021, 0, 24), 1000.0, 0.0),
    makeAssetsValue(new Date(2021, 0, 25), 2000.0, 0.0),
    makeAssetsValue(new Date(2021, 0, 26), 1500.0, 0.0)
  ];

  return finish(check(
    plotIndex(assetsValues, index(assetsValues), new Date(2021, 0, 24), new Date(2021, 0, 26), 10, 10)
      .split("\n").length === 10));
}

Test.run([
  Test.makeTest(test_plotIntervalMatchesIndex, "Plot Interval Matches Index"),
  Test.makeTest(test_plotIntervalEarlierThanIndex, "Plot Interval Earlier Than Index"),
  Test.makeTest(test_plotIntervalLaterThanIndex, "Plot Interval Later Than Index"),
  Test.makeTest(test_plotIntervalWithinIndex, "Plot Interval Within Index"),
  Test.makeTest(test_plotHeight, "Plot Height")
], "Test Plot");
