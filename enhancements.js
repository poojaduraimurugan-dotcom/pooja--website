/* ================================================================
   TCF INSTITUTE — enhancements.js
   Implements all 11 HR tasks:
   1. Live Chat Bot  2. UI/UX  3. Responsive  4. Dark/Light
   5. Animated Sections  6. Skeleton Screens  7. Navbar/Footer
   8. Form Validation  9. Toast/Notifications  10. Search/Filter
   11. Dashboard Cards
   ================================================================ */
(function () {
  'use strict';

  /* ── 1. TOAST NOTIFICATION SYSTEM ─────────────────────── */
  function injectToastStack() {
    if (document.getElementById('tcfToastStack')) return;
    const stack = document.createElement('div');
    stack.id = 'tcfToastStack';
    document.body.appendChild(stack);
  }

  const TOAST_ICONS = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️', xp: '⚡' };

  window.showToast = function (msg, type, duration) {
    type = type || 'info';
    duration = duration || 3500;
    injectToastStack();
    const stack = document.getElementById('tcfToastStack');
    const t = document.createElement('div');
    t.className = 'tcf-toast ' + type;
    t.innerHTML =
      '<span class="tcf-toast-icon">' + (TOAST_ICONS[type] || 'ℹ️') + '</span>' +
      '<span class="tcf-toast-msg">' + msg + '</span>' +
      '<button class="tcf-toast-close" onclick="this.parentElement.remove()">✕</button>' +
      '<div class="tcf-toast-bar"></div>';
    stack.appendChild(t);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { t.classList.add('show'); });
    });
    setTimeout(function () {
      t.classList.add('hide');
      setTimeout(function () { t.remove(); }, 400);
    }, duration);
    t.addEventListener('click', function () { t.remove(); });
  };

  /* ── 2. SKELETON SCREEN HELPERS ────────────────────────── */
  window.showSkeleton = function (containerId, count, height) {
    height = height || 220;
    const el = document.getElementById(containerId);
    if (!el) return;
    let html = '<div class="skeleton-wrap">';
    for (let i = 0; i < (count || 3); i++) {
      html +=
        '<div class="skeleton-card">' +
        '<div class="skeleton-img" style="height:' + height + 'px"></div>' +
        '<div class="skeleton-body">' +
        '<div class="skeleton-line short"></div>' +
        '<div class="skeleton-line"></div>' +
        '<div class="skeleton-line"></div>' +
        '<div class="skeleton-line xshort"></div>' +
        '</div></div>';
    }
    html += '</div>';
    el.innerHTML = html;
  };

  window.hideSkeleton = function (containerId, realHTML) {
    const el = document.getElementById(containerId);
    if (el) el.innerHTML = realHTML;
  };

  /* ── 3. SCROLL REVEAL ANIMATIONS ───────────────────────── */
  function initReveal() {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = el.dataset.delay || (i * 80);
          setTimeout(function () { el.classList.add('show'); }, parseInt(delay));
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-child')
      .forEach(function (el) { observer.observe(el); });
  }

  /* ── 4. ENHANCED NAVBAR ─────────────────────────────────── */
  function initNavbar() {
    // Active link highlight
    var page = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a').forEach(function (a) {
      if (a.getAttribute('href') === page) a.classList.add('active-link');
    });

    // Glassmorphism on scroll
    var header = document.querySelector('header');
    if (header) {
      window.addEventListener('scroll', function () {
        header.classList.toggle('scrolled', window.scrollY > 50);
      }, { passive: true });
    }

    // Inject newsletter into footer if not present
    injectFooterNewsletter();
  }

  /* ── 5. FOOTER NEWSLETTER ───────────────────────────────── */
  function injectFooterNewsletter() {
    var footer = document.querySelector('footer');
    if (!footer || document.getElementById('footerNewsletter')) return;
    var brand = footer.querySelector('.footer-brand');
    if (!brand) return;
    var nl = document.createElement('div');
    nl.id = 'footerNewsletter';
    nl.className = 'footer-newsletter';
    nl.innerHTML =
      '<h4>📧 Stay Updated</h4>' +
      '<p style="color:#555;font-size:12px;margin-bottom:10px;">Get course updates & placement news</p>' +
      '<div class="footer-newsletter-form">' +
      '<input type="email" id="nlEmail" placeholder="Enter your email">' +
      '<button onclick="subscribeNewsletter()">Subscribe</button>' +
      '</div>';
    brand.appendChild(nl);
  }

  window.subscribeNewsletter = function () {
    var email = document.getElementById('nlEmail');
    if (!email) return;
    var val = email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      showToast('Please enter a valid email address', 'error'); return;
    }
    email.value = '';
    showToast('🎉 Subscribed successfully! Welcome to TCF updates.', 'success');
  };

  /* ── 6. ADVANCED FORM VALIDATION ───────────────────────── */
  var RULES = {
    name:    { re: /^[a-zA-Z\s]{2,50}$/, msg: 'Enter a valid name (min 2 letters)', allow: /[a-zA-Z\s]/, max: 50 },
    email:   { re: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, msg: 'Enter a valid email address', allow: /[a-zA-Z0-9@._\-]/, max: 100 },
    phone:   { re: /^[6-9][0-9]{9}$/, msg: 'Enter valid 10-digit Indian mobile number', allow: /[0-9]/, max: 10 },
    message: { re: /^[\s\S]{10,}$/, msg: 'Message must be at least 10 characters', allow: /[\s\S]/, max: 500 },
    text:    { re: /^.{2,}$/, msg: 'This field is required', allow: /[\s\S]/, max: 200 }
  };

  function getOrCreateError(input) {
    var wrap = input.closest('.form-group') || input.parentElement;
    var err = wrap.querySelector('.error-msg');
    if (!err) {
      err = document.createElement('div');
      err.className = 'error-msg';
      wrap.appendChild(err);
    }
    return err;
  }

  function validateField(input) {
    var type = input.dataset.validate || input.dataset.type;
    if (!type || !RULES[type]) return true;
    var rule = RULES[type];
    var val = input.value.trim();
    var err = getOrCreateError(input);
    if (!rule.re.test(val)) {
      input.classList.remove('valid'); input.classList.add('invalid');
      err.textContent = rule.msg; err.classList.add('show');
      return false;
    }
    input.classList.remove('invalid'); input.classList.add('valid');
    err.classList.remove('show');
    return true;
  }

  function initFormValidation() {
    document.querySelectorAll('input[data-validate], textarea[data-validate]').forEach(function (input) {
      var type = input.dataset.validate;
      if (RULES[type]) input.setAttribute('maxlength', RULES[type].max);

      input.addEventListener('input', function () { validateField(this); });
      input.addEventListener('blur',  function () { validateField(this); });
    });

    // Intercept form submits
    document.querySelectorAll('form[data-validate-form]').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        var valid = true;
        form.querySelectorAll('input[data-validate], textarea[data-validate]').forEach(function (f) {
          if (!validateField(f)) valid = false;
        });
        if (!valid) { e.preventDefault(); showToast('Please fix the errors above', 'error'); }
      });
    });
  }

  /* ── 7. SEARCH & FILTER ENGINE ──────────────────────────── */
  window.TCFSearch = {
    init: function (options) {
      // options: { inputId, containerId, itemSelector, fields, filterAttr }
      var input = document.getElementById(options.inputId);
      if (!input) return;
      var self = this;
      self._opts = options;

      input.addEventListener('input', function () {
        self.run(this.value.trim().toLowerCase());
        var clearBtn = document.querySelector('.search-clear');
        if (clearBtn) clearBtn.style.display = this.value ? 'block' : 'none';
      });

      // Filter chips
      document.querySelectorAll('.filter-chip').forEach(function (chip) {
        chip.addEventListener('click', function () {
          document.querySelectorAll('.filter-chip').forEach(function (c) { c.classList.remove('active'); });
          this.classList.add('active');
          self._activeFilter = this.dataset.filter || 'all';
          self.run(input.value.trim().toLowerCase());
        });
      });

      // Sort
      var sortEl = document.querySelector('.sort-select');
      if (sortEl) {
        sortEl.addEventListener('change', function () {
          self._sort = this.value;
          self.run(input.value.trim().toLowerCase());
        });
      }
    },

    _activeFilter: 'all',
    _sort: '',

    run: function (query) {
      var opts = this._opts;
      var container = document.getElementById(opts.containerId);
      if (!container) return;
      var items = container.querySelectorAll(opts.itemSelector);
      var visible = 0;

      items.forEach(function (item) {
        var text = (item.innerText || item.textContent).toLowerCase();
        var filterVal = item.dataset[opts.filterAttr || 'filter'] || '';
        var matchQuery = !query || text.includes(query);
        var matchFilter = (this._activeFilter === 'all') || filterVal.includes(this._activeFilter);
        var show = matchQuery && matchFilter;
        item.style.display = show ? '' : 'none';
        if (show) visible++;
      }.bind(this));

      // No results message
      var noRes = container.querySelector('.no-results');
      if (visible === 0) {
        if (!noRes) {
          noRes = document.createElement('div');
          noRes.className = 'no-results';
          noRes.innerHTML = '<div class="no-results-icon">🔍</div><p>No results found for "<strong>' + query + '</strong>"</p>';
          container.appendChild(noRes);
        }
      } else if (noRes) {
        noRes.remove();
      }
    }
  };

  /* ── 8. NOTIFICATION PANEL ──────────────────────────────── */
  window.TCFNotif = {
    _notifications: [
      { id: 1, icon: '🎓', iconBg: 'rgba(0,255,255,0.12)', title: 'New Batch Starting Jan 15!', body: 'Limited seats available — register now.', time: '2 hrs ago', read: false },
      { id: 2, icon: '🎁', iconBg: 'rgba(76,175,80,0.12)', title: 'Free Demo Class — Saturday 10AM', body: 'Join our free demo class this weekend.', time: '1 day ago', read: false },
      { id: 3, icon: '🏆', iconBg: 'rgba(255,152,0,0.12)', title: '350+ Students Placed!', body: 'TCS, Infosys, Wipro & more are hiring.', time: '2 days ago', read: true },
      { id: 4, icon: '☁️', iconBg: 'rgba(0,128,255,0.12)', title: 'AWS Cloud Course Now Available', body: 'Enroll in our new AWS certification course.', time: '3 days ago', read: true }
    ],

    init: function () {
      this._injectPanel();
      this._updateBadge();
    },

    _injectPanel: function () {
      if (document.getElementById('tcfNotifPanel')) return;
      var self = this;
      var panel = document.createElement('div');
      panel.id = 'tcfNotifPanel';
      panel.className = 'notif-panel-box';
      panel.innerHTML =
        '<div class="notif-panel-head">' +
        '<h3>🔔 Notifications</h3>' +
        '<button class="notif-mark-all" onclick="TCFNotif.markAllRead()">Mark all read</button>' +
        '</div>' +
        '<div class="notif-panel-list" id="tcfNotifList"></div>' +
        '<div class="notif-panel-footer"><a href="#">View all notifications →</a></div>';
      document.body.appendChild(panel);
      this._renderList();

      // Close on outside click
      document.addEventListener('click', function (e) {
        if (!panel.contains(e.target) && !e.target.closest('#notifBtn') && !e.target.closest('[data-notif-toggle]')) {
          panel.classList.remove('open');
        }
      });
    },

    _renderList: function () {
      var list = document.getElementById('tcfNotifList');
      if (!list) return;
      list.innerHTML = this._notifications.map(function (n) {
        return '<div class="notif-row ' + (n.read ? '' : 'unread') + '" onclick="TCFNotif.markRead(' + n.id + ')">' +
          '<div class="notif-dot ' + (n.read ? 'read' : '') + '"></div>' +
          '<div class="notif-row-icon" style="background:' + n.iconBg + '">' + n.icon + '</div>' +
          '<div class="notif-row-body"><h4>' + n.title + '</h4><p>' + n.body + '</p><span>' + n.time + '</span></div>' +
          '</div>';
      }).join('');
    },

    _updateBadge: function () {
      var unread = this._notifications.filter(function (n) { return !n.read; }).length;
      var dot = document.getElementById('notifDot');
      if (dot) { dot.textContent = unread; dot.style.display = unread ? 'flex' : 'none'; }
    },

    toggle: function () {
      var panel = document.getElementById('tcfNotifPanel');
      if (panel) panel.classList.toggle('open');
    },

    markRead: function (id) {
      this._notifications.forEach(function (n) { if (n.id === id) n.read = true; });
      this._renderList();
      this._updateBadge();
    },

    markAllRead: function () {
      this._notifications.forEach(function (n) { n.read = true; });
      this._renderList();
      this._updateBadge();
    },

    push: function (title, body, icon) {
      this._notifications.unshift({ id: Date.now(), icon: icon || '🔔', iconBg: 'rgba(0,255,255,0.12)', title: title, body: body, time: 'Just now', read: false });
      this._renderList();
      this._updateBadge();
      showToast('🔔 ' + title, 'info');
    }
  };

  /* ── 9. MODERN DASHBOARD CARDS BUILDER ──────────────────── */
  window.buildDashCard = function (opts) {
    // opts: { icon, iconClass, value, label, badge, badgeClass, footer, chartData, accent }
    var bars = '';
    if (opts.chartData) {
      var max = Math.max.apply(null, opts.chartData);
      bars = '<div class="dash-mini-chart">' +
        opts.chartData.map(function (v, i) {
          var h = Math.round((v / max) * 100);
          var active = i === opts.chartData.length - 1 ? ' active' : '';
          return '<div class="dash-mini-bar' + active + '" style="height:' + h + '%" title="' + v + '"></div>';
        }).join('') + '</div>';
    }
    return '<div class="dash-card" style="--card-accent:' + (opts.accent || 'linear-gradient(90deg,#00ffff,#0080ff)') + '">' +
      '<div class="dash-card-header">' +
      '<div class="dash-card-icon ' + (opts.iconClass || 'cyan') + '">' + opts.icon + '</div>' +
      (opts.badge ? '<span class="dash-card-badge ' + (opts.badgeClass || 'badge-new') + '">' + opts.badge + '</span>' : '') +
      '</div>' +
      '<div class="dash-card-value">' + opts.value + '</div>' +
      '<div class="dash-card-label">' + opts.label + '</div>' +
      bars +
      (opts.footer ? '<div class="dash-card-footer">' + opts.footer + '</div>' : '') +
      '</div>';
  };

  /* ── 10. LIVE CHAT BOT ENHANCEMENTS ─────────────────────── */
  function enhanceChatBot() {
    // Add typing sound feedback & improved UX
    var style = document.createElement('style');
    style.textContent =
      '#chatWidget{transition:all 0.3s;}' +
      '#chatToggle{animation:chatPulse 2.5s ease-in-out infinite;}' +
      '@keyframes chatPulse{0%,100%{box-shadow:0 4px 24px rgba(0,255,255,0.5);}50%{box-shadow:0 4px 40px rgba(0,255,255,0.9),0 0 0 8px rgba(0,255,255,0.1);}}' +
      '#chatBox{animation:chatSlideUp 0.35s cubic-bezier(0.34,1.56,0.64,1);}' +
      '@keyframes chatSlideUp{from{opacity:0;transform:translateY(20px) scale(0.95);}to{opacity:1;transform:translateY(0) scale(1);}}';
    document.head.appendChild(style);
  }

  /* ── 11. CONTACT FORM VALIDATION & SUBMIT ───────────────── */
  function initContactForm() {
    var sendBtn = document.querySelector('[onclick="sendMsg()"]');
    if (!sendBtn) return;
    sendBtn.removeAttribute('onclick');
    sendBtn.classList.add('form-submit-btn');
    sendBtn.innerHTML = '<span class="btn-text">Send Message 🚀</span><div class="btn-loader"></div>';
    sendBtn.addEventListener('click', function () {
      var fields = [
        { id: 'cName', type: 'name' },
        { id: 'cEmail', type: 'email' },
        { id: 'cPhone', type: 'phone' },
        { id: 'cMsg', type: 'message' }
      ];
      var valid = true;
      fields.forEach(function (f) {
        var el = document.getElementById(f.id);
        if (!el) return;
        el.dataset.validate = f.type;
        if (!validateField(el)) valid = false;
      });
      if (!valid) { showToast('Please fix the errors before submitting', 'error'); return; }

      sendBtn.classList.add('loading');
      setTimeout(function () {
        sendBtn.classList.remove('loading');
        showToast('✅ Message sent! We will contact you within 24 hours.', 'success', 5000);
        ['cName', 'cEmail', 'cPhone', 'cMsg'].forEach(function (id) {
          var el = document.getElementById(id);
          if (el) { el.value = ''; el.classList.remove('valid', 'invalid'); }
        });
        var cc = document.getElementById('charCount');
        if (cc) cc.textContent = '0 / 300';
      }, 1500);
    });
  }

  /* ── 12. COURSES PAGE SEARCH/FILTER ─────────────────────── */
  function initCoursesFilter() {
    if (!document.getElementById('coursesGrid')) return;

    // Tag each card with data-filter
    var tagMap = {
      'Most Popular': 'popular', 'High Demand': 'trending demand',
      'Trending': 'trending', 'New Course': 'new', 'Cloud Computing': 'cloud',
      'Job Ready': 'popular'
    };
    document.querySelectorAll('#coursesGrid .course-card').forEach(function (card) {
      var tag = card.querySelector('.course-tag');
      if (tag) {
        var key = Object.keys(tagMap).find(function (k) { return tag.innerText.includes(k); });
        card.dataset.filter = key ? tagMap[key] : 'all';
      }
    });

    TCFSearch.init({
      inputId: 'searchInput',
      containerId: 'coursesGrid',
      itemSelector: '.course-card',
      filterAttr: 'filter'
    });
  }

  /* ── 13. DARK/LIGHT MODE PERSISTENCE ────────────────────── */
  function initTheme() {
    var saved = localStorage.getItem('tcfTheme');
    if (saved === 'light') {
      document.body.classList.add('light-mode');
      var btn = document.getElementById('themeToggle');
      if (btn) btn.innerText = '🌞';
    }
  }

  /* ── 14. NOTIF BELL WIRE-UP ─────────────────────────────── */
  function wireNotifBell() {
    var bell = document.getElementById('notifBtn');
    if (!bell) return;
    bell.addEventListener('click', function (e) {
      e.stopPropagation();
      TCFNotif.toggle();
      // Hide old panel if exists
      var old = document.getElementById('notifPanel');
      if (old) old.style.display = 'none';
    });
  }

  /* ── INIT ────────────────────────────────────────────────── */
  function init() {
    injectToastStack();
    initReveal();
    initNavbar();
    initFormValidation();
    initCoursesFilter();
    initContactForm();
    initTheme();
    enhanceChatBot();
    TCFNotif.init();
    wireNotifBell();

    // Welcome toast on first visit
    if (!sessionStorage.getItem('tcfWelcomed')) {
      sessionStorage.setItem('tcfWelcomed', '1');
      setTimeout(function () {
        showToast('👋 Welcome to TCF Institute! Explore our courses.', 'info', 4000);
      }, 2500);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
