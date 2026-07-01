// 代码块复制按钮
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('pre code').forEach(block => {
        const button = document.createElement('button');
        button.className = 'copy-button';
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
                buttons.forEach(b => b.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                button.classList.add('active');
                contents[index].classList.add('active');
            });
        });
    });
});
