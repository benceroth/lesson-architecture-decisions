(function () {
  "use strict";

  var form = document.getElementById("inputs");
  var rows = document.getElementById("rows");
  var live = document.getElementById("live");
  var meter = document.getElementById("meter");
  var numbers = {};
  var ranges = {};

  var usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  var dec = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });

  TCO.FIELDS.forEach(function (f) {
    var wrap = document.createElement("div");
    wrap.className = "field";

    var label = document.createElement("label");
    label.htmlFor = "n-" + f.id;
    label.id = "l-" + f.id;
    label.textContent = f.label + " (" + f.unit + ")";

    var num = document.createElement("input");
    num.type = "number";
    num.id = "n-" + f.id;
    num.name = f.id;
    num.min = f.min; num.max = f.max; num.step = f.step;
    num.setAttribute("aria-describedby", "h-" + f.id);

    var range = document.createElement("input");
    range.type = "range";
    range.min = f.min; range.max = f.max; range.step = f.step;
    range.setAttribute("aria-labelledby", "l-" + f.id);
    range.setAttribute("aria-describedby", "h-" + f.id);
    range.tabIndex = -1; // the number field is the keyboard path; the slider is a pointer convenience

    var help = document.createElement("small");
    help.id = "h-" + f.id;
    help.textContent = f.help;

    wrap.appendChild(label); wrap.appendChild(num); wrap.appendChild(range); wrap.appendChild(help);
    form.appendChild(wrap);
    numbers[f.id] = num; ranges[f.id] = range;

    num.addEventListener("input", function () { ranges[f.id].value = num.value; update(); });
    range.addEventListener("input", function () { num.value = range.value; update(); });
  });

  function setValues(values) {
    TCO.FIELDS.forEach(function (f) {
      numbers[f.id].value = values[f.id];
      ranges[f.id].value = values[f.id];
    });
  }

  function read() {
    var v = {};
    TCO.FIELDS.forEach(function (f) { v[f.id] = numbers[f.id].value; });
    return v;
  }

  var STATUS_TEXT = {
    within: "Within budget",
    near: "Near the limit",
    over: "Over budget"
  };

  function update() {
    var r = TCO.compute(read());
    var pct = isFinite(r.budgetUsedPct) ? r.budgetUsedPct : 999;
    meter.value = Math.min(pct, 150);
    meter.textContent = pct + "%";
    live.textContent = STATUS_TEXT[r.status] + ": " + dec.format(r.totalHours) + " hours a month of upkeep, " +
      (isFinite(r.budgetUsedPct) ? dec.format(r.budgetUsedPct) + "% of a " + dec.format(r.budgetHours) + "-hour complexity budget." : "no budget set.");
    live.className = "summary " + r.status;

    var data = [
      ["Execution cost (infrastructure and vendors)", usd.format(r.executionCost)],
      ["Operations: upgrades", dec.format(r.upgradeHours) + " h"],
      ["Operations: service upkeep", dec.format(r.serviceHours) + " h"],
      ["Operations: on-call pages", dec.format(r.oncallHours) + " h"],
      ["Incident response", dec.format(r.incidentHours) + " h"],
      ["Cognitive load (learning)", dec.format(r.cognitiveHours) + " h"],
      ["Exit effort, spread monthly", dec.format(r.exitHoursPerMonth) + " h"],
      ["Total upkeep hours", dec.format(r.totalHours) + " h"],
      ["Team capacity", dec.format(r.capacityHours) + " h"],
      ["Complexity budget", dec.format(r.budgetHours) + " h"],
      ["Hours converted to dollars (optional)", usd.format(r.hoursCost)],
      ["Total monthly cost", usd.format(r.totalMonthlyCost)]
    ];
    rows.textContent = "";
    data.forEach(function (d) {
      var tr = document.createElement("tr");
      var th = document.createElement("th"); th.scope = "row"; th.textContent = d[0];
      var td = document.createElement("td"); td.textContent = d[1];
      tr.appendChild(th); tr.appendChild(td); rows.appendChild(tr);
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll("[data-preset]"), function (btn) {
    btn.addEventListener("click", function () {
      setValues(TCO.preset(btn.getAttribute("data-preset")));
      Array.prototype.forEach.call(document.querySelectorAll("[data-preset]"), function (b) {
        b.setAttribute("aria-pressed", b === btn ? "true" : "false");
      });
      update();
    });
  });

  setValues(TCO.preset("nineMonths"));
  update();
})();
