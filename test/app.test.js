// Copyright (c) Adrien Cransac
// License: MIT

const childProcess = require('child_process');
const { readFile } = require('fs/promises');
const { promisify } = require('util');

const exec = promisify(childProcess.exec);

test("Fail Without Input", async () => {
  const {stdout, stderr} = await exec("src/app.js");

  expect(stdout).toBe("");

  expect(stderr).toBe("Error: EAGAIN: resource temporarily unavailable, read\n");
});

test("Fail When File Doesn't Exist", async () => {
  const {stdout, stderr} = await exec("src/app.js test/none");

  expect(stdout).toBe("");

  expect(stderr).toBe("Error: ENOENT: no such file or directory, open 'test/none'\n");
});

test("Show Help", async () => {
  const {stdout, stderr} = await exec("src/app.js --help");

  expect(stdout).toMatchSnapshot();

  expect(stderr).toBe("");
});

test("Report From File", async () => {
  const {stdout, stderr} = await exec("src/app.js docs/example.json");

  const control = await readFile("docs/example.md", {encoding: "utf8"});

  expect(stdout).toBe(control);

  expect(stderr).toBe("");
});

test("Report From Standard Input", async () => {
  const {stdout, stderr} = await exec("cat docs/example.json | src/app.js");

  const control = await readFile("docs/example.md", {encoding: "utf8"});

  expect(stdout).toBe(control);

  expect(stderr).toBe("");
});

test("Report Within Specific Interval", async () => {
  const {stdout, stderr} =
    await exec(`src/app.js --begin "2020-04-01" --end "2020-07-01" docs/example.json`);

  expect(stdout).toMatchSnapshot();

  expect(stderr).toBe("");
});

test("Report With Higher Charts", async () => {
  const {stdout, stderr} =
    await exec("src/app.js --height 20 docs/example.json");

  expect(stdout).toMatchSnapshot();

  expect(stderr).toBe("");
});

test("Report With Thinner Charts", async () => {
  const {stdout, stderr} =
    await exec("src/app.js --width 70 docs/example.json");

  expect(stdout).toMatchSnapshot();

  expect(stderr).toBe("");
});

test("Fail When Rates File Doesn't Exist", async () => {
  const {stdout, stderr} = await exec("src/app.js --rates test/none docs/example.json");

  expect(stdout).toBe("");

  expect(stderr).toBe("Error: ENOENT: no such file or directory, open 'test/none'\n");
});

test("Report With Multiple Compound Rates", async () => {
  const {stdout, stderr} = await exec("src/app.js --rates docs/rates.json docs/example.json");

  const control = await readFile("docs/example_with_rates.md", {encoding: "utf8"});

  expect(stdout).toBe(control);

  expect(stderr).toBe("");
});

test("Report With Single Compound Rate", async () => {
  const {stdout, stderr} = await exec("src/app.js --rates 1.0171 docs/example.json");

  const control = await readFile("docs/example_with_single_rate.md", {encoding: "utf8"});

  expect(stdout).toBe(control);

  expect(stderr).toBe("");
});
