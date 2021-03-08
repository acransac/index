// Copyright (c) Adrien Cransac
// License: No license

const { makeAssetsValue } = require('../src/assetsvalue.js');
const { assetsValues, readFundsFromJson } = require('../src/fund.js');
const { relativeMarketValue, returnOnInvestment } = require('../src/index.js');
const Test = require('@acransac/tester');

// # Helpers

function areArraysEqual(a, b, tolerance) {
  const areNear = (a, b) => {
    if (typeof a === "number" && typeof b === "number") {
      return Math.abs(a - b) <= (tolerance ? tolerance : 0);
    }
    else {
      return a === b;
    }
  };

  return a.length === b.length && a.filter((element, index) => !areNear(element, b[index])).length === 0;
}

// # Tests
// ## Relative Market Value

function test_relativeMarketValueWithoutValue(finish, check) {
  return finish(check(areArraysEqual(relativeMarketValue([]), [])));
}

function test_relativeMarketValueWithOneValue(finish, check) {
  return finish(check(areArraysEqual(relativeMarketValue([makeAssetsValue(new Date(2021, 0, 24), 1000.0, 0.0)]), [100])));
}

function test_relativeMarketValueWithoutAddedCash(finish, check) {
  return finish(check(areArraysEqual(relativeMarketValue([makeAssetsValue(new Date(2021, 0, 24), 1000.0, 0.0),
                                                          makeAssetsValue(new Date(2021, 0, 25), 2000.0, 0.0),
                                                          makeAssetsValue(new Date(2021, 0, 26), 1500.0, 0.0)]),
                                     [100, 200, 150])));
}

function test_relativeMarketValueWithAddedCash(finish, check) {
  return finish(check(areArraysEqual(relativeMarketValue([makeAssetsValue(new Date(2021, 0, 24), 1000.0, 0.0),
                                                          makeAssetsValue(new Date(2021, 0, 25), 2000.0, 1000.0),
                                                          makeAssetsValue(new Date(2021, 0, 26), 1500.0, 0.0)]),
                                     [100, 100, 75])));
}

function test_indexFromFundJson(finish, check) {
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

  return finish(check(areArraysEqual(relativeMarketValue(assetsValues(readFundsFromJson(testFundJson)[0])), [100, 200, 150])));
}

// ## Return On Investment

function test_returnOnInvestmentWithoutValue(finish, check) {
  return finish(check(areArraysEqual(returnOnInvestment([]), [])));
}

function test_returnOnInvestmentWithOneValue(finish, check) {
  return finish(check(areArraysEqual(returnOnInvestment([makeAssetsValue(new Date(2020, 0, 1), 1000.0, 1000.0)]), [0])));
}

function test_returnOnInvestmentExample(finish, check) {
  return finish(check(areArraysEqual(returnOnInvestment([makeAssetsValue(new Date(2020, 0, 1), 500.0, 500.0),
                                                         makeAssetsValue(new Date(2020, 6, 1), 1005.0, 500.0),
                                                         makeAssetsValue(new Date(2021, 0, 1), 1010.0, 0.0),
                                                         makeAssetsValue(new Date(2021, 6, 1), 1000.0, -10.0),
                                                         makeAssetsValue(new Date(2022, 0, 1), 990.0, 0.0)]),
                                     [0, 1, 1, 0.67, 0],
                                     0.01)));
}

Test.run([
  Test.makeTest(test_relativeMarketValueWithoutValue, "Relative Market Value Without Value"),
  Test.makeTest(test_relativeMarketValueWithOneValue, "Relative Market Value With One Value"),
  Test.makeTest(test_relativeMarketValueWithoutAddedCash, "Relative Market Value Without Added Cash"),
  Test.makeTest(test_relativeMarketValueWithAddedCash, "Relative Market Value With Added Cash"),
  Test.makeTest(test_indexFromFundJson, "Index From Fund JSON"),
  Test.makeTest(test_returnOnInvestmentWithoutValue, "Return On Investment Without Value"),
  Test.makeTest(test_returnOnInvestmentWithOneValue, "Return On Investment With One Value"),
  Test.makeTest(test_returnOnInvestmentExample, "Return On Investment Example")
], "Test Index");
