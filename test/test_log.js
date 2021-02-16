// Copyright (c) Adrien Cransac
// License: No license

const { makeAssetsValue } = require('../src/assetsvalue.js');
const { index } = require('../src/index.js');
const { indexHighlights, indexHistory } = require('../src/log.js');
const Test = require('@acransac/tester');

function test_logIndexHighlightsIntervalsMatch(finish, check) {
  const assetsValues = [
    makeAssetsValue(new Date(2021, 0, 24), 1000.0, 0.0),
    makeAssetsValue(new Date(2021, 0, 25), 2000.0, 0.0),
    makeAssetsValue(new Date(2021, 0, 26), 1500.0, 0.0)
  ];

  const control = [
    "| Highlights     | Value            |",
    "| -------------- | ---------------- |",
    "| Begin          | 100.00           |",
    "| End            | 150.00           |",
    "| Min            | 100.00           |",
    "| Max            | 200.00           |",
    "| Last Variation | -50.00 (-25.00%) |"
  ].join("\n");

  return finish(check(
    indexHighlights(assetsValues, index(assetsValues), new Date(2021, 0, 24), new Date(2021, 0, 26)) === control));
}

function test_logIndexHighlightsIntervalsDontMatch(finish, check) {
  const assetsValues = [
    makeAssetsValue(new Date(2021, 0, 24), 1000.0, 0.0),
    makeAssetsValue(new Date(2021, 0, 25), 2000.0, 0.0),
    makeAssetsValue(new Date(2021, 0, 26), 1500.0, 0.0)
  ];

  const control = [
    "| Highlights     | Value            |",
    "| -------------- | ---------------- |",
    "| Begin          | 200.00           |",
    "| End            | 150.00           |",
    "| Min            | 150.00           |",
    "| Max            | 200.00           |",
    "| Last Variation | -50.00 (-25.00%) |"
  ].join("\n");

  return finish(check(
    indexHighlights(assetsValues, index(assetsValues), new Date(2021, 0, 25), new Date(2021, 0, 27)) === control));
}

function test_logIndexHistoryIntervalsMatch(finish, check) {
  const assetsValues = [
    makeAssetsValue(new Date(2021, 0, 24), 1000.0, 0.0),
    makeAssetsValue(new Date(2021, 0, 25), 2000.0, 0.0),
    makeAssetsValue(new Date(2021, 0, 26), 1500.0, 0.0)
  ];

  const control = [
    "| Date         | Index Value |",
    "| ------------ | ----------- |",
    "| Jan 24, 2021 | 100.00      |",
    "| Jan 25, 2021 | 200.00      |",
    "| Jan 26, 2021 | 150.00      |"
  ].join("\n");

  return finish(check(
    indexHistory(assetsValues, index(assetsValues), new Date(2021, 0, 24), new Date(2021, 0, 26)) === control));
}

function test_logIndexHistoryIntervalsDontMatch(finish, check) {
  const assetsValues = [
    makeAssetsValue(new Date(2021, 0, 24), 1000.0, 0.0),
    makeAssetsValue(new Date(2021, 0, 25), 2000.0, 0.0),
    makeAssetsValue(new Date(2021, 0, 26), 1500.0, 0.0)
  ];

  const control = [
    "| Date         | Index Value |",
    "| ------------ | ----------- |",
    "| Jan 25, 2021 | 200.00      |",
    "| Jan 26, 2021 | 150.00      |"
  ].join("\n");

  return finish(check(
    indexHistory(assetsValues, index(assetsValues), new Date(2021, 0, 25), new Date(2021, 0, 27)) === control));
}

Test.run([
  Test.makeTest(test_logIndexHighlightsIntervalsMatch, "Log Index Highlights When Intervals Match"),
  Test.makeTest(test_logIndexHighlightsIntervalsDontMatch, "Log Index Highlights When Intervals Don't Match"),
  Test.makeTest(test_logIndexHistoryIntervalsMatch, "Log Index History When Intervals Match"),
  Test.makeTest(test_logIndexHistoryIntervalsDontMatch, "Log Index History When Intervals Don't Match")
], "Test Log");
