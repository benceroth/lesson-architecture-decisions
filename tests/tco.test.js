"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const TCO = require("../calculator/web/tco.js");

const root = path.join(__dirname, "..");

function parseCsvLine(line) {
  const out = [];
  let cur = "";
  let quoted = false;
  for (const ch of line) {
    if (ch === '"') quoted = !quoted;
    else if (ch === "," && !quoted) { out.push(cur); cur = ""; }
    else cur += ch;
  }
  out.push(cur);
  return out;
}

function loadCsv() {
  const lines = fs.readFileSync(path.join(root, "calculator", "tco-model.csv"), "utf8").trim().split(/\r?\n/);
  const header = parseCsvLine(lines[0]);
  return lines.slice(1).map((l) => Object.fromEntries(parseCsvLine(l).map((v, i) => [header[i], v])));
}

test("defaults compute without NaN", () => {
  const r = TCO.compute(TCO.defaults());
  for (const [k, v] of Object.entries(r)) {
    if (typeof v === "number") assert.ok(Number.isFinite(v), k);
  }
});

test("hand-checked example", () => {
  const r = TCO.compute({ engineers: 10, services: 5, tools: 2, infraMonthly: 1000, licencesMonthly: 500,
    upgradeHours: 5, serviceHours: 2, pagesPerWeek: 0, hoursPerPage: 1, incidentHours: 2, responders: 2,
    learningHours: 1, exitHours: 120, amortMonths: 12, productiveHours: 100, budgetPct: 10, hourlyRate: 50 });
  assert.equal(r.executionCost, 1500);
  assert.equal(r.operationsHours, 2 * 5 + 5 * 2); // 20
  assert.equal(r.incidentHours, 4);
  assert.equal(r.cognitiveHours, 20);
  assert.equal(r.exitHoursPerMonth, 10);
  assert.equal(r.totalHours, 54);
  assert.equal(r.budgetHours, 100);
  assert.equal(r.budgetUsedPct, 54);
  assert.equal(r.status, "within");
  assert.equal(r.hoursCost, 2700);
  assert.equal(r.totalMonthlyCost, 4200);
});

test("invalid input is clamped, not propagated", () => {
  const r = TCO.compute({ engineers: -5, services: "abc", tools: NaN, amortMonths: 0, budgetPct: 0 });
  for (const v of Object.values(r)) if (typeof v === "number") assert.ok(Number.isFinite(v) || v === Infinity);
  assert.equal(TCO.normalise({ engineers: -5 }).engineers, 1);
  assert.equal(TCO.normalise({ amortMonths: 0 }).amortMonths, 1);
});

test("zero budget flags over when there is any load", () => {
  const r = TCO.compute({ ...TCO.defaults(), budgetPct: 0 });
  assert.equal(r.status, "over");
});

test("more components never reduce load", () => {
  const base = TCO.defaults();
  const a = TCO.compute({ ...base, tools: 1 }).totalHours;
  const b = TCO.compute({ ...base, tools: 5 }).totalHours;
  assert.ok(b > a);
});

test("status thresholds", () => {
  const base = { ...TCO.defaults(), tools: 0, services: 1, pagesPerWeek: 0, incidentHours: 0, exitHours: 0, serviceHours: 0 };
  assert.equal(TCO.compute({ ...base, budgetPct: 10 }).status, "within");
  const near = TCO.compute({ ...base, serviceHours: 40, services: 5, budgetPct: 10 }); // 200h / 234h
  assert.equal(near.status, "near");
  const over = TCO.compute({ ...base, serviceHours: 40, services: 8, budgetPct: 10 }); // 320h / 234h
  assert.equal(over.status, "over");
});

test("unknown preset throws", () => {
  assert.throws(() => TCO.preset("nope"));
});

test("CSV model matches the JavaScript model for every scenario", () => {
  const rows = loadCsv();
  const cols = ["before", "nine_months_later", "after_60_day_review"];
  const names = ["before", "nineMonths", "afterReview"];
  cols.forEach((col, idx) => {
    const input = {};
    rows.filter((r) => r.kind === "input").forEach((r) => { input[r.id] = Number(r[col]); });
    assert.deepEqual(TCO.preset(names[idx]), input, `preset ${names[idx]} inputs`);
    const out = TCO.compute(input);
    const keyMap = { upgradeHoursTotal: "upgradeHours", serviceHoursTotal: "serviceHours", incidentHoursTotal: "incidentHours" };
    rows.filter((r) => r.kind === "output").forEach((r) => {
      const key = keyMap[r.id] || r.id;
      assert.equal(out[key], Number(r[col]), `${r.id} (${col})`);
    });
  });
});

test("CSV post-sourced inputs match the post", () => {
  const byId = Object.fromEntries(loadCsv().map((r) => [r.id, r]));
  assert.deepEqual([byId.engineers.before, byId.engineers.nine_months_later, byId.engineers.after_60_day_review], ["18", "18", "18"]);
  assert.deepEqual([byId.services.before, byId.services.nine_months_later, byId.services.after_60_day_review], ["1", "11", "8"]);
  assert.deepEqual([byId.infraMonthly.before, byId.infraMonthly.nine_months_later, byId.infraMonthly.after_60_day_review], ["18000", "47000", "29000"]);
});

test("web page has basic accessibility landmarks", () => {
  const html = fs.readFileSync(path.join(root, "calculator", "web", "index.html"), "utf8");
  assert.match(html, /<html lang="en"/);
  assert.match(html, /<meta name="viewport"/);
  assert.match(html, /<title>[^<]+<\/title>/);
  assert.match(html, /<main[ >]/);
  assert.match(html, /<h1[ >]/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /illustrative/i);
  assert.match(html, /not a prediction/i);
  assert.doesNotMatch(html, /<img(?![^>]*\balt=)/);
});
