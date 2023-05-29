// Copyright (c) Adrien Cransac
// License: MIT

const { CompoundCurve } = require('../src/compoundcurve.js');

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
