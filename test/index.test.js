// Copyright (c) Adrien Cransac
// License: MIT

const { makeAssetsValue } = require('../src/assetsvalue.js');
const { CompoundCurve } = require('../src/compoundcurve.js');
const { assetsValues, readFundsFromJson } = require('../src/fund.js');
const { relativeMarketValue, returnOnInvestment } = require('../src/index.js');

// # Relative Market Value

test("Relative Market Value Without Assets Value", () => {
  expect(relativeMarketValue([])).toEqual([]);
});

test("Relative Market Value With One Assets Value", () => {
  expect(relativeMarketValue([makeAssetsValue(new Date(2021, 0, 24), 1000.0, 0.0)])).toEqual([100]);
});

test("Relative Market Value Without Added Cash", () => {
  expect(relativeMarketValue([
    makeAssetsValue(new Date(2021, 0, 24), 1000.0, 0.0),
    makeAssetsValue(new Date(2021, 0, 25), 2000.0, 0.0),
    makeAssetsValue(new Date(2021, 0, 26), 1500.0, 0.0)
  ]))
    .toEqual([100, 200, 150]);
});

test("Relative Market Value With Added Cash", () => {
  expect(relativeMarketValue([
    makeAssetsValue(new Date(2021, 0, 24), 1000.0, 0.0),
    makeAssetsValue(new Date(2021, 0, 25), 2000.0, 1000.0),
    makeAssetsValue(new Date(2021, 0, 26), 1500.0, 0.0)
  ]))
    .toEqual([100, 100, 75]);
});

test("Index From Fund Json", () => {
  const testFundJson = JSON.stringify([
    {
      fundName: "Test Fund",
      currency: "USD",
      assetsValues: [
        {valueDate: new Date(2021, 0, 24), marketValue: 1000.0, addedCash: 0.0},
        {valueDate: new Date(2021, 0, 25), marketValue: 2000.0, addedCash: 0.0},
        {valueDate: new Date(2021, 0, 26), marketValue: 1500.0, addedCash: 0.0}
      ]
    }
  ]);

  expect(relativeMarketValue(assetsValues(readFundsFromJson(testFundJson)[0])))
    .toEqual([100, 200, 150]);
});

// # Return On Investment

test("Return On Investment Without Assets Value", () => {
  expect(returnOnInvestment([], new CompoundCurve([["2020-01-01/2024-01-01", 1.00]]))).toEqual([]);
});

test("Return On Investment With One Assets Value", () => {
  expect(returnOnInvestment(
    [makeAssetsValue(new Date(2020, 0, 1), 1000.0, 1000.0)],
    new CompoundCurve([["2020-01-01/2024-01-01", 1.00]])))
    .toEqual([0]);
});

test("Return On Investment With Neutral Time Value Of Cash Flows", () => {
  const control = [0, 1, 1, 0.67, 0];

  const test = returnOnInvestment(
    [
      makeAssetsValue(new Date(2020, 0, 1), 500.0, 500.0),
      makeAssetsValue(new Date(2020, 6, 1), 1005.0, 500.0),
      makeAssetsValue(new Date(2021, 0, 1), 1010.0, 0.0),
      makeAssetsValue(new Date(2021, 6, 1), 1000.0, -10.0),
      makeAssetsValue(new Date(2022, 0, 1), 990.0, 0.0)
    ],
    new CompoundCurve([["2020-01-01/2024-01-01", 1.00]]));

  expect(test).toBeInstanceOf(Array);

  expect(test.length).toBe(control.length);

  test.forEach((indexValue, id) => expect(indexValue).toBeCloseTo(control[id]));
});

test("Return On Investment With Non-Neutral Time Value Of Cash Flows", () => {
  const control = [0, 0.50, 0, -0.65, -1.71];

  const test = returnOnInvestment(
    [
      makeAssetsValue(new Date(2020, 0, 1), 500.0, 500.0),
      makeAssetsValue(new Date(2020, 6, 1), 1005.0, 500.0),
      makeAssetsValue(new Date(2021, 0, 1), 1010.0, 0.0),
      makeAssetsValue(new Date(2021, 6, 1), 1000.0, -10.0),
      makeAssetsValue(new Date(2022, 0, 1), 990.0, 0.0)
    ],
    new CompoundCurve([
      ["2020-01-01/2020-10-01", 1.01],
      ["2020-10-01/2021-07-01", 1.02],
      ["2021-07-01/2024-01-01", 1.03]]));

  expect(test).toBeInstanceOf(Array);

  expect(test.length).toBe(control.length);

  test.forEach((indexValue, id) => expect(indexValue).toBeCloseTo(control[id]));
});
