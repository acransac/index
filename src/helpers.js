// Copyright (c) Adrien Cransac
// License: MIT

const { valueDate } = require('./assetsvalue.js');

// # Time Domains
// There are two time domains:
// * the index domain, spanning the time interval starting with the earliest assets value and ending with the latest
// * the plottable domain, starting at the earliest assets value and unbounded later

/*
 * Get a date that is in the plottable domain
 * @param {AssetsValue[]} assetsValues - The assets values associated with the plottable domain
 * @param {Date} date - The date that can be out of the plottable domain
 * @return {Date} - The earliest date in the plottable domain that is the closest to the input date
 */
function dateInPlottableDomain(assetsValues, date) {
  return date < valueDate(assetsValues[0]) ? valueDate(assetsValues[0]) : date;
}

/*
 * Get the id of the entry in the index sequence that is (not strictly) earlier than a given date in the plottable domain
 * @param {AssetsValue[]} assetsValues - The assets values associated with the index
 * @param {Date} dateInPlottableDomain - A date in the plottable domain
 * @return {number}
 */
function predecessorIdInIndex(assetsValues, dateInPlottableDomain) {
  const maybeId = assetsValues.findIndex(assetsValue => valueDate(assetsValue) > dateInPlottableDomain);

  return maybeId < 0 ? assetsValues.length - 1 : maybeId - 1;
}

module.exports = {
  dateInPlottableDomain,
  predecessorIdInIndex
};
