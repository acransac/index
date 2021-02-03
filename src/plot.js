// Copyright (c) Adrien Cransac
// License: No license

const { plot } = require('asciichart');
const { valueDate } = require('./assetsvalue.js');
const { DateTime } = require('luxon');

/*
 * Plot an index over time. The dimensions of the chart can be specified
 * @param {[AssetsValue]} assetsValues - The array of all assets values from which the index is calculated
 * @param {[number]} index - The corresponding complete sequence of index values
 * @param {Date} beginDate - The date from which the index is plotted. Can only be later than the earliest assets value
 * @param {Date} endDate - The date to which the index is plotted. Can only be sooner than the latest assets value
 * @param {number} maxColumns - The maximum width of the chart in printable columns (number of characters)
 * @param {number} maxRows - The maximum height of the chart in printable rows (number of lines)
 */
function plotIndex(assetsValues, index, beginDate, endDate, maxColumns, maxRows) {
  const selectIndexValues = xIncrementInDays => (selection, currentDate, currentIndexValue, assetsValues, index) => {
    if (currentDate > endDate) {
      return selection;
    }
    else if (index.length === 0 || currentDate < valueDate(assetsValues[0])) {
      return selectIndexValues(xIncrementInDays)
               ([...selection, currentIndexValue],
                DateTime.fromJSDate(currentDate).plus({days: xIncrementInDays}).toJSDate(),
                currentIndexValue,
                assetsValues,
                index);
    }
    else {
      return selectIndexValues(xIncrementInDays)(selection, currentDate, index[0], assetsValues.slice(1), index.slice(1));
    }
  };

  const correctedBeginDate = beginDate < valueDate(assetsValues[0]) ? valueDate(assetsValues[0]) : beginDate;

  const findDivisor = (number, candidate) => number % candidate > 0 ? findDivisor(number, candidate - 1) : candidate;

  const xIncrementInDays = (intervalInDays => intervalInDays / findDivisor(intervalInDays, maxColumns))
                             (DateTime.fromJSDate(endDate).diff(DateTime.fromJSDate(correctedBeginDate), "days").days);

  return plot(
    (startIndex => selectIndexValues(xIncrementInDays)
                     ([], correctedBeginDate, index[startIndex - 1], assetsValues.slice(startIndex), index.slice(startIndex)))
      (assetsValues.findIndex(element => valueDate(element) > correctedBeginDate)),
    {height: maxRows});
}

module.exports = {
  plotIndex
};
