// Copyright (c) Adrien Cransac
// License: No license

(async () => {
  await require('./test_index.js');

  await require('./test_plot.js');

  await require('./test_log.js');

  await require('./test_report.js');
})();
