// Copyright (c) Adrien Cransac
// License: No license

const { valueDate } = require('./assetsvalue.js');

// # Domains Checks

/*
 * Get a begin date that is in the plottable domain
 * @param {AssetsValue[]} assetsValues - The assets values
 * @param {Date} beginDate - The begin date that can be out of the plottable domain
 * @return {Date} - The earliest date in the plottable domain that is the closest to the input date
 */
function beginDateInPlottableDomain(assetsValues, beginDate) {
  return beginDate < valueDate(assetsValues[0]) ? valueDate(assetsValues[0]) : beginDate;
}

module.exports = {
 beginDateInPlottableDomain
};
