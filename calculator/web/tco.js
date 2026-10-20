/* TCO / complexity-budget model. A thinking aid, not a prediction.
 * Works in the browser (window.TCO) and in Node (module.exports).
 * Formulas are documented in docs/tco-formula.md and mirrored in calculator/tco-model.csv. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.TCO = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var WEEKS_PER_MONTH = 4.33;

  // Each input: label, unit, min, max, step, default (the "RelayCart nine months later" illustrative case).
  var FIELDS = [
    { id: "engineers", label: "Engineers", unit: "people", min: 1, max: 200, step: 1, value: 18, help: "Post: 18 engineers throughout." },
    { id: "services", label: "Deployed services", unit: "services", min: 1, max: 100, step: 1, value: 11, help: "Post: 1 application, then 11 services, then 8." },
    { id: "tools", label: "Platform components beyond the baseline", unit: "components", min: 0, max: 30, step: 1, value: 4, help: "Assumption: Kubernetes, Kafka, service mesh, GraphQL." },
    { id: "infraMonthly", label: "Monthly infrastructure bill", unit: "USD", min: 0, max: 500000, step: 500, value: 47000, help: "Post: $18,000, then $47,000, then $29,000." },
    { id: "licencesMonthly", label: "Monthly licences and vendor fees", unit: "USD", min: 0, max: 200000, step: 500, value: 0, help: "Assumption: not itemised in the post; included in the infrastructure bill." },
    { id: "upgradeHours", label: "Upgrade and patch hours per component per month", unit: "hours", min: 0, max: 80, step: 0.5, value: 6, help: "Assumption." },
    { id: "serviceHours", label: "Upkeep hours per service per month", unit: "hours", min: 0, max: 40, step: 0.5, value: 4, help: "Pipelines, dependencies, dashboards. Assumption." },
    { id: "pagesPerWeek", label: "On-call pages per week", unit: "pages", min: 0, max: 200, step: 1, value: 12, help: "Assumption." },
    { id: "hoursPerPage", label: "Hours spent per page", unit: "hours", min: 0, max: 24, step: 0.25, value: 1.5, help: "Assumption." },
    { id: "incidentHours", label: "Incident hours per month", unit: "hours", min: 0, max: 500, step: 0.1, value: 7.1, help: "Assumption: 6 incidents a month x 71-minute MTTR from the post." },
    { id: "responders", label: "People involved per incident", unit: "people", min: 1, max: 30, step: 1, value: 3, help: "Assumption." },
    { id: "learningHours", label: "Learning hours per engineer per component per month", unit: "hours", min: 0, max: 20, step: 0.25, value: 1, help: "Cognitive load. Assumption." },
    { id: "exitHours", label: "Estimated exit effort (one-off)", unit: "hours", min: 0, max: 5000, step: 10, value: 400, help: "Data migration, contract changes, decommissioning. Assumption." },
    { id: "amortMonths", label: "Months to spread exit effort over", unit: "months", min: 1, max: 120, step: 1, value: 24, help: "Assumption." },
    { id: "productiveHours", label: "Productive hours per engineer per month", unit: "hours", min: 20, max: 200, step: 5, value: 130, help: "Assumption." },
    { id: "budgetPct", label: "Complexity budget (share of team capacity)", unit: "%", min: 0, max: 100, step: 1, value: 10, help: "How much capacity you accept spending on keeping the platform running. Assumption; tune it to your team." },
    { id: "hourlyRate", label: "Optional loaded cost per hour (0 = hours only)", unit: "USD/hour", min: 0, max: 500, step: 5, value: 0, help: "The post cautions that converting hours to dollars implies false precision. Leave at 0 to avoid it." }
  ];

  var PRESETS = {
    before: { label: "Before (modular monolith)", values: { services: 1, tools: 0, infraMonthly: 18000, pagesPerWeek: 3, incidentHours: 2.4, exitHours: 0 } },
    nineMonths: { label: "Nine months later (11 services)", values: {} },
    afterReview: { label: "After 60-day review (8 services)", values: { services: 8, tools: 3, infraMonthly: 29000, pagesPerWeek: 6, incidentHours: 3.1, exitHours: 240 } }
  };

  function num(value, fallback) {
    var n = typeof value === "number" ? value : parseFloat(value);
    return isFinite(n) ? n : fallback;
  }

  function defaults() {
    var d = {};
    FIELDS.forEach(function (f) { d[f.id] = f.value; });
    return d;
  }

  function preset(name) {
    var p = PRESETS[name];
    if (!p) { throw new Error("Unknown preset: " + name); }
    var d = defaults();
    Object.keys(p.values).forEach(function (k) { d[k] = p.values[k]; });
    return d;
  }

  // Bad input is clamped into the documented range, never propagated as NaN.
  function normalise(input) {
    var out = {};
    FIELDS.forEach(function (f) {
      var v = num(input && input[f.id], f.value);
      out[f.id] = Math.min(f.max, Math.max(f.min, v));
    });
    return out;
  }

  function round(n, places) {
    var m = Math.pow(10, places);
    return Math.round(n * m) / m;
  }

  function compute(input) {
    var i = normalise(input);
    var executionCost = i.infraMonthly + i.licencesMonthly;
    var upgradeHours = i.tools * i.upgradeHours;
    var serviceHours = i.services * i.serviceHours;
    var oncallHours = i.pagesPerWeek * WEEKS_PER_MONTH * i.hoursPerPage;
    var operationsHours = upgradeHours + serviceHours + oncallHours;
    var incidentTotalHours = i.incidentHours * i.responders;
    var cognitiveHours = i.engineers * i.tools * i.learningHours;
    var exitHoursPerMonth = i.exitHours / i.amortMonths;
    var totalHours = operationsHours + incidentTotalHours + cognitiveHours + exitHoursPerMonth;
    var capacityHours = i.engineers * i.productiveHours;
    var budgetHours = capacityHours * i.budgetPct / 100;
    var budgetUsedPct = budgetHours > 0 ? totalHours / budgetHours * 100 : (totalHours > 0 ? Infinity : 0);
    var hoursCost = totalHours * i.hourlyRate;
    var status = budgetUsedPct <= 80 ? "within" : (budgetUsedPct <= 100 ? "near" : "over");

    return {
      executionCost: round(executionCost, 2),
      upgradeHours: round(upgradeHours, 2),
      serviceHours: round(serviceHours, 2),
      oncallHours: round(oncallHours, 2),
      operationsHours: round(operationsHours, 2),
      incidentHours: round(incidentTotalHours, 2),
      cognitiveHours: round(cognitiveHours, 2),
      exitHoursPerMonth: round(exitHoursPerMonth, 2),
      totalHours: round(totalHours, 2),
      capacityHours: round(capacityHours, 2),
      budgetHours: round(budgetHours, 2),
      budgetUsedPct: isFinite(budgetUsedPct) ? round(budgetUsedPct, 1) : budgetUsedPct,
      hoursCost: round(hoursCost, 2),
      totalMonthlyCost: round(executionCost + hoursCost, 2),
      status: status
    };
  }

  return { FIELDS: FIELDS, PRESETS: PRESETS, WEEKS_PER_MONTH: WEEKS_PER_MONTH, defaults: defaults, preset: preset, normalise: normalise, compute: compute };
});
