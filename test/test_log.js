// Copyright (c) Adrien Cransac
// License: No license

const { makeAssetsValue } = require('../src/assetsvalue.js');
const { index } = require('../src/index.js');
const { indexHighlights } = require('../src/log.js');
const Test = require('@acransac/tester');

function test_logIndexHighlights(finish, check) {
  const assetsValues = [
    makeAssetsValue(new Date(2021, 0, 24), 1000.0, 0.0),
    makeAssetsValue(new Date(2021, 0, 25), 2000.0, 0.0),
    makeAssetsValue(new Date(2021, 0, 26), 1500.0, 0.0)
  ];

  const control = [
    "Begin:          100.00",
    "End:            150.00",
    "Min:            100.00",
    "Max:            200.00",
    "Last Variation: -50.00 (-25.00%)",
  ].join("\n");

  return finish(check(
    indexHighlights(assetsValues, index(assetsValues), new Date(2021, 0, 24), new Date(2021, 0, 26)) === control));
}

Test.run([
  Test.makeTest(test_logIndexHighlights, "Log Index Highlights")
], "Test Log");
