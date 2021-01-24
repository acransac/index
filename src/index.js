// Copyright (c) Adrien Cransac
// License: No license

const { valueAfterAddedCash, valueBeforeAddedCash } = require('./assetsvalue.js');

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
      return (previousValueAfterCash => {
        return [
          ...index,
          index[id - 1] * (1 + ((valueBeforeAddedCash(assetsValue) - previousValueAfterCash) / previousValueAfterCash))
        ]
      })(valueAfterAddedCash(assetsValues[id - 1]));
    }
  }, []);
}

module.exports = {
  index
};
