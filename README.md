# Introduction
**index** is a command line program that prints a report on the performance of a series of investments. The performance is measured by indices which are described with a chart, highlights and the full list of values. Currently, the indices are:
  * the relative market value of the investment compared with the first valuation. For example, starting with 100, a reading of 101.23 means that the assets appreciated by 1.23% relatively to the inception value. This index is not affected by cashing into or out of the investment.
  * the return on investment. This is the ratio of cash withdrawn to cash invested over time, considering a full sale of assets and cash out at the date of the index computation. The time value of cash flows is accounted for.

The input to the program is user-provided json data describing the investments, with a time series of market values and cash flows, and possibly the compound rates, with a series of time intervals and associated rate values. The user also chooses the time interval to report on. The output is meant to be easily printable and readable in a terminal (even the graphs) and is formatted as Markdown.

See for example [here](https://acransac.github.io/index-example), the performance of an investment of USD1000.00 in Vanguard's exchange-traded fund VOO (that tracks the S&P500 index) over 2020 as output by **index**.

# Installation
**index** is delivered as a npm package and is more convenient to use if installed globally:

```shell
    $ npm install --global @acransac/index
```

It can be uninstalled with:

```shell
    $ npm uninstall --global @acransac/index
```

# Usage
## Providing Input
The input to the program is json data describing the market values of the assets and cash flows in or out of an investment over time. Additionally, to account for the time value of cash flows, the input can also include json data describing the compound rates to apply over time, or a single rate value that is used for all cash flows from all funds.

### Funds
One investment is called a fund and there can be several of them in the input. Apart from the list of valuations and cash flows, a fund has a name and a base currency in which market values and cash flows are expressed.

The schema is as follows:

```abnf
    <input>        ::= <fund>+
    <fund>         ::= <fundName> <currency> <assetsValue>+
    <fundName>     ::= string
    <currency>     ::= string
    <assetsValue>  ::= <valueDate> <marketValue> <addedCash>
    <valueDate>    ::= string
    <marketValue>  ::= number
    <addedCash>    ::= number
```

where the value date is formatted as YYYY-MM-DD and added cash is positive for deposits and negative for withdrawals to and from the fund respectively.

See an example of json input:

```json
[
  {
    "fundName": "Investments In The USA",
    "currency": "USD",
    "assetsValues":
      [
        {"valueDate": "2020-01-01", "marketValue": 1000.00, "addedCash": 1000.00},
        {"valueDate": "2020-12-31", "marketValue": 1100.00, "addedCash": 0.00}
      ]
  },
  {
    "fundName": "Investments In The EU",
    "currency": "EUR",
    "assetsValues":
      [
        {"valueDate": "2021-01-01", "marketValue": 1000.00, "addedCash": 1000.00}
      ]
  }
]
```

You can also check the input for the introduction's example [here](docs/example.json).

### Compound Rates
A compound rate is represented by a time interval over which it is effective and by a numeric value. There can be multiple compound rates in the program's input to vary the compounding effect over many time intervals.

The schema is as follows:

```abnf
    <input>        ::= <rate>+
    <rate>         ::= <interval> <value>
    <interval>     ::= string
    <value>        ::= number
```

where the interval and value are provided as a pair (an array of two elements). The interval is formatted as YYYY-MM-DD/YYYY-MM-DD with the first date being the beginning and the second, the end. Importantly, multiple rates should cover a continuous interval of time where one rate starts where another ends, spanning the valuation interval of all funds in the input. Also, the rates' values should be annual.

See an example of json input:

```json
[
  ["2020-01-01/2020-07-01", 1.10],
  ["2020-07-01/2021-01-01", 0.95],
]
```

You can also check the input for a variation with rates on the introduction's example [here](docs/rates.json).

Finally, it is possible to specify a single rate value for all cash flows from all funds with a number directly passed to the program. The time interval for such a rate is from the earliest valuation to the latest from all funds.

## Using The Command Line Program
Firstly, get a short summary on how to use **index** and the options available with the following:

```shell
    $ index --help
```

You provide the input to the program by either piping the json data in or indicating the path to it as an argument to the command. Then, there are three parameters that you can tweak:
  * the time interval to report on. You can specify a begin date and / or an end date. If you don't, the earliest and / or the latest valuations' dates are used. The format is YYYY-MM-DD. Note that this interval has no impact on the computation of the indices, it just focuses the reports on the given time period.
  * the dimensions of the charts, height and width. The former is only for comfort of reading but the latter has an impact on the accuracy. Indeed, the charts are just printed characters so that every printed column covers a fixed slice of the choosen time interval. Increasing the width, that is the number of columns, allows the latter to cover smaller amounts of time hence revealing patterns of shorter terms.
  * the compound rates to compute the time value of cash flows. You can either specify the path to a file with the rates' json data or a single numeric value to apply to all cash flows. When this option is unspecified, cash flows are compounded with a rate of 1, meaning their values don't vary with time.

Try it out, print [the introduction's example](https://acransac.github.io/index-example) with:

```shell
    $ cat docs/example.json | index
```

or

```shell
    $ index docs/example.json
```

and customize the output:

```shell
    $ index docs/example.json -b 2020-07-01 -e 2021-01-01 -h 20 -w 140
```

Re-evaluate the performance of the introduction's example by accounting for inflation in invested and returned cash flows. Using quarterly core CPI figures for 2020 in the USA from the Federal Reserve Bank of Saint-Louis:

```shell
    $ index docs/example.json --rates docs/rates.json
```

The output can be found [here](docs/example_with_rates.md).

Or using a single rate for the annual core CPI in 2020 in the USA from the same institution:

```shell
    $ index docs/example.json --rates 1.0171
```

The output can be found [here](docs/example_with_single_rate.md).
