/* JYU Glossary of Enterprise Information Systems — languages, search, filter and sort.
   Works on the HTML Jekyll renders; without JavaScript every term is still listed
   in the two default languages. */
(function () {
  "use strict";

  var list = document.getElementById("terms");
  if (!list) return;

  var LANGS = window.GLOSSARY_LANGS || [];
  var CODES = LANGS.map(function (l) { return l.code; });
  var NATIVE = {};
  LANGS.forEach(function (l) { NATIVE[l.code] = l.native; });
  var DEFAULT = window.GLOSSARY_DEFAULT || [CODES[0], CODES[1]];

  var items = Array.prototype.slice.call(list.querySelectorAll(".term"));
  var byId = {};
  items.forEach(function (el) { byId[el.id] = el; });
  var total = items.length;

  var input = document.getElementById("q");
  var selL = document.getElementById("lang-l");
  var selR = document.getElementById("lang-r");
  var swap = document.getElementById("swap");
  var chL = document.getElementById("ch-l");
  var chR = document.getElementById("ch-r");
  var countEl = document.getElementById("count");
  var empty = document.getElementById("empty");
  var emptyQ = document.getElementById("empty-q");
  var emptyLink = document.getElementById("empty-suggest");
  var catButtons = document.querySelectorAll(".cats [data-cat]");
  var sided = Array.prototype.slice.call(list.querySelectorAll("[data-side]"));
  var relatedLinks = Array.prototype.slice.call(list.querySelectorAll("a[data-related]"));

  // Search ignores case and accents, so "jarjestelma" finds "järjestelmä"
  // and "gestion" finds "gestão". Every language is searched, shown or not.
  function norm(s) {
    return (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  }
  items.forEach(function (el) { el._text = norm(el.textContent); });

  var collators = {};
  function collator(code) {
    if (!collators[code]) collators[code] = new Intl.Collator(code, { sensitivity: "base", ignorePunctuation: true });
    return collators[code];
  }

  function valid(code) { return CODES.indexOf(code) !== -1; }

  // Initial state: the URL first, then what this reader chose last time, then the defaults.
  var params = new URLSearchParams(window.location.search);
  var saved = null;
  try { saved = JSON.parse(window.localStorage.getItem("glossary-langs") || "null"); } catch (e) { saved = null; }
  var state = {
    q: params.get("q") || "",
    cat: params.get("cat") || "",
    l: valid(params.get("l")) ? params.get("l") : (saved && valid(saved[0]) ? saved[0] : DEFAULT[0]),
    r: valid(params.get("r")) ? params.get("r") : (saved && valid(saved[1]) ? saved[1] : DEFAULT[1])
  };
  if (state.l === state.r) state.r = state.l === DEFAULT[1] ? DEFAULT[0] : DEFAULT[1];

  function firstLetter(word, code) {
    var ch = Array.from((word || "").trim())[0] || "";
    return ch.toLocaleUpperCase(code);
  }

  function applyLanguages() {
    sided.forEach(function (el) {
      var code = el.dataset.lang;
      el.dataset.side = code === state.l ? "l" : code === state.r ? "r" : "";
    });
    relatedLinks.forEach(function (a) {
      var target = byId[a.dataset.related];
      if (target) {
        a.textContent = target.dataset[state.l];
        a.lang = state.l;
      }
    });
    selL.value = state.l;
    selR.value = state.r;
    chL.textContent = NATIVE[state.l];
    chL.lang = state.l;
    chR.textContent = NATIVE[state.r];
    chR.lang = state.r;
    try { window.localStorage.setItem("glossary-langs", JSON.stringify([state.l, state.r])); } catch (e) { /* storage unavailable */ }
  }

  function render() {
    var words = norm(state.q).trim().split(/\s+/).filter(Boolean);
    var key = state.l;
    var sorted = items.slice().sort(function (a, b) {
      return collator(key).compare(a.dataset[key], b.dataset[key]);
    });

    Array.prototype.forEach.call(list.querySelectorAll(".letter"), function (h) { h.remove(); });

    var frag = document.createDocumentFragment();
    var prev = null;
    var shown = 0;
    sorted.forEach(function (el) {
      var match =
        (!state.cat || el.dataset.cat === state.cat) &&
        words.every(function (w) { return el._text.indexOf(w) !== -1; });
      el.hidden = !match;
      if (match) {
        shown++;
        var letter = firstLetter(el.dataset[key], key);
        if (letter !== prev) {
          var h = document.createElement("h2");
          h.className = "letter";
          h.lang = key;
          h.textContent = letter;
          frag.appendChild(h);
          prev = letter;
        }
      }
      frag.appendChild(el);
    });
    list.appendChild(frag);

    countEl.textContent = shown === total ? total + " terms" : shown + " of " + total + " terms";

    empty.hidden = shown !== 0;
    if (shown === 0) {
      emptyQ.textContent = state.q || "this area";
      var title = state.q ? "&title=" + encodeURIComponent("[Term] " + state.q) : "";
      emptyLink.href = emptyLink.dataset.base + title;
    }

    Array.prototype.forEach.call(catButtons, function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.cat === state.cat));
    });

    var p = new URLSearchParams();
    if (state.q) p.set("q", state.q);
    if (state.cat) p.set("cat", state.cat);
    if (state.l !== DEFAULT[0] || state.r !== DEFAULT[1]) {
      p.set("l", state.l);
      p.set("r", state.r);
    }
    var qs = p.toString();
    history.replaceState(null, "", (qs ? "?" + qs : window.location.pathname) + window.location.hash);
  }

  function setLanguages(l, r) {
    state.l = l;
    state.r = r;
    applyLanguages();
    render();
  }

  input.value = state.q;
  input.addEventListener("input", function () {
    state.q = input.value;
    render();
  });

  // Picking the language already on the other side swaps the two.
  selL.addEventListener("change", function () {
    var l = selL.value;
    setLanguages(l, l === state.r ? state.l : state.r);
  });
  selR.addEventListener("change", function () {
    var r = selR.value;
    setLanguages(r === state.l ? state.r : state.l, r);
  });
  swap.addEventListener("click", function () {
    setLanguages(state.r, state.l);
  });

  Array.prototype.forEach.call(catButtons, function (b) {
    b.addEventListener("click", function () {
      state.cat = b.dataset.cat;
      render();
    });
  });

  // Press "/" anywhere to jump to the search box; Escape clears it.
  document.addEventListener("keydown", function (e) {
    var tag = document.activeElement && document.activeElement.tagName;
    if (e.key === "/" && !/input|textarea|select/i.test(tag)) {
      e.preventDefault();
      input.focus();
      input.select();
    }
    if (e.key === "Escape" && document.activeElement === input && input.value) {
      input.value = "";
      state.q = "";
      render();
    }
  });

  // A link to a term that is currently filtered out clears the filters first.
  function revealHash() {
    var id = decodeURIComponent(window.location.hash.slice(1));
    var target = id && byId[id];
    if (target && target.hidden) {
      state.q = "";
      state.cat = "";
      input.value = "";
      render();
      target.scrollIntoView();
    }
  }
  window.addEventListener("hashchange", revealHash);

  applyLanguages();
  render();
  revealHash();
})();
