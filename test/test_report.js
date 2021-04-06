// Copyright (c) Adrien Cransac
// License: MIT

const { readFundsFromJson } = require('../src/fund.js');
const { reportOnFunds } = require('../src/report.js');
const Test = require('@acransac/tester');

// # Helpers

function control() {
  return [
    "# Test Fund 1",
    "## Relative Market Value",
    "",
    "     200.00 ┤╭╮ ",
    "     192.86 ┤││ ",
    "     185.71 ┤││ ",
    "     178.57 ┤││ ",
    "     171.43 ┤││ ",
    "     164.29 ┤││ ",
    "     157.14 ┤││ ",
    "     150.00 ┤│╰ ",
    "     142.86 ┤│  ",
    "     135.71 ┤│  ",
    "     128.57 ┤│  ",
    "     121.43 ┤│  ",
    "     114.29 ┤│  ",
    "     107.14 ┤│  ",
    "     100.00 ┼╯  ",
    "             ──>",
    "             J ",
    "               ",
    "",
    "### Highlights",
    "",
    "| Highlights     | Value            |",
    "| -------------- | ---------------- |",
    "| Begin          | 100.00           |",
    "| End            | 150.00           |",
    "| Min            | 100.00           |",
    "| Max            | 200.00           |",
    "| Last Variation | -50.00 (-25.00%) |",
    "",
    "### History",
    "",
    "| Date         | Index Value |",
    "| ------------ | ----------- |",
    "| Jan 24, 2021 | 100.00      |",
    "| Jan 25, 2021 | 200.00      |",
    "| Jan 26, 2021 | 150.00      |",
    "",
    "## Return On Investment",
    "",
    "     100.00 ┼╭╮ ",
    "      92.86 ┤││ ",
    "      85.71 ┤││ ",
    "      78.57 ┤││ ",
    "      71.43 ┤││ ",
    "      64.29 ┤││ ",
    "      57.14 ┤││ ",
    "      50.00 ┤│╰ ",
    "      42.86 ┤│  ",
    "      35.71 ┤│  ",
    "      28.57 ┤│  ",
    "      21.43 ┤│  ",
    "      14.29 ┤│  ",
    "       7.14 ┤│  ",
    "       0.00 ┼╯  ",
    "             ──>",
    "             J ",
    "               ",
    "",
    "### Highlights",
    "",
    "| Highlights     | Value            |",
    "| -------------- | ---------------- |",
    "| Begin          | 0.00             |",
    "| End            | 50.00            |",
    "| Min            | 0.00             |",
    "| Max            | 100.00           |",
    "| Last Variation | -50.00 (-50.00%) |",
    "",
    "### History",
    "",
    "| Date         | Index Value |",
    "| ------------ | ----------- |",
    "| Jan 24, 2021 | 0.00        |",
    "| Jan 25, 2021 | 100.00      |",
    "| Jan 26, 2021 | 50.00       |",
    "",
    "# Test Fund 2",
    "## Relative Market Value",
    "",
    "     100.00 ┼─╮ ",
    "      98.21 ┤ │ ",
    "      96.43 ┤ │ ",
    "      94.64 ┤ │ ",
    "      92.86 ┤ │ ",
    "      91.07 ┤ │ ",
    "      89.29 ┤ │ ",
    "      87.50 ┤ │ ",
    "      85.71 ┤ │ ",
    "      83.93 ┤ │ ",
    "      82.14 ┤ │ ",
    "      80.36 ┤ │ ",
    "      78.57 ┤ │ ",
    "      76.79 ┤ │ ",
    "      75.00 ┤ ╰ ",
    "             ──>",
    "             J ",
    "               ",
    "",
    "### Highlights",
    "",
    "| Highlights     | Value            |",
    "| -------------- | ---------------- |",
    "| Begin          | 100.00           |",
    "| End            | 75.00            |",
    "| Min            | 75.00            |",
    "| Max            | 100.00           |",
    "| Last Variation | -25.00 (-25.00%) |",
    "",
    "### History",
    "",
    "| Date         | Index Value |",
    "| ------------ | ----------- |",
    "| Jan 24, 2021 | 100.00      |",
    "| Jan 25, 2021 | 100.00      |",
    "| Jan 26, 2021 | 75.00       |",
    "",
    "## Return On Investment",
    "",
    "       0.00 ┼─╮ ",
    "      -1.79 ┤ │ ",
    "      -3.57 ┤ │ ",
    "      -5.36 ┤ │ ",
    "      -7.14 ┤ │ ",
    "      -8.93 ┤ │ ",
    "     -10.71 ┤ │ ",
    "     -12.50 ┤ │ ",
    "     -14.29 ┤ │ ",
    "     -16.07 ┤ │ ",
    "     -17.86 ┤ │ ",
    "     -19.64 ┤ │ ",
    "     -21.43 ┤ │ ",
    "     -23.21 ┤ │ ",
    "     -25.00 ┼ ╰ ",
    "             ──>",
    "             J ",
    "               ",
    "",
    "### Highlights",
    "",
    "| Highlights     | Value               |",
    "| -------------- | ------------------- |",
    "| Begin          | 0.00                |",
    "| End            | -25.00              |",
    "| Min            | -25.00              |",
    "| Max            | 0.00                |",
    "| Last Variation | -25.00 (-Infinity%) |",
    "",
    "### History",
    "",
    "| Date         | Index Value |",
    "| ------------ | ----------- |",
    "| Jan 24, 2021 | 0.00        |",
    "| Jan 25, 2021 | 0.00        |",
    "| Jan 26, 2021 | -25.00      |",
    "",
  ].join("\n");
}

function testFunds() {
  return JSON.stringify([
    {
      fundName: "Test Fund 1",
      currency: "USD",
      assetsValues: [
        {valueDate: new Date(2021, 0, 24), marketValue: 1000.0, addedCash: 1000.0},
        {valueDate: new Date(2021, 0, 25), marketValue: 2000.0, addedCash: 0.0},
        {valueDate: new Date(2021, 0, 26), marketValue: 1500.0, addedCash: 0.0}
      ]
    },
    {
      fundName: "Test Fund 2",
      currency: "EUR",
      assetsValues: [
        {valueDate: new Date(2021, 0, 24), marketValue: 1000.0, addedCash: 1000.0},
        {valueDate: new Date(2021, 0, 25), marketValue: 2000.0, addedCash: 1000.0},
        {valueDate: new Date(2021, 0, 26), marketValue: 1500.0, addedCash: 0.0}
      ]
    }
  ]);
}

// # Tests

function test_reportOnFunds(finish, check) {
  return finish(check(
    reportOnFunds(readFundsFromJson(testFunds()), new Date(2021, 0, 24), new Date(2021, 0, 26), 120, 15) === control()));
}

function test_reportOnFundsUnspecifiedInterval(finish, check) {
  return finish(check(
    reportOnFunds(readFundsFromJson(testFunds()), undefined, undefined, 120, 15) === control()));
}

Test.run([
  Test.makeTest(test_reportOnFunds, "Report On Funds"),
  Test.makeTest(test_reportOnFundsUnspecifiedInterval, "Report On Funds With Unspecified Interval")
], "Test Report");
