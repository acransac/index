// Copyright (c) Adrien Cransac
// License: No license

const { addedCash, valueAfterAddedCash, valueBeforeAddedCash, valueDate } = require('./assetsvalue.js');
const { DateTime } = require('luxon');

/*
 * Compute the index series
 * @param {[AssetsValue]} assetsValues - The assets' values
 * @return {[number]}
 */
function index(assetsValues) {
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
  const roi = (netIncome, investment, endDate) => {
    return (duration => Math.pow(netIncome / investment, 365.25 / duration))
             (DateTime.fromJSDate(endDate).diff(DateTime.fromJSDate(valueDate(assetsValues[0])), "days").as("days"));
  };

  return assetsValues.reduce(([netIncome, investment, index], assetsValue) => {
    return ((netIncome, investment) => [netIncome, investment, [...index, roi(netIncome + valueAfterAddedCash(assetsValue),
                                                                              investment,
                                                                              valueDate(assetsValue))]])
             (netIncome - addedCash(assetsValue), addedCash(assetsValue) > 0 ? investment + addedCash(assetsValue)
                                                                             : investment);
  }, [0, 0, []])[2];
}

module.exports = {
  index,
  returnOnInvestment
};
