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
 * @return {[number]}
 */
function returnOnInvestment(assetsValues) {
  const roi = (returned, invested, endDate) => {
    return (duration => returned.dividedBy(invested)
                                .toPower(new Decimal(1).dividedBy(Math.max(1, duration)))
                                .minus(1)
                                .times(100))
             (DateTime.fromJSDate(endDate).diff(DateTime.fromJSDate(valueDate(assetsValues[0])), "days").as("years"));
  };

  return assetsValues
    .reduce(([returned, invested, index], assetsValue, id) => {
      if (id === 0) {
        return [
          returned.minus(Math.min(0, addedCash(assetsValue))),
          invested.plus(Math.max(0, addedCash(assetsValue))),
          [new Decimal(0)]
        ];
      }
      else {
        return (roi => [returned.minus(Math.min(0, addedCash(assetsValue))),
                        invested.plus(Math.max(0, addedCash(assetsValue))),
                        [...index, roi]])
                 (roi(returned.plus(valueBeforeAddedCash(assetsValue)), invested, valueDate(assetsValue)));
      }
    }, [new Decimal(0), new Decimal(0), []])[2]
    .map(indexValue => indexValue.toNumber());
}

module.exports = {
  relativeMarketValue,
  returnOnInvestment
};
