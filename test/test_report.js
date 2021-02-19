// Copyright (c) Adrien Cransac
// License: No license

const { readFundsFromJson } = require('../src/fund.js');
const { reportOnFunds } = require('../src/report.js');
const Test = require('@acransac/tester');

function test_reportOnFunds(finish, check) {
  const testFundsJson = JSON.stringify([
    {
      fundName: "Test Fund 1",
      currency: "USD",
      assetsValues: [
        {valueDate: new Date(2021, 0, 24), marketValue: 1000.0, addedCash: 0.0},
        {valueDate: new Date(2021, 0, 25), marketValue: 2000.0, addedCash: 0.0},
        {valueDate: new Date(2021, 0, 26), marketValue: 1500.0, addedCash: 0.0}
      ]
    },
    {
      fundName: "Test Fund 2",
      currency: "EUR",
      assetsValues: [
        {valueDate: new Date(2021, 0, 24), marketValue: 1000.0, addedCash: 0.0},
        {valueDate: new Date(2021, 0, 25), marketValue: 2000.0, addedCash: 1000.0},
        {valueDate: new Date(2021, 0, 26), marketValue: 1500.0, addedCash: 0.0}
      ]
    }
  ]);

  const control = [
    "",
  ].join("\n");

  return finish(check(
    reportOnFunds(readFundsFromJson(testFundsJson), new Date(2021, 0, 24), new Date(2021, 0, 26), 120, 15) === control));
}

Test.run([
  Test.makeTest(test_reportOnFunds, "Report On Funds")
], "Test Report");
