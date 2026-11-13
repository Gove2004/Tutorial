document.addEventListener('DOMContentLoaded', () => {
    // 代码块一键复制（不作用于 Mermaid 容器）
    document.querySelectorAll('pre code').forEach(block => {
        const pre = block.parentElement;
        if (pre.classList.contains('mermaid')) return;
        const button = document.createElement('button');
        button.className = 'copy-button';
        button.type = 'button';
        button.setAttribute('aria-label', '复制代码到剪贴板');
        button.textContent = '复制';
        button.addEventListener('click', () => {
            navigator.clipboard.writeText(block.textContent).then(() => {
                button.textContent = '已复制';
                setTimeout(() => button.textContent = '复制', 1800);
            });
        });
        pre.appendChild(button);
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
                if (contents[index]) contents[index].classList.add('active');
            });
        });
    });

    // 外部链接新窗口打开
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    });

    // Mermaid 渲染
    if (window.mermaid) {
        mermaid.initialize({
            startOnLoad: false,
            theme: 'neutral',
            securityLevel: 'loose',
            flowchart: { useMaxWidth: true, htmlLabels: true, curve: 'basis' },
            themeVariables: {
                primaryColor: '#e9f4ff',
                primaryBorderColor: '#007acc',
                primaryTextColor: '#1c2733',
                lineColor: '#5a7a99',
                fontFamily: 'inherit'
            }
        });
        try {
            mermaid.run({ nodes: document.querySelectorAll('pre.mermaid') });
        } catch (err) {
            console.error('Mermaid 渲染失败：', err);
        }
    }
});
