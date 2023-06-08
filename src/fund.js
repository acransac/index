// Copyright (c) Adrien Cransac
// License: MIT

const { readAssetsValuesFromJson } = require('./assetsvalue.js');
const { readFileSync } = require('fs');

function makeFund(fundName, currency, assetsValues) {
  return [fundName, currency, assetsValues];
}

/*
 * Get the fund's name
 * @param {Fund} fund - The fund
 * @return {string}
 */
function fundName(fund) {
  return fund[0];
}

function currency(fund) {
  return fund[1];
}

/*
 * Get the assets' values from a fund
 * @param {Fund} fund - The fund
 * @return {[AssetsValue]}
 */
function assetsValues(fund) {
  return fund[2];
}

/*
 * Read fund data from JSON. There can be multiple funds
 * @param {string} filePath - The path to the file with the funds' JSON data. The latter is always
 *   an array of fund entries
 * @return {[Fund]}
 */
function readFundsFromJson(filePath) {
  return JSON.parse(readFileSync(filePath, {encoding: "utf8"})).map(fundJson =>
    makeFund(
      fundJson.fundName,
      fundJson.currency,
      readAssetsValuesFromJson(JSON.stringify(fundJson.assetsValues))));
}

module.exports = {
  assetsValues,
  fundName,
  readFundsFromJson
};
