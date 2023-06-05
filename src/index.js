// Copyright (c) Adrien Cransac
// License: MIT

const { addedCash, valueAfterAddedCash, valueBeforeAddedCash, valueDate } = require('./assetsvalue.js');
const Decimal = require('decimal.js-light');
const { DateTime } = require('luxon');

/*
 * Compute the market value for each in a time series of a fund's valuations in proportion to the first. Cash flows do not move the index
 * @param {[AssetsValue]} assetsValues - The assets' values
 * @return {[number]}
 */
function relativeMarketValue(assetsValues) {
  return assetsValues
    .reduce((index, assetsValue, id) => {
      if (id === 0) {
        return [new Decimal(100)];
      }
      else {
        return [
          ...index,
          index[id - 1].times(valueBeforeAddedCash(assetsValue)).dividedBy(valueAfterAddedCash(assetsValues[id - 1]))
        ];
      }
    }, [])
    .map(indexValue => indexValue.toNumber());
}

/*
 * Compute the return on investment for each in a time series of a fund's valuations
 * @param {[AssetsValue]} assetsValues - The assets' values
 * @param {CompoundCurve} compoundCurve - The time-variable compound operator to compute the time
 *   value of cash flows
 * @return {[number]}
 */
function returnOnInvestment(assetsValues, compoundCurve) {
  if (assetsValues.length > 0) {
    const cashFlow = (assetsValue, isReturned) => [
      valueDate(assetsValue),
      isReturned ? - Math.min(0, addedCash(assetsValue)) : Math.max(0, addedCash(assetsValue))
    ];

    const roi = (returned, invested, endDate) => {
      const endValue = cashFlows => {
        const isoDate = date => DateTime.fromJSDate(date).toISODate();

        return cashFlows.reduce((sum, [cashFlowDate, cashFlowValue]) =>
          sum + (cashFlowValue > 0.0
            ? compoundCurve.slice(isoDate(cashFlowDate), isoDate(endDate)).compound(cashFlowValue)
            : 0.0),
          0.0);
      };

      return (duration => new Decimal(endValue(returned))
        .dividedBy(new Decimal(endValue(invested)))
        .toPower(new Decimal(1).dividedBy(Math.max(1, duration)))
        .minus(1)
        .times(100)
        .toNumber())
        (DateTime.fromJSDate(endDate)
          .diff(DateTime.fromJSDate(valueDate(assetsValues[0])), "days")
          .as("years"));
    };

    return assetsValues.slice(1).reduce(([returned, invested, index], assetsValue) =>
      (roi => [
        [...returned, cashFlow(assetsValue, true)],
        [...invested, cashFlow(assetsValue, false)],
        [...index, roi]
      ])(roi(
        [...returned, [valueDate(assetsValue), valueBeforeAddedCash(assetsValue)]],
        [...invested, [valueDate(assetsValue), 0.0]],
        valueDate(assetsValue))),
      [[cashFlow(assetsValues[0], true)], [cashFlow(assetsValues[0], false)], [0.0]])[2];
  }
  else {
    return [];
  }
}

module.exports = {
  relativeMarketValue,
  returnOnInvestment
};
