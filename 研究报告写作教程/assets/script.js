/* ============================================================
   研究报告写作教程 · 交互脚本
   1. 代码/示例块复制按钮
   2. 标签页切换
   3. 自查清单勾选状态本地保存
   4. 章节已读标记（供首页显示进度）
   ============================================================ */

(function () {
  'use strict';

  var STORE_PREFIX = 'rrtut:';

  function safeGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  function safeSet(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* file:// 下可能被禁用，忽略 */ }
  }

  function init() {
    initCopyButtons();
    initTabs();
    initChecklists();
    initVisited();
    initProgressBars();
  }

  /* ---------- 1. 复制按钮 ---------- */

  function initCopyButtons() {
    document.querySelectorAll('pre code').forEach(function (block) {
      var btn = document.createElement('button');
      btn.className = 'copy-button';
      btn.type = 'button';
      btn.setAttribute('aria-label', '复制这段内容到剪贴板');
      btn.textContent = '复制';
      btn.addEventListener('click', function () {
        var text = block.textContent;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () {
            flash(btn, '已复制');
          }, function () { fallbackCopy(text, btn); });
        } else {
          fallbackCopy(text, btn);
        }
      });
      block.parentElement.appendChild(btn);
    });
  }

  function fallbackCopy(text, btn) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); flash(btn, '已复制'); } catch (e) { flash(btn, '复制失败'); }
    document.body.removeChild(ta);
  }

  function flash(btn, msg) {
    var original = btn.textContent;
    btn.textContent = msg;
    setTimeout(function () { btn.textContent = original; }, 1600);
  }

  /* ---------- 2. 标签页 ---------- */

  function initTabs() {
    document.querySelectorAll('.tabs').forEach(function (group) {
      var buttons = group.querySelectorAll('.tab-buttons button');
      var contents = group.querySelectorAll('.tab-content');
      buttons.forEach(function (button, index) {
        button.addEventListener('click', function () {
          buttons.forEach(function (b) {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
          });
          contents.forEach(function (c) {
            c.classList.remove('active');
            c.hidden = true;
          });
          button.classList.add('active');
          button.setAttribute('aria-selected', 'true');
          if (contents[index]) {
            contents[index].classList.add('active');
            contents[index].hidden = false;
          }
        });
      });
    });
  }

  /* ---------- 3. 自查清单 ---------- */

  function initChecklists() {
    var page = document.body.getAttribute('data-chapter') || 'x';

    document.querySelectorAll('.check-item input[type="checkbox"]').forEach(function (box, i) {
      var key = STORE_PREFIX + 'ck:' + page + ':' + (box.getAttribute('data-ck') || i);
      if (safeGet(key) === '1') { box.checked = true; }

      box.addEventListener('change', function () {
        safeSet(key, box.checked ? '1' : '0');
        updateCounter(box.closest('.checklist'));
      });
    });

    document.querySelectorAll('.checklist').forEach(updateCounter);
  }

  function updateCounter(list) {
    if (!list) { return; }
    var boxes = list.querySelectorAll('input[type="checkbox"]');
    var counter = list.parentElement.querySelector('.checklist-progress');
    if (!counter || !boxes.length) { return; }
    var done = 0;
    boxes.forEach(function (b) { if (b.checked) { done++; } });
    counter.textContent = '已完成 ' + done + ' / ' + boxes.length + ' 项';
    counter.style.color = done === boxes.length ? '#4f8a4a' : '';
  }

  /* ---------- 4. 已读标记 ---------- */

  function initVisited() {
    var page = document.body.getAttribute('data-chapter');
    if (page) { safeSet(STORE_PREFIX + 'visited:' + page, '1'); }
  }

  /* ---------- 5. 首页进度 ---------- */

  function initProgressBars() {
    var items = document.querySelectorAll('.chapter-item[data-chapter]');
    if (!items.length) { return; }

    var total = items.length;
    var read = 0;

    items.forEach(function (item) {
      var id = item.getAttribute('data-chapter');
      if (safeGet(STORE_PREFIX + 'visited:' + id) === '1') {
        read++;
        var title = item.querySelector('h3');
        if (title && !title.querySelector('.visited-mark')) {
          var mark = document.createElement('span');
          mark.className = 'visited-mark';
          mark.textContent = '✓ 已读';
          title.appendChild(mark);
        }
      }
    });

    var el = document.getElementById('read-progress');
    if (el) {
      el.textContent = read === 0
        ? '还没有开始，从第 1 章读起吧。'
        : '已读 ' + read + ' / ' + total + ' 章' + (read === total ? '，全部完成。' : '，继续加油。');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
