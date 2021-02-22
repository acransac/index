// Copyright (c) Adrien Cransac
// License: No license

const { valueDate } = require('./assetsvalue.js');
const { assetsValues, fundName } = require('./fund.js');
const { index } = require('./index.js');
const { indexHighlights, indexHistory } = require('./log.js');
const { plotIndex, plotTimeline } = require('./plot.js');

/*
 * Report plot, highlights and history for each index in every fund
 * @param {Fund[]} funds - The funds to report on
 * @param {Date} beginDate - The begin date specified by the user
 * @param {Date} endDate - The end date specified by the user
 * @param {number} plotWidth - The maximum admissible plot width in printable columns (number of characters)
 * @param {number} plotHeight - The plot height in printable rows (number of lines)
 * @return {string}
 */
function reportOnFunds(funds, beginDate, endDate, plotWidth, plotHeight) {
  const indices = [
    ["Relative Market Value", index]
  ];

  return funds.map(fund => {
    const valuations = assetsValues(fund);

    const begin = beginDate ? beginDate : valueDate(valuations[0]);

    const end = endDate ? endDate : valueDate(valuations[valuations.length - 1]);

    return [
      `# ${fundName(fund)}`,
      ...indices.map(([indexName, indexFunction]) => {
        const index = indexFunction(valuations);

        return [
          `## ${indexName}`,
          "",
          plotIndex(valuations, index, begin, end, plotWidth, plotHeight),
          plotTimeline(begin, end, plotWidth, 13),
          "",
          "### Highlights",
          "",
          indexHighlights(valuations, index, begin, end),
          "",
          "### History",
          "",
          indexHistory(valuations, index, begin, end),
          ""
        ].join("\n");
      })
    ].join("\n");
  }).join("\n");
}

module.exports = {
  reportOnFunds
};
