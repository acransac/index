// Copyright (c) Adrien Cransac
// License: MIT

const { plot } = require('asciichart');
const { valueDate } = require('./assetsvalue.js');
const { dateInPlottableDomain, predecessorIdInIndex } = require('./helpers.js');
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
 * @return {string}
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

  const correctedBeginDate = dateInPlottableDomain(assetsValues, beginDate);

  return plot(
    (startId => selectIndexValues(timeStep(correctedBeginDate, endDate, maxColumns > 14 ? maxColumns - 14 : 1))
                     ([], correctedBeginDate, index[startId], assetsValues.slice(startId + 1), index.slice(startId + 1)))
      (predecessorIdInIndex(assetsValues, correctedBeginDate)),
    {height: rows - 1});
}

// # Timeline

/*
 * Plot the timeline of a time interval with a specified maximum length. Only passing months and years are plotted
 * @param {Date} beginDate - The date from which the timeline is plotted
 * @param {Date} endDate - The date to which the timeline is plotted
 * @param {number} maxColumns - The maximum length of the timeline in printable columns (number of characters)
 * @param {number} offset - The length of the space to leave empty to the left of the timeline in printable columns (number of characters)
 * @return {string}
 */
function plotTimeline(beginDate, endDate, maxColumns, offset) {
  const timeIncrement = timeStep(beginDate, endDate, maxColumns - offset - 1);

  const plotArrow = availableWidth => new Array(availableWidth).fill("─").join("");

  const plotMonth = (date, availableWidth) => {
    return (month => month.padEnd(availableWidth, " "))
             (availableWidth >= 3 ? DateTime.fromJSDate(date).monthShort : DateTime.fromJSDate(date).monthShort[0]);
  };

  const plotYear = (date, availableWidth) => {
    return (year => year.padEnd(availableWidth, " "))((() => {
      if (availableWidth > 4) {
        return DateTime.fromJSDate(date).year.toString();
      }
      else if (availableWidth > 2) {
        return DateTime.fromJSDate(date).year.toString().slice(-2);
      }
      else {
        return "";
      }
    })());
  };

  const plotTimelineImpl =
    (arrowLine, monthLine, yearLine, previousMonth, previousYear, currentDate, monthPlottableWidth, yearPlottableWidth) => {
      if (currentDate > endDate) {
        return [
          `${arrowLine}${monthPlottableWidth > 1 ? plotArrow(monthPlottableWidth - 1) : ""}>`,
          `${monthLine}${monthPlottableWidth > 1 ? plotMonth(new Date(previousYear, previousMonth), monthPlottableWidth - 1) : ""}`,
          `${yearLine}${yearPlottableWidth > 1 ? plotYear(new Date(previousYear, previousMonth), yearPlottableWidth - 1) : ""}`
        ].join("\n");
      }
      else if (previousMonth === currentDate.getMonth()) {
        return plotTimelineImpl(arrowLine,
                                monthLine,
                                yearLine,
                                previousMonth,
                                previousYear,
                                DateTime.fromJSDate(currentDate).plus({days: timeIncrement}).toJSDate(),
                                monthPlottableWidth + 1,
                                yearPlottableWidth + 1);
      }
      else if (previousYear === currentDate.getFullYear()) {
        return plotTimelineImpl(`${arrowLine}${plotArrow(monthPlottableWidth)}`,
                                `${monthLine}${plotMonth(new Date(previousYear, previousMonth), monthPlottableWidth)}`,
                                yearLine,
                                currentDate.getMonth(),
                                previousYear,
                                DateTime.fromJSDate(currentDate).plus({days: timeIncrement}).toJSDate(),
                                1,
                                yearPlottableWidth + 1);
      }
      else {
        return plotTimelineImpl(`${arrowLine}${new Array(monthPlottableWidth).fill("─").join("")}`,
                                `${monthLine}${plotMonth(new Date(previousYear, previousMonth), monthPlottableWidth)}`,
                                `${yearLine}${plotYear(new Date(previousYear, previousMonth), yearPlottableWidth)}`,
                                currentDate.getMonth(),
                                currentDate.getFullYear(),
                                DateTime.fromJSDate(currentDate).plus({days: timeIncrement}).toJSDate(),
                                1,
                                1);
      }
  };

  return (offset => plotTimelineImpl(offset, offset, offset, beginDate.getMonth(), beginDate.getFullYear(), beginDate, 0, 0))
           (new Array(offset).fill(" ").join(""));
}

// # Helpers

function timeStep(beginDate, endDate, maxSteps) {
  const findDivisor = (number, candidate) => number % candidate > 0 ? findDivisor(number, candidate - 1) : candidate;

  return (duration => duration / findDivisor(duration, maxSteps))
           (DateTime.fromJSDate(endDate).diff(DateTime.fromJSDate(beginDate), "days").as("days"));
}

module.exports = {
  plotIndex,
  plotTimeline
};
