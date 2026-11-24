(function () {
    'use strict';

    var THEME_KEY = 'tutorial-theme';

    function readTheme() {
        return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    }

    function paintButtons(theme) {
        document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
            var next = theme === 'dark' ? '浅色' : '深色';
            btn.textContent = next;
            btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
            btn.setAttribute('aria-label', '切换到' + next + '主题');
            btn.title = '切换到' + next + '主题';
        });
    }

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* 隐私模式下不可写，忽略 */ }
        paintButtons(theme);
    }

    // 兜底：某个页面漏写按钮时自动补一个，保证全站都能切换
    function ensureToggle() {
        if (document.querySelector('[data-theme-toggle]')) return;
        var bar = document.createElement('div');
        bar.className = 'page-toolbar';
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'theme-toggle';
        btn.setAttribute('data-theme-toggle', '');
        bar.appendChild(btn);
        document.body.insertBefore(bar, document.body.firstChild);
    }

    document.addEventListener('DOMContentLoaded', function () {
        ensureToggle();
        paintButtons(readTheme());

        document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                setTheme(readTheme() === 'dark' ? 'light' : 'dark');
            });
        });

        // 代码块复制按钮
        document.querySelectorAll('pre code').forEach(function (block) {
            var button = document.createElement('button');
            button.className = 'copy-button';
            button.type = 'button';
            button.textContent = '复制';
            button.setAttribute('aria-label', '复制代码到剪贴板');
            button.addEventListener('click', function () {
                navigator.clipboard.writeText(block.textContent);
                button.textContent = '已复制!';
                setTimeout(function () { button.textContent = '复制'; }, 2000);
            });
            block.parentElement.appendChild(button);
        });

        // 标签页切换
        document.querySelectorAll('.tabs').forEach(function (tabGroup) {
            var buttons = tabGroup.querySelectorAll('.tab-buttons button');
            var contents = tabGroup.querySelectorAll('.tab-content');
            buttons.forEach(function (button, index) {
                button.addEventListener('click', function () {
                    buttons.forEach(function (b) { b.classList.remove('active'); });
                    contents.forEach(function (c) { c.classList.remove('active'); });
                    button.classList.add('active');
                    contents[index].classList.add('active');
                });
            });
        });
    });
})();
