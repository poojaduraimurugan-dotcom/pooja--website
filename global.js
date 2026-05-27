// TCF Institute - Global Features JS
(function () {

  // 1. PAGE LOADING SPINNER
  const spinnerCSS = '<style>@keyframes spin{to{transform:rotate(360deg);}}</style>';
  const spinnerHTML = '<div id="pageSpinner" style="position:fixed;inset:0;background:#0b0f1a;z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;transition:opacity 0.5s;"><div style="width:50px;height:50px;border:3px solid rgba(0,255,255,0.15);border-top:3px solid #00ffff;border-radius:50%;animation:spin 0.8s linear infinite;margin-bottom:16px;"></div><p style="color:#00ffff;font-size:13px;font-weight:600;letter-spacing:1px;">Loading TCF Institute...</p></div>';
  document.body.insertAdjacentHTML('afterbegin', spinnerCSS + spinnerHTML);
  window.addEventListener('load', function () {
    var sp = document.getElementById('pageSpinner');
    if (sp) { sp.style.opacity = '0'; setTimeout(function () { sp.remove(); }, 500); }
  });

  // 2. MOBILE HAMBURGER MENU
  var mStyle = document.createElement('style');
  mStyle.textContent = '#hamburger{display:none;flex-direction:column;gap:5px;cursor:pointer;padding:8px;border:none;background:transparent;z-index:1100;}#hamburger span{display:block;width:24px;height:2px;background:#00ffff;border-radius:2px;transition:0.3s;}#hamburger.open span:nth-child(1){transform:rotate(45deg) translate(5px,5px);}#hamburger.open span:nth-child(2){opacity:0;}#hamburger.open span:nth-child(3){transform:rotate(-45deg) translate(5px,-5px);}#mobileNav{display:none;position:fixed;top:0;right:0;width:280px;height:100vh;background:#111827;z-index:1099;padding:80px 25px 30px;flex-direction:column;gap:8px;box-shadow:-10px 0 40px rgba(0,0,0,0.5);transform:translateX(100%);transition:transform 0.35s ease;}#mobileNav.open{transform:translateX(0);}#mobileNavOverlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:1098;}#mobileNav a{color:#ccc;text-decoration:none;padding:12px 16px;border-radius:10px;font-size:15px;font-weight:600;transition:0.3s;border:1px solid transparent;}#mobileNav a:hover{color:#00ffff;background:rgba(0,255,255,0.08);border-color:rgba(0,255,255,0.2);}#mobileNav .mob-btn{background:#00ffff;color:#0b0f1a!important;text-align:center;margin-top:10px;}@media(max-width:768px){#hamburger{display:flex!important;}}';
  document.head.appendChild(mStyle);

  function injectMobileNav() {
    var header = document.querySelector('header');
    if (!header || document.getElementById('hamburger')) return;

    var btn = document.createElement('button');
    btn.id = 'hamburger';
    btn.setAttribute('aria-label', 'Menu');
    btn.innerHTML = '<span></span><span></span><span></span>';
    header.appendChild(btn);

    var overlay = document.createElement('div');
    overlay.id = 'mobileNavOverlay';
    document.body.appendChild(overlay);

    var nav = document.createElement('div');
    nav.id = 'mobileNav';
      nav.innerHTML = '<a href="index.html">&#127968; Home</a><a href="courses.html">&#128218; Courses</a><a href="placements.html">&#127942; Placements</a><a href="mock-assessment.html">&#128221; Mock Assessment</a><a href="interview.html">&#129302; Mock Interview</a><a href="about.html">&#8505;&#65039; About</a><a href="contact.html">&#128222; Contact</a><a href="auth.html">&#128273; Login</a><a href="apply.html">&#128221; Apply Now</a><a href="dashboard.html" class="mob-btn">&#128202; Dashboard</a>';
    document.body.appendChild(nav);

    function openMenu() {
      btn.classList.add('open');
      nav.style.display = 'flex';
      overlay.style.display = 'block';
      setTimeout(function () { nav.classList.add('open'); }, 10);
    }
    function closeMenu() {
      btn.classList.remove('open');
      nav.classList.remove('open');
      setTimeout(function () { nav.style.display = 'none'; overlay.style.display = 'none'; }, 350);
    }
    btn.addEventListener('click', function () {
      nav.classList.contains('open') ? closeMenu() : openMenu();
    });
    overlay.addEventListener('click', closeMenu);
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });
  }

  // 3. COOKIE CONSENT BANNER
  function injectCookieBanner() {
    if (localStorage.getItem('tcfCookies')) return;
    var banner = document.createElement('div');
    banner.id = 'cookieBanner';
    banner.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:#111827;border-top:1px solid rgba(0,255,255,0.2);padding:16px 30px;display:flex;align-items:center;justify-content:space-between;gap:20px;z-index:9990;flex-wrap:wrap;';
    banner.innerHTML = '<div style="display:flex;align-items:center;gap:12px;flex:1;"><span style="font-size:24px;">&#127850;</span><p style="color:#ccc;font-size:13px;line-height:1.6;">We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.</p></div><div style="display:flex;gap:10px;flex-shrink:0;"><button onclick="acceptCookies()" style="padding:9px 20px;background:#00ffff;color:#0b0f1a;border:none;border-radius:8px;font-weight:700;font-size:13px;cursor:pointer;">Accept All</button><button onclick="declineCookies()" style="padding:9px 20px;background:transparent;color:#aaa;border:1px solid rgba(255,255,255,0.15);border-radius:8px;font-size:13px;cursor:pointer;">Decline</button></div>';
    document.body.appendChild(banner);
  }

  window.acceptCookies = function () {
    localStorage.setItem('tcfCookies', 'accepted');
    var b = document.getElementById('cookieBanner');
    if (b) b.remove();
  };
  window.declineCookies = function () {
    localStorage.setItem('tcfCookies', 'declined');
    var b = document.getElementById('cookieBanner');
    if (b) b.remove();
  };

  // 4. SOCIAL SHARE BAR
  window.shareToWhatsApp = function () { window.open('https://wa.me/?text=' + encodeURIComponent(document.title + ' - ' + location.href), '_blank'); };
  window.shareToFacebook = function () { window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(location.href), '_blank'); };
  window.shareToTwitter = function () { window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(document.title) + '&url=' + encodeURIComponent(location.href), '_blank'); };
  window.copyLink = function () {
    navigator.clipboard.writeText(location.href).then(function () {
      showGlobalToast('Link copied!', 'success');
    });
  };

  function injectShareBar() {
    var footer = document.querySelector('footer');
    if (!footer || document.getElementById('shareBar')) return;
    var bar = document.createElement('div');
    bar.id = 'shareBar';
    bar.style.cssText = 'text-align:center;padding:20px;border-top:1px solid rgba(255,255,255,0.05);background:#060810;';
    bar.innerHTML = '<p style="color:#555;font-size:12px;margin-bottom:12px;letter-spacing:1px;text-transform:uppercase;">Share TCF Institute</p><div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;"><button onclick="shareToWhatsApp()" style="padding:8px 16px;background:rgba(37,211,102,0.15);color:#25D366;border:1px solid rgba(37,211,102,0.3);border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;">&#128172; WhatsApp</button><button onclick="shareToFacebook()" style="padding:8px 16px;background:rgba(24,119,242,0.15);color:#1877f2;border:1px solid rgba(24,119,242,0.3);border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;">&#128216; Facebook</button><button onclick="shareToTwitter()" style="padding:8px 16px;background:rgba(29,161,242,0.15);color:#1da1f2;border:1px solid rgba(29,161,242,0.3);border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;">&#128038; Twitter</button><button onclick="copyLink()" style="padding:8px 16px;background:rgba(0,255,255,0.1);color:#00ffff;border:1px solid rgba(0,255,255,0.3);border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;">&#128279; Copy Link</button></div>';
    footer.insertAdjacentElement('beforebegin', bar);
  }

  // 5. GLOBAL TOAST
  window.showGlobalToast = function (msg, type) {
    type = type || 'info';
    var colors = { success: '#4caf50', error: '#f44336', info: '#00ffff', warning: '#ff9800' };
    var t = document.createElement('div');
    t.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%) translateY(-80px);background:' + (colors[type] || colors.info) + ';color:' + (type === 'info' ? '#000' : '#fff') + ';padding:12px 24px;border-radius:10px;font-size:14px;font-weight:700;z-index:99999;transition:0.4s;box-shadow:0 8px 30px rgba(0,0,0,0.4);white-space:nowrap;';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.style.transform = 'translateX(-50%) translateY(0)'; }, 10);
    setTimeout(function () { t.style.transform = 'translateX(-50%) translateY(-80px)'; setTimeout(function () { t.remove(); }, 400); }, 3000);
  };

  // 6. PUSH NOTIFICATION PROMPT
  function askNotificationPermission() {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'default' && !localStorage.getItem('tcfNotifAsked')) {
      setTimeout(function () {
        var box = document.createElement('div');
        box.id = 'notifPrompt';
        box.style.cssText = 'position:fixed;top:80px;right:20px;width:300px;background:#111827;border:1px solid rgba(0,255,255,0.25);border-radius:14px;padding:20px;z-index:9991;box-shadow:0 10px 40px rgba(0,0,0,0.5);';
        box.innerHTML = '<div style="display:flex;gap:12px;align-items:flex-start;"><span style="font-size:28px;">&#128276;</span><div><h4 style="color:#00ffff;font-size:14px;margin-bottom:6px;">Stay Updated!</h4><p style="color:#aaa;font-size:12px;line-height:1.6;margin-bottom:14px;">Get notified about new batches, placements & free demo classes!</p><div style="display:flex;gap:8px;"><button onclick="enableNotif()" style="flex:1;padding:8px;background:#00ffff;color:#000;border:none;border-radius:7px;font-weight:700;font-size:12px;cursor:pointer;">Allow</button><button onclick="dismissNotif()" style="padding:8px 12px;background:rgba(255,255,255,0.06);color:#aaa;border:none;border-radius:7px;font-size:12px;cursor:pointer;">Later</button></div></div></div>';
        document.body.appendChild(box);
        localStorage.setItem('tcfNotifAsked', '1');
      }, 5000);
    }
  }

  window.enableNotif = function () {
    Notification.requestPermission().then(function (p) {
      var box = document.getElementById('notifPrompt');
      if (box) box.remove();
      if (p === 'granted') {
        showGlobalToast('Notifications enabled!', 'success');
        new Notification('TCF Institute', { body: 'Welcome! You will get updates on new batches & placements.', icon: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' });
      }
    });
  };
  window.dismissNotif = function () {
    var box = document.getElementById('notifPrompt');
    if (box) box.remove();
  };

  // 7. ACTIVE NAV HIGHLIGHT
  function highlightActiveNav() {
    var page = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a').forEach(function (a) {
      var href = a.getAttribute('href');
      if (href && href !== '#' && page === href) {
        a.style.color = '#00ffff';
        a.style.background = 'rgba(0,255,255,0.1)';
      }
    });
  }

  // INIT
  function init() {
    injectMobileNav();
    injectCookieBanner();
    injectShareBar();
    askNotificationPermission();
    highlightActiveNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
