# Introduction
**index** is a command line program that prints a report on the performance of a series of investments. The performance is measured by indices which are described with a chart, highlights and the full list of values. Currently, the indices are:
  * the relative market value of the investment compared with the first valuation. For example, starting with 100, a reading of 101.23 means that the assets appreciated by 1.23% relatively to the inception value. This index is not affected by cashing into or out of the investment.
  * the return on investment. This is the ratio of cash withdrawn to cash invested over time, considering a full sale of assets and cash out at the date of the index computation. The time value of cash flows is not accounted for.

The input to the program is user-provided json data describing the investments, notably with a time series of market values and cash flows. The user chooses the time interval to report on. The output is meant to be easily printable and readable in a terminal (even the graphs) and is formatted as Markdown.

See for example in example.md, the daily values of the S&P 500 over the first week of 2021 as output by **index**.

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
The input to the program is json data describing the market values of the assets and cash flows in or out of an investment over time.

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

where the value date is formatted as YYYY-MM-DD and added cash is positive for deposits and negative for withdrawals to and from the investment respectively.

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

## Using The Command Line Program
Firstly, get a short summary on how to use **index** and the options available with the following:

```shell
    $ index --help
```

You provide the input to the program by either piping the json data in or indicating the path to it as an argument to the command. Then, there are two parameters that you can tweak:
  * the time interval to report on. You can specify a begin date and / or an end date. If you don't, the earliest and / or the latest valuations' dates are used. The format is YYYY-MM-DD. Note that this interval has no impact on the computation of the indices, it just focuses the reports on the given time period.
  * the dimensions of the charts, height and width. The former is only for comfort of reading but the latter has an impact on the accuracy. Indeed, the charts are just printed characters so that every printed column covers a fixed slice of the choosen time interval. Increasing the width, that is the number of columns, allows the latter to cover smaller amounts of time hence revealing patterns of shorter terms.

Try it out, print what is in example.md with:

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
