// Copyright (c) Adrien Cransac
// License: No license

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

  return funds.map(fund => [
    `# ${fundName(fund)}`,
    ...indices.map(([indexName, indexFunction]) => {
      const index = indexFunction(assetsValues(fund));

      return [
        `## ${indexName}`,
        "",
        plotIndex(assetsValues(fund), index, beginDate, endDate, plotWidth, plotHeight),
        plotTimeline(beginDate, endDate, plotWidth, 13),
        "",
        "### Highlights",
        "",
        indexHighlights(assetsValues(fund), index, beginDate, endDate),
        "",
        "### History",
        "",
        indexHistory(assetsValues(fund), index, beginDate, endDate),
        ""
      ].join("\n");
    })
  ].join("\n")).join("\n");
}

module.exports = {
  reportOnFunds
};
