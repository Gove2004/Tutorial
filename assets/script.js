// === tModLoader Tutorial - Interactive Scripts ===

(function() {
  // --- Theme: default dark, remember preference ---
  var saved = localStorage.getItem('theme');
  var theme = saved || 'dark';
  document.documentElement.setAttribute('data-theme', theme);

  document.addEventListener('DOMContentLoaded', function() {
    initThemeToggle();
    initCopyButtons();
    initTabs();
  });

  function initThemeToggle() {
    var btn = document.createElement('button');
    btn.className = 'theme-toggle';
    btn.title = '切换深色/浅色模式';
    updateBtn(btn);
    btn.addEventListener('click', function() {
      var current = document.documentElement.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateBtn(btn);
    });
    document.body.appendChild(btn);
  }

  function updateBtn(btn) {
    var t = document.documentElement.getAttribute('data-theme');
    btn.textContent = t === 'dark' ? '☾' : '☀';
  }

  // --- Code Copy Button ---
  function initCopyButtons() {
    document.querySelectorAll('pre code').forEach(function(block) {
      var pre = block.parentElement;
      if (pre.querySelector('.copy-btn')) return;

      var btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.textContent = '复制';
      btn.addEventListener('click', function() {
        navigator.clipboard.writeText(block.textContent).then(function() {
          btn.textContent = '已复制!';
          btn.classList.add('copied');
          setTimeout(function() { btn.textContent = '复制'; btn.classList.remove('copied'); }, 2000);
        }).catch(function() {
          var range = document.createRange();
          range.selectNodeContents(block);
          var sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
          document.execCommand('copy');
          sel.removeAllRanges();
          btn.textContent = '已复制!';
          btn.classList.add('copied');
          setTimeout(function() { btn.textContent = '复制'; btn.classList.remove('copied'); }, 2000);
        });
      });

      pre.appendChild(btn);
    });
  }

  // --- Tab Switching ---
  function initTabs() {
    document.querySelectorAll('.tabs').forEach(function(tabGroup) {
      var buttons = tabGroup.querySelectorAll('.tab-buttons button');
      var contents = tabGroup.querySelectorAll('.tab-content');

      buttons.forEach(function(btn, i) {
        btn.addEventListener('click', function() {
          buttons.forEach(function(b) { b.classList.remove('active'); });
          contents.forEach(function(c) { c.classList.remove('active'); });
          btn.classList.add('active');
          if (contents[i]) contents[i].classList.add('active');
        });
      });
    });
  }

  // --- Smooth scroll for anchor links ---
  document.addEventListener('click', function(e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
})();
