// 代码块复制按钮
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('pre code').forEach(block => {
        const button = document.createElement('button');
        button.className = 'copy-button';
        button.setAttribute('aria-label', '复制代码到剪贴板');
        button.textContent = '复制';
        button.addEventListener('click', () => {
            navigator.clipboard.writeText(block.textContent);
            button.textContent = '已复制!';
            setTimeout(() => button.textContent = '复制', 2000);
        });
        block.parentElement.appendChild(button);
    });

    // 标签页切换
    document.querySelectorAll('.tabs').forEach(tabGroup => {
        const buttons = tabGroup.querySelectorAll('.tab-buttons button');
        const contents = tabGroup.querySelectorAll('.tab-content');
        buttons.forEach((button, index) => {
            button.addEventListener('click', () => {
                buttons.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });
                contents.forEach(c => c.classList.remove('active'));
                button.classList.add('active');
                button.setAttribute('aria-selected', 'true');
                contents[index].classList.add('active');
            });
        });
    });
});
