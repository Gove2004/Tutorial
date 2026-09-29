// IIFE，避免污染全局；DOM 判空，失败不阻塞页面
(function () {
    try {
        // 代码块复制按钮
        var blocks = document.querySelectorAll('pre code');
        blocks.forEach(function (block) {
            var pre = block.parentElement;
            if (!pre) return;
            var button = document.createElement('button');
            button.className = 'copy-button';
            button.textContent = '复制';
            button.addEventListener('click', function () {
                var done = function () {
                    button.textContent = '已复制!';
                    setTimeout(function () { button.textContent = '复制'; }, 1800);
                };
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(block.textContent).then(done).catch(done);
                } else {
                    // 降级：选中文本
                    var range = document.createRange();
                    range.selectNodeContents(block);
                    var sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                    done();
                }
            });
            pre.appendChild(button);
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
                    if (contents[index]) contents[index].classList.add('active');
                });
            });
        });
    } catch (e) {
        // 静默降级，不影响阅读
    }
})();
