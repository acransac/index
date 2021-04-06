// Copyright (c) Adrien Cransac
// License: MIT

const { addedCash, valueAfterAddedCash, valueBeforeAddedCash, valueDate } = require('./assetsvalue.js');
const { DateTime } = require('luxon');

/*
 * Compute the market value for each in a time series of a fund's valuations in proportion to the first. Cash flows do not move the index
 * @param {[AssetsValue]} assetsValues - The assets' values
 * @return {[number]}
 */
function relativeMarketValue(assetsValues) {
  return assetsValues.reduce((index, assetsValue, id) => {
    if (id === 0) {
      return [100];
    }
    else {
      return [
        ...index,
        index[id - 1] * valueBeforeAddedCash(assetsValue) / valueAfterAddedCash(assetsValues[id - 1])
      ];
    }
  }, []);
}

/*
 * Compute the return on investment for each in a time series of a fund's valuations
 * @param {[AssetsValue]} assetsValues - The assets' values
 * @return {[number]}
 */
function returnOnInvestment(assetsValues) {
  const roi = (returned, invested, endDate) => {
    return (duration => 100 * (Math.pow(returned / invested, 1 / Math.max(1, duration)) - 1))
             (DateTime.fromJSDate(endDate).diff(DateTime.fromJSDate(valueDate(assetsValues[0])), "days").as("years"));
  };

  return assetsValues.reduce(([returned, invested, index], assetsValue, id) => {
    if (id === 0) {
      return [returned - Math.min(0, addedCash(assetsValue)), invested + Math.max(0, addedCash(assetsValue)), [...index, 0]];
    }
    else {
      return (roi => [returned - Math.min(0, addedCash(assetsValue)),
                      invested + Math.max(0, addedCash(assetsValue)),
                      [...index, roi]])
               (roi(returned + valueBeforeAddedCash(assetsValue), invested, valueDate(assetsValue)));
    }
  }, [0, 0, []])[2];
}

module.exports = {
  relativeMarketValue,
  returnOnInvestment
};
