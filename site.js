/* CONTACT_EMAIL: set a mailbox to also open a mail draft. */
var CONTACT_EMAIL = "";

(function () {
  var button = document.querySelector("[data-menu-button]");
  var menu = document.querySelector("[data-menu]");
  var inertNodes = document.querySelectorAll("[data-inert-when-menu]");
  var wide = window.matchMedia("(min-width: 761px)");

  function setInert(on) {
    for (var i = 0; i < inertNodes.length; i += 1) {
      inertNodes[i].inert = on;
    }
  }

  function closeMenu(focusButton) {
    if (!button || !menu) return;
    button.setAttribute("aria-expanded", "false");
    menu.classList.remove("is-open");
    setInert(false);
    if (focusButton) button.focus();
  }

  function openMenu() {
    if (!button || !menu) return;
    button.setAttribute("aria-expanded", "true");
    menu.classList.add("is-open");
    setInert(true);
    var first = menu.querySelector("a, button");
    if (first) first.focus();
  }

  if (button && menu) {
    button.addEventListener("click", function () {
      if (button.getAttribute("aria-expanded") === "true") closeMenu(false);
      else openMenu();
    });

    var closers = menu.querySelectorAll("[data-menu-close]");
    for (var c = 0; c < closers.length; c += 1) {
      closers[c].addEventListener("click", function () {
        closeMenu(true);
      });
    }

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && button.getAttribute("aria-expanded") === "true") {
        closeMenu(true);
      }
    });

    function syncWidth() {
      if (menu.getAttribute("data-menu") === "column" && wide.matches) closeMenu(false);
    }

    if (wide.addEventListener) wide.addEventListener("change", syncWidth);
    else if (wide.addListener) wide.addListener(syncWidth);
  }

  var form = document.querySelector("[data-brief]");
  if (!form) return;

  var output = document.querySelector("[data-brief-output]");
  var status = document.querySelector("[data-brief-status]");

  function field(name) {
    var el = form.elements[name];
    return el ? String(el.value || "").trim() : "";
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var name = field("name");
    var company = field("company");
    var need = field("need");
    var timing = field("timing");
    if (!name || !company || !need || !timing) {
      if (status) status.textContent = "Add your name, company, what you need, and the timing.";
      var missing = !name ? "name" : !company ? "company" : !need ? "need" : "timing";
      var empty = form.elements[missing];
      if (empty) empty.focus();
      return;
    }

    var text = [
      "Brief for Michael Watson",
      "",
      "Name: " + name,
      "Company: " + company,
      "What they need: " + need,
      "Timing: " + timing
    ].join("\n");

    if (output) {
      output.hidden = false;
      output.textContent = text;
    }

    var copyPromise = (navigator.clipboard && window.isSecureContext)
      ? navigator.clipboard.writeText(text).then(function () { return true; }, function () { return false; })
      : Promise.resolve(false);

    copyPromise.then(function (copied) {
      if (status) {
        status.textContent = copied
          ? "Copied. The brief is on this page and on your clipboard."
          : "The brief is on this page. Select it and copy it from here.";
      }
      var email = String(CONTACT_EMAIL || "").trim();
      if (email) {
        window.location.href = "mailto:" + email
          + "?subject=" + encodeURIComponent("Brief for Michael Watson")
          + "&body=" + encodeURIComponent(text);
      }
    });
  });
})();
