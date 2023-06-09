// Copyright (c) Adrien Cransac
// License: MIT

const { CompoundCurve, readCompoundCurveFromJson } = require('../src/compoundcurve.js');
const { readFundsFromJson } = require('../src/fund.js');

test("Fail To Construct If Invalid Interval", () => {
  expect(() => new CompoundCurve([
    ["2023-05-28/2023-05-29", 1.0],
    ["2023-05-29/2023-05-abc", 1.0]
  ]))
    .toThrow(new Error("invalid compound curve. The following is not a valid ISO time interval: "
      + "2023-05-29/2023-05-abc"));
});

test("Fail To Construct If Invalid Rate", () => {
  expect(() => new CompoundCurve([
    ["2023-05-28/2023-05-29", 1.0],
    ["2023-05-29/2023-05-30", "abc"]
  ]))
    .toThrow(new Error("invalid compound curve. The following is not a valid rate: abc"));
});

test("Fail To Construct If Non-Disjoint Intervals", () => {
  expect(() => new CompoundCurve([
    ["2023-05-28/2023-05-29", 1.0],
    ["2023-05-28/2023-05-30", 1.0]
  ]))
    .toThrow(new Error("invalid compound curve. The rates' time intervals are not disjoint and / or"
      + " covering a continuous period of time"));
});

test("Fail To Construct If Non-Continuous Period Covered", () => {
  expect(() => new CompoundCurve([
    ["2023-05-28/2023-05-29", 1.0],
    ["2023-05-30/2023-05-31", 1.0]
  ]))
    .toThrow(new Error("invalid compound curve. The rates' time intervals are not disjoint and / or"
      + " covering a continuous period of time"));
});

test("Fail To Slice Before Curve Interval", () => {
  expect(() => (new CompoundCurve([
    ["2023-05-28/2023-05-30", 1.0],
    ["2023-05-30/2023-06-01", 1.0]
  ])).slice("2023-05-27", "2023-05-31"))
    .toThrow(new Error("can't slice compound curve. The slice's start date is earlier than the "
      + "curve's time interval"));
});

test("Fail To Slice After Curve Interval", () => {
  expect(() => (new CompoundCurve([
    ["2023-05-28/2023-05-30", 1.0],
    ["2023-05-30/2023-06-01", 1.0]
  ])).slice("2023-05-29", "2023-06-02"))
    .toThrow(new Error("can't slice compound curve. The slice's end date is later than the curve's "
      + "time interval"));
});

test("Fail To Slice With End Before Start", () => {
  expect(() => (new CompoundCurve([
    ["2023-05-28/2023-05-30", 1.0],
    ["2023-05-30/2023-06-01", 1.0]
  ])).slice("2023-05-29", "2023-05-28"))
    .toThrow(new Error("can't slice compound curve. The slice's end date is earlier than the "
      + "slice's start date"));
});

test("Fail To Compound Invalid Cash Flow Value", () => {
  expect(() => new CompoundCurve([["2023-05-01/2023-06-01", 1.0]]).compound("abc"))
    .toThrow(new Error("can't compound cash flow value. The following is not a valid cash flow "
      + "value: abc"));
});

test("Identity Compound", () => {
  expect(new CompoundCurve([["2023-05-01/2023-06-01", 1.0]]).compound(100.0)).toBe(100.0);
});

test("Constant Compound", () => {
  expect(new CompoundCurve([["2022-01-01/2023-01-01", 1.10]]).compound(100.0)).toBe(110.0);
});

test("Variable Compound", () => {
  expect(new CompoundCurve([
    ["2022-01-01/2022-05-01", 1.10],
    ["2022-05-01/2022-08-29", 1.05],
    ["2022-08-29/2023-01-01", 1.20],
  ]).compound(100.0)).toBeCloseTo(111.6070846940785);
});

test("Slice Then Compound", () => {
  expect(new CompoundCurve([
    ["2022-01-01/2022-05-01", 1.10],
    ["2022-05-01/2022-08-29", 1.05],
    ["2022-08-29/2023-01-01", 1.20],
  ]).slice("2022-03-02", "2022-10-28").compound(100.0)).toBeCloseTo(106.36205438642038);
});

test("Read Curve From Json", () => {
  expect(readCompoundCurveFromJson("test/test_input_3", readFundsFromJson("test/test_input_4"))
    .compound(100.0))
    .toBe(132.0);
});

test("Make Curve From Single Rate Value", () => {
  expect(readCompoundCurveFromJson(1.10, readFundsFromJson("test/test_input_4")).compound(100.0))
    .toBe(121.0);
});
