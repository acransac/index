// Copyright (c) Adrien Cransac
// License: MIT

const { makeAssetsValue } = require('../src/assetsvalue.js');
const { relativeMarketValue } = require('../src/index.js');
const { indexHighlights, indexHistory } = require('../src/log.js');

test("Log Index Highlights When Intervals Match", () => {
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

  expect(indexHighlights(
    assetsValues,
    relativeMarketValue(assetsValues),
    new Date(2021, 0, 24),
    new Date(2021, 0, 26)))
    .toBe(control);
});

test("Log Index Highlights When Intervals Don't Match", () => {
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

  expect(indexHighlights(
    assetsValues,
    relativeMarketValue(assetsValues),
    new Date(2021, 0, 25),
    new Date(2021, 0, 27)))
    .toBe(control);
});

test("Log Index History When Intervals Match", () => {
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

  expect(indexHistory(
    assetsValues,
    relativeMarketValue(assetsValues),
    new Date(2021, 0, 24),
    new Date(2021, 0, 26)))
    .toBe(control);
});

test("Log Index History When Intervals Don't Match", () => {
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

  expect(indexHistory(
    assetsValues,
    relativeMarketValue(assetsValues),
    new Date(2021, 0, 25),
    new Date(2021, 0, 27)))
    .toBe(control);
});
