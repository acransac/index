// Copyright (c) Adrien Cransac
// License: No license

const { plot } = require('asciichart');
const { valueDate } = require('./assetsvalue.js');
const { DateTime } = require('luxon');

// # Index

/*
 * Plot an index over time. The dimensions of the chart can be specified
 * @param {[AssetsValue]} assetsValues - The array of all assets values from which the index is calculated
 * @param {[number]} index - The corresponding complete sequence of index values
 * @param {Date} beginDate - The date from which the index is plotted. Can only be later than the earliest assets value
 * @param {Date} endDate - The date to which the index is plotted. Can only be sooner than the latest assets value
 * @param {number} maxColumns - The maximum width of the chart in printable columns (number of characters). It is at least 15
 * @param {number} rows - The height of the chart in printable rows (number of lines)
 */
function plotIndex(assetsValues, index, beginDate, endDate, maxColumns, rows) {
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

  return plot(
    (startIndex => selectIndexValues(timeStep(correctedBeginDate, endDate, maxColumns > 14 ? maxColumns - 14 : 1))
                     ([], correctedBeginDate, index[startIndex - 1], assetsValues.slice(startIndex), index.slice(startIndex)))
      (assetsValues.findIndex(element => valueDate(element) > correctedBeginDate)),
    {height: rows - 1});
}

// # Timeline

function plotTimeline(beginDate, endDate, maxColumns) {
}

// # Helpers

function timeStep(beginDate, endDate, maxSteps) {
  const findDivisor = (number, candidate) => number % candidate > 0 ? findDivisor(number, candidate - 1) : candidate;

  return (duration => duration / findDivisor(duration, maxSteps))
           (DateTime.fromJSDate(endDate).diff(DateTime.fromJSDate(beginDate)).as("days"));
}

module.exports = {
  plotIndex
};
