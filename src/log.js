// Copyright (c) Adrien Cransac
// License: MIT

const { valueDate } = require('./assetsvalue.js');
const { dateInPlottableDomain, predecessorIdInIndex } = require('./helpers.js');
const { DateTime } = require('luxon');
const table = require('markdown-table');
const numbro = require('numbro');

/*
 * Log information about an index over a specified time interval: its value at the beginning and the end of the interval, its maximum and minimum values over that interval and the variation observed from the penultimate to the last records in this interval
 * @param {AssetsValue[]} assetsValues - The assets values associated with the index
 * @param {number[]} index - The index sequence
 * @param {Date} beginDate - The beginning of the time interval specified by the user
 * @param {Date} endDate - The end of the time interval specified by the user
 * @return {string}
 */
function indexHighlights(assetsValues, index, beginDate, endDate) {
  const indexBeginId = predecessorIdInIndex(assetsValues, dateInPlottableDomain(assetsValues, beginDate));

  const indexEndId = predecessorIdInIndex(assetsValues, endDate);

  const [min, max] = index.slice(indexBeginId, indexEndId + 1)
                          .reduce(([min, max], indexValue) => [min > indexValue ? indexValue : min,
                                                               max < indexValue ? indexValue : max],
                                  [index[indexBeginId], index[indexBeginId]]);

  const [lastVariation, lastVariationInPercentage] =
    (lastVariation => [lastVariation, lastVariation / Math.abs(index[indexEndId - 1])])
      (index[indexEndId] - index[indexEndId - 1]);

  return table([
    ["Highlights", "Value"],
    ["Begin", `${numbro(index[indexBeginId]).format({mantissa: 2})}`],
    ["End", `${numbro(index[indexEndId]).format({mantissa: 2})}`],
    ["Min", `${numbro(min).format({mantissa: 2})}`],
    ["Max", `${numbro(max).format({mantissa: 2})}`],
    ["Last Variation",`${numbro(lastVariation).format({mantissa: 2, forceSign: true})} ` +
                        `(${numbro(lastVariationInPercentage).format({mantissa: 2, forceSign: true, output: "percent"})})`]
  ]);
}

/*
 * Log index values that are within the specified interval
 * @param {AssetsValue[]} assetsValues - The assets values associated with the index
 * @param {number[]} index - The index sequence
 * @param {Date} beginDate - The beginning of the time interval specified by the user
 * @param {Date} endDate - The end of the time interval specified by the user
 * @return {string}
 */
function indexHistory(assetsValues, index, beginDate, endDate) {
  const indexBeginId = predecessorIdInIndex(assetsValues, dateInPlottableDomain(assetsValues, beginDate));

  const indexEndId = predecessorIdInIndex(assetsValues, endDate);

  return table([
    ["Date", "Index Value"],
    ...index.slice(indexBeginId, indexEndId + 1)
            .map((index, id) => {
                   return [DateTime.fromJSDate(valueDate(assetsValues[indexBeginId + id])).toLocaleString(DateTime.DATE_MED),
                           numbro(index).format({mantissa: 2})]
                 })
  ]);
}

module.exports = {
  indexHighlights,
  indexHistory
};
