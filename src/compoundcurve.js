// Copyright (c) Adrien Cransac
// License: MIT

const { DateTime, Interval } = require('luxon');

/*
 * Make a compound operator variable over time
 * @param {Array<Array<string, number>>} rates - The compound rates over time as a sequence of pairs
 *   of the time interval with the rate. The time interval is an ISO string. Intervals should be
 *   disjoint and cover a continuous period of time
 * @return {CompoundCurve}
 */
function CompoundCurve(rates) {
  const curve = rates
    .map(([interval, rate]) => {
      const checkedInterval = Interval.fromISO(interval);

      if (!checkedInterval.isValid) {
        throw new Error(
          `invalid compound curve. The following is not a valid ISO time interval: ${interval}`);
      }
      else if (isNaN(rate)) {
        throw new Error(
          `invalid compound curve. The following is not a valid rate: ${rate}`);
      }
      else {
        return [checkedInterval, rate];
      }
    })
    .sort(([intervalA, rateA], [intervalB, rateB]) => intervalB.isAfter(intervalA.start) ? -1 : 1);

  if (!curve.slice(0, -1).every(([interval, rate], id) => curve[id + 1][0].abutsEnd(interval))) {
    throw new Error(
      "invalid compound curve. The rates' time intervals are not disjoint and / or covering a "
        + "continuous period of time");
  }

  /*
   * Compound a cash flow value over the curve's time interval
   * @param {number} cashFlowValue - The cash flow value. The cash flow should happen at the curve's
   *   start date
   * @return {number}
   */
  this.compound = cashFlowValue => {
  };

  /*
   * Make a new compound operator covering a sub-interval of the current one
   * @param {string} startDate - The start date of the sub-interval as an ISO string. It should be
   *   later than the start date of the current compound curve
   * @param {string} endDate - The end date of the sub-interval as an ISO string. It should be
   *   earlier than the end date of the current compound curve
   * @return {CompoundCurve}
   */
  this.slice = (startDate, endDate) => {
    const start = DateTime.fromISO(startDate);

    const end = DateTime.fromISO(endDate);

    if (start < curve[0][0].start) {
      throw new Error(
        "can't slice compound curve. The slice's start date is earlier than the curve's time "
          + "interval");
    }
    else if (end > curve.at(-1)[0].end) {
      throw new Error(
        "can't slice compound curve. The slice's end date is later than the curve's time interval");
    }
    else {
      const cutCurve = (date, isAfterCut) => {
        const intervalId = curve.findIndex(
          ([interval, rate]) => interval.contains(date) || interval.end.equals(date));

        return [
          [
            curve[intervalId][0].splitAt(date)[isAfterCut ? 1 : 0].toISODate(),
            curve[intervalId][1]
          ],
          intervalId
        ];
      };

      const [firstInterval, firstIntervalId] = cutCurve(start, true);

      const [lastInterval, lastIntervalId] = cutCurve(end, false);

      if (firstIntervalId === lastIntervalId) {
        return new CompoundCurve([
          [
            curve[firstIntervalId][0].splitAt(start, end)[1].toISODate(),
            curve[firstIntervalId][1]
          ]
        ]);
      }
      else {
        return new CompoundCurve([
          firstInterval,
          ...curve.slice(firstIntervalId + 1, lastIntervalId).map(([interval, rate]) =>
            [interval.toISODate(), rate]),
          lastInterval
        ]);
      }
    }
  };
}

module.exports = { CompoundCurve };
