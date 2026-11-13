document.addEventListener('DOMContentLoaded', () => {
    // 代码块一键复制
    document.querySelectorAll('pre code').forEach(block => {
        const button = document.createElement('button');
        button.className = 'copy-button';
        button.textContent = '复制';
        button.setAttribute('aria-label', '复制代码到剪贴板');
        button.addEventListener('click', () => {
            navigator.clipboard.writeText(block.textContent).then(() => {
                button.textContent = '已复制';
                setTimeout(() => { button.textContent = '复制'; }, 1800);
            });
        });
        block.parentElement.appendChild(button);
    });

    // 标签页切换
    document.querySelectorAll('.tabs').forEach(tabGroup => {
        const buttons = tabGroup.querySelectorAll('.tab-buttons button');
        const contents = tabGroup.querySelectorAll('.tab-content');
        buttons.forEach((button, index) => {
            button.addEventListener('click', () => {
                buttons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
                contents.forEach(c => c.classList.remove('active'));
                button.classList.add('active');
                button.setAttribute('aria-selected', 'true');
                contents[index].classList.add('active');
            });
        });
    });

    // Mermaid 初始化（若页面存在 mermaid 容器）
    if (document.querySelector('.mermaid') && window.mermaid) {
        window.mermaid.initialize({
            startOnLoad: true,
            theme: 'neutral',
            flowchart: { useMaxWidth: true, htmlLabels: true, curve: 'basis' },
            securityLevel: 'loose'
        });
    }
});
