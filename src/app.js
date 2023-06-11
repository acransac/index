#!/usr/bin/env node

// Copyright (c) Adrien Cransac
// License: MIT

const { readCompoundCurveFromJson } = require('./compoundcurve.js');
const { readFundsFromJson } = require('./fund.js');
const { DateTime } = require('luxon');
const { reportOnFunds } = require('./report.js');
const { hideBin } = require('yargs/helpers');
const yargs = require('yargs/yargs');

(function main() {
  const parseDate = dateString => {
    const date = DateTime.fromISO(dateString);

    if (date.isValid) {
      return date.startOf("day").toJSDate();
    }
    else {
      throw new Error("Error: the date should be a string with format YYYY-MM-DD");
    }
  };

  const argv = yargs(hideBin(process.argv))
    .usage("Usage: $0 [options] [file]\n")
    .usage("Print a performance report on the funds described in the file.\n")
    .usage("With no file, read standard input.")
    .option("b")
    .describe("b", "The begin date of the report with format YYYY-MM-DD. If absent, it is the earliest valuation per fund")
    .coerce("b", parseDate)
    .alias("b", "begin")
    .option("e")
    .describe("e", "The end date of the report with format YYYY-MM-DD. If absent, it is the latest valuation per fund")
    .coerce("e", parseDate)
    .alias("e", "end")
    .option("h")
    .describe("h", "The charts' height in printed lines")
    .default("h", 15)
    .coerce("h", height => {
      if (typeof height === "number" && height > 0) {
        return height;
      }
      else {
        throw new Error("Error: the height should be a strictly positive number");
      }
    })
    .alias("h", "height")
    .option("r")
    .describe("r", "The path to the file with the compound rates to compute the time value of cash flows. Alternatively, the value of a single rate that applies to all cash flows")
    .default("r", 1.00)
    .alias("r", "rates")
    .option("w")
    .describe("w", "The charts' width in printed characters. It influences the accuracy of the charts")
    .default("w", 120)
    .coerce("w", width => {
      if (typeof width === "number" && width > 14) {
        return width;
      }
      else {
        throw new Error("Error: the width should be a number strictly greater than 14");
      }
    })
    .alias("w", "width")
    .parse();

  try {
    return (funds => {
      return console.log(reportOnFunds(
        funds,
        argv.begin,
        argv.end,
        readCompoundCurveFromJson(argv.rates, funds),
        argv.width,
        argv.height));
    })(readFundsFromJson(argv._.length > 0 ? argv._[0] : process.stdin.fd));
  }
  catch (error) {
    return console.error(`${error.name}: ${error.message}`);
  }
})();
