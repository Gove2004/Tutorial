/* ============================================================
   Tutorial 主题切换（浅色 / 深色）
   设计约定：
   1. 脚本位于 <head> 内且内联执行，先于样式加载写入 html[data-theme]，
      避免首屏闪烁；
   2. 未手动选择时跟随系统 prefers-color-scheme；
   3. 手动选择写入 localStorage，跨页面与跨标签页同步；
   4. 深色规则集中放在 assets/theme-dark.css，浅色样式保持原样。
   ============================================================ */

(function () {
  'use strict';

  var STORAGE_KEY = 'tutorial:theme';
  var root = document.documentElement;
  var current = 'light';
  var hasChoice = false;
  var button = null;

  function readChoice() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      return saved === 'light' || saved === 'dark' ? saved : null;
    } catch (err) {
      return null;
    }
  }

  function saveChoice(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (err) {
      /* file:// 或隐私模式下可能禁用存储，忽略即可，不影响本次切换 */
    }
  }

  function systemTheme() {
    try {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch (err) {
      /* 老浏览器不支持 matchMedia 时按浅色处理 */
    }
    return 'light';
  }

  function updateButton() {
    if (!button) {
      return;
    }
    var target = current === 'dark' ? '浅色' : '深色';
    var label = '切换到' + target + '主题';
    button.setAttribute('aria-label', label);
    button.setAttribute('title', label);
    button.setAttribute('aria-pressed', current === 'dark' ? 'true' : 'false');
  }

  function apply(theme) {
    current = theme === 'dark' ? 'dark' : 'light';
    root.setAttribute('data-theme', current);
    root.style.colorScheme = current;
    updateButton();
  }

  function injectStyles() {
    if (document.getElementById('theme-toggle-style')) {
      return;
    }
    var style = document.createElement('style');
    style.id = 'theme-toggle-style';
    style.textContent = [
      '.theme-toggle{position:fixed;right:18px;bottom:18px;z-index:9999;display:flex;',
      'align-items:center;justify-content:center;width:44px;height:44px;padding:0;',
      'border-radius:50%;border:1px solid rgba(20,30,40,.16);background:rgba(255,255,255,.9);',
      'color:#26313d;box-shadow:0 6px 18px rgba(15,25,40,.16);cursor:pointer;',
      '-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);',
      'transition:background-color .2s ease,border-color .2s ease,color .2s ease,transform .2s ease,box-shadow .2s ease}',
      '.theme-toggle:hover{transform:translateY(-2px);box-shadow:0 10px 22px rgba(15,25,40,.22)}',
      '.theme-toggle:active{transform:translateY(0)}',
      '.theme-toggle:focus-visible{outline:2px solid currentColor;outline-offset:3px}',
      'html[data-theme="dark"] .theme-toggle{background:rgba(30,39,49,.92);',
      'border-color:rgba(255,255,255,.18);color:#e8edf4;box-shadow:0 6px 20px rgba(0,0,0,.45)}',
      'html[data-theme="dark"] .theme-toggle:hover{box-shadow:0 10px 24px rgba(0,0,0,.55)}',
      '.theme-toggle .icon-sun{display:none}',
      '.theme-toggle .icon-moon{display:block}',
      'html[data-theme="dark"] .theme-toggle .icon-sun{display:block}',
      'html[data-theme="dark"] .theme-toggle .icon-moon{display:none}',
      '.chapter-footer .chapter-nav{padding-right:56px}',
      '@media (max-width:768px){.theme-toggle{right:12px;bottom:12px;width:40px;height:40px}}',
      '@media print{.theme-toggle{display:none!important}.chapter-footer .chapter-nav{padding-right:0}}'
    ].join('');
    (document.head || document.documentElement).appendChild(style);
  }

  function createButton() {
    if (document.querySelector('.theme-toggle') || !document.body) {
      return;
    }

    button = document.createElement('button');
    button.type = 'button';
    button.className = 'theme-toggle';
    button.innerHTML = [
      '<svg class="icon-moon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">',
      '<path d="M21 12.6a9 9 0 1 1-9.6-9 7.2 7.2 0 0 0 9.6 9Z" fill="currentColor"/>',
      '</svg>',
      '<svg class="icon-sun" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">',
      '<circle cx="12" cy="12" r="4.2" fill="currentColor"/>',
      '<g stroke="currentColor" stroke-width="1.8" stroke-linecap="round">',
      '<line x1="12" y1="2.2" x2="12" y2="4.4"/>',
      '<line x1="12" y1="19.6" x2="12" y2="21.8"/>',
      '<line x1="2.2" y1="12" x2="4.4" y2="12"/>',
      '<line x1="19.6" y1="12" x2="21.8" y2="12"/>',
      '<line x1="5.2" y1="5.2" x2="6.8" y2="6.8"/>',
      '<line x1="17.2" y1="17.2" x2="18.8" y2="18.8"/>',
      '<line x1="5.2" y1="18.8" x2="6.8" y2="17.2"/>',
      '<line x1="17.2" y1="6.8" x2="18.8" y2="5.2"/>',
      '</g>',
      '</svg>'
    ].join('');

    button.addEventListener('click', function () {
      hasChoice = true;
      var next = current === 'dark' ? 'light' : 'dark';
      saveChoice(next);
      apply(next);
    });

    document.body.appendChild(button);
    updateButton();
  }

  function init() {
    injectStyles();
    createButton();
    updateButton();
  }

  /* ---------- 首屏应用主题 ---------- */

  var saved = readChoice();
  hasChoice = saved !== null;
  apply(saved || systemTheme());

  /* ---------- 跟随系统（用户未手动选择时） ---------- */

  if (!hasChoice && window.matchMedia) {
    try {
      var query = window.matchMedia('(prefers-color-scheme: dark)');
      var onChange = function (event) {
        if (!hasChoice) {
          apply(event.matches ? 'dark' : 'light');
        }
      };
      if (query.addEventListener) {
        query.addEventListener('change', onChange);
      } else if (query.addListener) {
        query.addListener(onChange);
      }
    } catch (err) {
      /* 忽略 */
    }
  }

  /* ---------- 多标签页同步 ---------- */

  window.addEventListener('storage', function (event) {
    if (event.key !== STORAGE_KEY) {
      return;
    }
    if (event.newValue === 'light' || event.newValue === 'dark') {
      hasChoice = true;
      apply(event.newValue);
    }
  });

  /* ---------- 对外接口 ---------- */

  window.TutorialTheme = {
    get: function () { return current; },
    set: function (theme) {
      hasChoice = true;
      saveChoice(theme);
      apply(theme);
    },
    toggle: function () {
      hasChoice = true;
      var next = current === 'dark' ? 'light' : 'dark';
      saveChoice(next);
      apply(next);
      return next;
    }
  };

  /* ---------- DOM 就绪后创建按钮 ---------- */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
