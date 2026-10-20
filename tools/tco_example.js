#!/usr/bin/env node
// Prints the calculator's three RelayCart presets as a table.
// Usage: node tools/tco_example.js
const TCO = require("../calculator/web/tco.js");

const rows = ["before", "nineMonths", "afterReview"].map((name) => {
  const input = TCO.preset(name);
  const r = TCO.compute(input);
  return {
    state: TCO.PRESETS[name].label,
    services: input.services,
    components: input.tools,
    infra: "$" + input.infraMonthly.toLocaleString("en-US"),
    hours: r.totalHours.toFixed(1),
    budget: r.budgetUsedPct.toFixed(1) + "% (" + r.status + ")",
  };
});

console.table(rows);
