// Copyright (c) Adrien Cransac
// License: No license

const { readAssetsValuesFromJson } = require('./assetsvalue.js');

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
 * @param {string} jsonString - The funds' JSON data as a string. It is always an array of fund entries
 * @return {[Fund]}
 */
function readFundsFromJson(jsonString) {
  return JSON.parse(jsonString).map(fundJson => makeFund(fundJson.fundName,
                                                         fundJson.currency,
                                                         readAssetsValuesFromJson(JSON.stringify(fundJson.assetsValues))));
}

module.exports = {
  assetsValues,
  fundName,
  readFundsFromJson
};
