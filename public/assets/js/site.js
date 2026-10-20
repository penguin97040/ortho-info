// First Liturgy: small progressive enhancements. Every page works without this file.
(function () {
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Liturgy stepper: turns the ordered list into one-step-at-a-time cards.
  function initStepper(root) {
    var items = Array.prototype.slice.call(root.querySelectorAll(".stepper-list > li"));
    if (items.length < 2) return;
    var current = 0;

    var controls = document.createElement("div");
    controls.className = "stepper-controls";

    var prev = document.createElement("button");
    prev.type = "button";
    prev.className = "btn";
    prev.textContent = "← Back";

    var next = document.createElement("button");
    next.type = "button";
    next.className = "btn btn-primary";

    var dots = document.createElement("div");
    dots.className = "stepper-dots";
    items.forEach(function (item, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", "Step " + (i + 1) + ": " + item.querySelector("h3").textContent);
      dot.addEventListener("click", function () { show(i, true); });
      dots.appendChild(dot);
    });

    controls.appendChild(prev);
    controls.appendChild(dots);
    controls.appendChild(next);
    root.appendChild(controls);
    root.classList.add("is-live");

    function show(i, focus) {
      current = Math.max(0, Math.min(items.length - 1, i));
      items.forEach(function (item, j) { item.hidden = j !== current; });
      Array.prototype.forEach.call(dots.children, function (dot, j) {
        if (j === current) dot.setAttribute("aria-current", "step");
        else dot.removeAttribute("aria-current");
      });
      prev.disabled = current === 0;
      next.disabled = current === items.length - 1;
      next.textContent = current === items.length - 1 ? "The end" : "Next →";
      if (focus) {
        var heading = items[current].querySelector("h3");
        heading.setAttribute("tabindex", "-1");
        heading.focus({ preventScroll: true });
        if (root.getBoundingClientRect().top < 0) {
          root.scrollIntoView({ block: "start", behavior: reduceMotion ? "auto" : "smooth" });
        }
      }
    }

    prev.addEventListener("click", function () { show(current - 1, true); });
    next.addEventListener("click", function () { show(current + 1, true); });
    root.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") show(current + 1, true);
      if (e.key === "ArrowLeft") show(current - 1, true);
    });

    show(0, false);
  }

  // Floor plan: clicking a part of the building highlights its description.
  function initPlan(root) {
    var links = Array.prototype.slice.call(root.querySelectorAll("svg a"));
    var items = Array.prototype.slice.call(root.querySelectorAll(".plan-list li"));

    function activate(id, scroll) {
      links.forEach(function (a) {
        a.classList.toggle("is-active", a.getAttribute("href") === "#" + id);
      });
      items.forEach(function (li) {
        var on = li.id === id;
        li.classList.toggle("is-active", on);
        if (on && scroll) li.scrollIntoView({ block: "center", behavior: reduceMotion ? "auto" : "smooth" });
      });
    }

    links.forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        activate(a.getAttribute("href").slice(1), true);
      });
    });
    items.forEach(function (li) {
      li.addEventListener("click", function () { activate(li.id, false); });
    });
  }

  // Orthodox Pascha: Julian computus, shifted to the civil (Gregorian) calendar.
  // The 13-day offset is correct for 1900-2099.
  function pascha(year) {
    var a = year % 4, b = year % 7, c = year % 19;
    var d = (19 * c + 15) % 30;
    var e = (2 * a + 4 * b - d + 34) % 7;
    var month = Math.floor((d + e + 114) / 31);
    var day = ((d + e + 114) % 31) + 1;
    return new Date(Date.UTC(year, month - 1, day + 13));
  }

  function addDays(date, n) {
    return new Date(date.getTime() + n * 86400000);
  }

  function initPascha(tbody) {
    var fmt = new Intl.DateTimeFormat("en-NZ", { day: "numeric", month: "long", timeZone: "UTC" });
    var now = new Date();
    var today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    var start = now.getFullYear();
    if (pascha(start).getTime() < today) start += 1;

    tbody.textContent = "";
    for (var y = start; y < start + 3; y++) {
      var p = pascha(y);
      var cells = [String(y), fmt.format(addDays(p, -48)), fmt.format(p), fmt.format(addDays(p, 49))];
      var tr = document.createElement("tr");
      if (y === start) tr.className = "is-current";
      cells.forEach(function (text) {
        var td = document.createElement("td");
        td.className = "nowrap";
        td.textContent = text;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    }
  }

  document.querySelectorAll("[data-stepper]").forEach(initStepper);
  document.querySelectorAll("[data-plan]").forEach(initPlan);
  document.querySelectorAll("[data-pascha]").forEach(initPascha);
})();
