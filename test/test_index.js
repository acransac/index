// Copyright (c) Adrien Cransac
// License: No license

const { makeAssetsValue } = require('../src/assetsvalue.js');
const { assetsValues, readFundsFromJson } = require('../src/fund.js');
const { index, returnOnInvestment } = require('../src/index.js');
const Test = require('@acransac/tester');

// # Helpers

function areArraysEqual(a, b) {
  return a.length === b.length && a.filter((element, index) => element !== b[index]).length === 0;
}

// # Tests
// ## Relative Market Value

function test_emptyIndex(finish, check) {
  return finish(check(areArraysEqual(index([]), [])));
}

function test_oneValueIndex(finish, check) {
  return finish(check(areArraysEqual(index([makeAssetsValue(new Date(2021, 0, 24), 1000.0, 0.0)]), [100])));
}

function test_indexWithoutAddedCash(finish, check) {
  return finish(check(areArraysEqual(index([makeAssetsValue(new Date(2021, 0, 24), 1000.0, 0.0),
                                            makeAssetsValue(new Date(2021, 0, 25), 2000.0, 0.0),
                                            makeAssetsValue(new Date(2021, 0, 26), 1500.0, 0.0)]),
                                     [100, 200, 150])));
}

function test_indexWithAddedCash(finish, check) {
  return finish(check(areArraysEqual(index([makeAssetsValue(new Date(2021, 0, 24), 1000.0, 0.0),
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

  return finish(check(areArraysEqual(index(assetsValues(readFundsFromJson(testFundJson)[0])), [100, 200, 150])));
}

// ## Return On Investment

function test_returnOnInvestmentEmptyIndex(finish, check) {
  return finish(check(areArraysEqual(returnOnInvestment([]), [])));
}

function test_returnOnInvestmentOneValueIndex(finish, check) {
  return finish(check(areArraysEqual(returnOnInvestment([makeAssetsValue(new Date(2021, 0, 24), 1000.0, 1000.0)]), [0])));
}

Test.run([
  Test.makeTest(test_emptyIndex, "Empty Index"),
  Test.makeTest(test_oneValueIndex, "One-Value Index"),
  Test.makeTest(test_indexWithoutAddedCash, "Index Without Added Cash"),
  Test.makeTest(test_indexWithAddedCash, "Index With Added Cash"),
  Test.makeTest(test_indexFromFundJson, "Index From Fund JSON"),
  Test.makeTest(test_returnOnInvestmentEmptyIndex, "Return On Investment, Empty Index"),
  Test.makeTest(test_returnOnInvestmentOneValueIndex, "Return On Investment, One-Value Index")
], "Test Index");
