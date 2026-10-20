// First Liturgy: small progressive enhancements. Every page works without this file.
(function () {
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Liturgy stepper: turns the ordered list into one-step-at-a-time cards,
  // with a step index on wide screens and dots on narrow ones.
  function initStepper(root) {
    var items = Array.prototype.slice.call(root.querySelectorAll(".stepper-list > li"));
    if (items.length < 2) return;
    var current = 0;

    function el(tag, className, text) {
      var node = document.createElement(tag);
      if (className) node.className = className;
      if (text) node.textContent = text;
      return node;
    }

    function arrowButton(className, label, arrow, arrowClass, arrowFirst) {
      var b = el("button", className);
      b.type = "button";
      var a = el("span", arrowClass, arrow);
      a.setAttribute("aria-hidden", "true");
      var t = el("span", "label", label);
      if (arrowFirst) { b.appendChild(a); b.appendChild(t); } else { b.appendChild(t); b.appendChild(a); }
      return b;
    }

    var titles = items.map(function (item) { return item.querySelector("h3").textContent; });

    var index = el("ol", "stepper-index");
    index.setAttribute("aria-label", "Parts of the Liturgy");
    var indexButtons = titles.map(function (title, i) {
      var li = el("li");
      var b = el("button");
      b.type = "button";
      b.appendChild(el("span", "", String(i + 1).padStart(2, "0")));
      b.appendChild(document.createTextNode(title.replace(/[“”]/g, "")));
      b.addEventListener("click", function () { show(i, true); });
      li.appendChild(b);
      index.appendChild(li);
      return b;
    });

    var controls = el("div", "stepper-controls");
    var prev = arrowButton("btn prev", "Back", "←", "arrow back", true);
    var next = arrowButton("btn btn-primary next", "Next", "→", "arrow", false);
    var nextLabel = next.querySelector(".label");

    var dots = el("div", "stepper-dots");
    var dotButtons = titles.map(function (title, i) {
      var dot = el("button");
      dot.type = "button";
      dot.setAttribute("aria-label", "Step " + (i + 1) + ": " + title);
      dot.addEventListener("click", function () { show(i, true); });
      dots.appendChild(dot);
      return dot;
    });

    controls.appendChild(prev);
    controls.appendChild(dots);
    controls.appendChild(next);
    root.insertBefore(index, root.firstChild);
    root.appendChild(controls);
    root.classList.add("is-live");

    function mark(buttons) {
      buttons.forEach(function (b, j) {
        if (j === current) b.setAttribute("aria-current", "step");
        else b.removeAttribute("aria-current");
      });
    }

    function show(i, focus) {
      var target = Math.max(0, Math.min(items.length - 1, i));
      var dir = target < current ? "prev" : "next";
      current = target;
      items.forEach(function (item, j) {
        item.hidden = j !== current;
        item.classList.remove("enter");
      });
      if (focus) {
        var shown = items[current];
        shown.setAttribute("data-dir", dir);
        void shown.offsetWidth; // restart the entrance animation
        shown.classList.add("enter");
      }
      mark(dotButtons);
      mark(indexButtons);
      prev.disabled = current === 0;
      next.disabled = current === items.length - 1;
      nextLabel.textContent = current === items.length - 1 ? "The end" : "Next";
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
