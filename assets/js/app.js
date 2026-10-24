(function () {
  var D = window.DOCS || {};
  var nav = D.nav || [];
  var icons = window.DOCS_ICONS || {};
  var groupState = {};

  function ico(name) {
    var body = icons[name] || icons.file || "";
    return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + body + "</svg>";
  }

  function currentPage() {
    var p = decodeURIComponent((location.pathname.split("/").pop() || "").toLowerCase());
    return p || "index.html";
  }

  function isOpen(idx, item, cur) {
    if (Object.prototype.hasOwnProperty.call(groupState, idx)) return groupState[idx];
    if (item.open) return true;
    return item.href === cur || (item.children || []).some(function (c) { return c.href === cur; });
  }

  function renderNav(container, cur) {
    var html = "";
    if (D.label) html += '<p class="nav-label">' + D.label + "</p>";
    nav.forEach(function (item, idx) {
      if (item.children && item.children.length) {
        var open = isOpen(idx, item, cur);
        html += '<div class="nav-group' + (open ? " open" : "") + '" data-group="' + idx + '">';
        html += '<a class="nav-item nav-group-head' + (item.href === cur ? " active" : "") + '" href="' + item.href + '">' + ico(item.icon) + "<span>" + item.text + "</span>";
        html += '<span class="chevron" role="button" tabindex="0" aria-expanded="' + (open ? "true" : "false") + '" aria-label="Свернуть или развернуть">' + ico("chevron") + "</span></a>";
        html += '<div class="nav-children"><div class="nav-children-inner">';
        item.children.forEach(function (c) {
          html += '<a class="nav-item' + (c.href === cur ? " active" : "") + '" href="' + c.href + '">' + c.text + "</a>";
        });
        html += "</div></div></div>";
      } else {
        html += '<a class="nav-item' + (item.href === cur ? " active" : "") + '" href="' + item.href + '">' + ico(item.icon) + "<span>" + item.text + "</span></a>";
      }
    });
    container.innerHTML = html;
  }

  function flatten() {
    var out = [];
    nav.forEach(function (it) {
      if (it.children && it.children.length) {
        if (it.href) out.push(it); /* страница самой категории */
        it.children.forEach(function (c) { out.push(c); });
      } else out.push(it);
    });
    return out;
  }

  function pagerCard(p, dir) {
    var ic = dir === "prev" ? ico("chevronLeft") : ico("chevronRight");
    return '<a class="pager-card ' + dir + '" href="' + p.href + '">' +
      '<div class="pager-title">' + ic + "<p>" + p.text + "</p></div>" +
      '<p class="pager-desc">' + (p.desc || "") + "</p></a>";
  }

  function renderPager(el, cur) {
    var list = flatten();
    var i = -1;
    for (var k = 0; k < list.length; k++) { if (list[k].href === cur) { i = k; break; } }
    if (i < 0) return;
    var html = "";
    if (i > 0) html += pagerCard(list[i - 1], "prev");
    if (i < list.length - 1) html += pagerCard(list[i + 1], "next");
    el.innerHTML = html;
  }

  function findItem(href) {
    var found = null;
    function scan(list) {
      for (var i = 0; i < list.length; i++) {
        var it = list[i];
        if (it.href === href) { found = it; return; }
        if (it.children && it.children.length) scan(it.children);
        if (found) return;
      }
    }
    scan(nav);
    return found;
  }

  function renderTitle(cur) {
    var it = findItem(cur);
    if (!it) return;
    var h1 = document.querySelector(".article-header h1");
    var p = document.querySelector(".article-header p");
    if (h1 && it.text) h1.textContent = it.text;
    if (p && it.desc != null) p.textContent = it.desc;
    if (p && it.desc === "") p.style.display = "none";
  }

  function renderAll() {
    var cur = currentPage();
    renderTitle(cur);
    document.querySelectorAll("[data-nav]").forEach(function (el) { renderNav(el, cur); });
    document.querySelectorAll("[data-pager]").forEach(function (el) { renderPager(el, cur); });
  }

  document.querySelectorAll("[data-site-logo]").forEach(function (el) { if (D.logo) el.src = D.logo; });
  document.querySelectorAll("[data-site-name]").forEach(function (el) { if (D.name) el.textContent = D.name; });

  renderAll();

  function toggleGroup(idx) {
    var el = document.querySelector('.nav-group[data-group="' + idx + '"]');
    var willOpen = !groupState.hasOwnProperty(idx)
      ? !el.classList.contains("open")
      : !groupState[idx];
    groupState[idx] = willOpen;
    document.querySelectorAll('.nav-group[data-group="' + idx + '"]').forEach(function (gr) {
      gr.classList.toggle("open", willOpen);
      var chev = gr.querySelector(".chevron");
      if (chev) chev.setAttribute("aria-expanded", willOpen ? "true" : "false");
    });
  }

  document.addEventListener("click", function (e) {
    var chev = e.target.closest(".chevron");
    if (chev) {
      e.preventDefault();
      e.stopPropagation();
      toggleGroup(chev.closest(".nav-group").getAttribute("data-group"));
      return;
    }

    var drawerLink = e.target.closest(".drawer a[href]");
    if (drawerLink) { document.body.classList.remove("drawer-open"); }

    var themeBtn = e.target.closest(".theme-toggle");
    if (themeBtn) {
      var dark = document.body.classList.toggle("dark");
      try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch (err) {}
      return;
    }

    var collapseBtn = e.target.closest(".collapse-btn, .reopen-btn");
    if (collapseBtn) {
      var collapsed = document.body.classList.toggle("collapsed");
      try { localStorage.setItem("sidebar-collapsed", collapsed ? "1" : ""); } catch (err) {}
      return;
    }

    if (e.target.closest(".drawer-open-btn")) { document.body.classList.add("drawer-open"); return; }
    if (e.target.closest(".drawer-close-btn, .drawer-backdrop")) { document.body.classList.remove("drawer-open"); return; }

    var anchor = e.target.closest(".heading-anchor");
    if (anchor) {
      e.preventDefault();
      var url = location.origin + location.pathname + anchor.getAttribute("href");
      history.replaceState(null, "", anchor.getAttribute("href"));
      if (navigator.clipboard) navigator.clipboard.writeText(url).catch(function () {});
      return;
    }
  });

  document.addEventListener("keydown", function (e) {
    if ((e.key === "Enter" || e.key === " ") && e.target.closest && e.target.closest(".chevron")) {
      e.preventDefault();
      toggleGroup(e.target.closest(".nav-group").getAttribute("data-group"));
    }
    if (e.key === "Escape") document.body.classList.remove("drawer-open");
  });

  (function theme() {
    var q = null;
    try { q = new URLSearchParams(location.search).get("theme"); } catch (err) {}
    if (q === "dark" || q === "light") {
      document.body.classList.toggle("dark", q === "dark");
      return;
    }
    var saved = null;
    try { saved = localStorage.getItem("theme"); } catch (err) {}
    var dark = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.body.classList.toggle("dark", dark);
  })();

  (function collapse() {
    var q = null;
    try { q = new URLSearchParams(location.search).get("sidebar"); } catch (err) {}
    if (q === "collapsed") { document.body.classList.add("collapsed"); return; }
    var saved = null;
    try { saved = localStorage.getItem("sidebar-collapsed"); } catch (err) {}
    if (saved) document.body.classList.add("collapsed");
  })();

  (function drawerParam() {
    var q = null;
    try { q = new URLSearchParams(location.search).get("drawer"); } catch (err) {}
    if (q === "open") document.body.classList.add("drawer-open");
  })();

  document.querySelectorAll(".prose h1, .prose h2, .prose h3").forEach(function (h) {
    if (!h.id) {
      h.id = h.textContent.trim().toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\u0400-\u04FF-]/g, "");
    }
    var a = document.createElement("a");
    a.className = "heading-anchor";
    a.href = "#" + h.id;
    a.setAttribute("aria-label", "Скопировать ссылку на заголовок");
    a.innerHTML = ico("link");
    h.appendChild(a);
  });
})();
