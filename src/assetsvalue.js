// Copyright (c) Adrien Cransac
// License: No license

/*
 * Value of a fund's assets at a point in time, with the contribution of deposited or withdrawn cash
 * @param {date} valueDate - The date of the value
 * @param {number} marketValue - The market value of the assets
 * @param {number} addedCash - The amount of cash deposited or withdrawn at this date. Positive for deposits, negative for withdrawals
 * @return {AssetsValue}
 */
function makeAssetsValue(valueDate, marketValue, addedCash) {
  return [valueDate, marketValue, addedCash];
}

function valueDate(assetsValue) {
  return assetsValue[0];
}

function marketValue(assetsValue) {
  return assetsValue[1];
}

function addedCash(assetsValue) {
  return assetsValue[2];
}

/*
 * Get the assets' value after taking deposited or withdrawn cash into account. This is the actual market value of the assets
 * @param {AssetsValue} assetsValue - The assets' value
 * @return {number}
 */
function valueAfterAddedCash(assetsValue) {
  return marketValue(assetsValue);
}

/*
 * Get the assets' value before taking deposited or withdrawn cash into account
 * @param {AssetsValue} assetsValue - The assets' value
 * @return {number}
 */
function valueBeforeAddedCash(assetsValue) {
  return marketValue(assetsValue) - addedCash(assetsValue);
}

module.exports = {
  makeAssetsValue,
  valueAfterAddedCash,
  valueBeforeAddedCash
};
