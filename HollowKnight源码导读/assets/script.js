document.addEventListener('DOMContentLoaded', () => {
    // 代码块复制按钮
    document.querySelectorAll('pre code').forEach(block => {
        const button = document.createElement('button');
        button.className = 'copy-button';
        button.textContent = '复制';
        button.addEventListener('click', () => {
            navigator.clipboard.writeText(block.textContent).then(() => {
                button.textContent = '已复制';
                setTimeout(() => button.textContent = '复制', 1800);
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
                buttons.forEach(b => b.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                button.classList.add('active');
                contents[index].classList.add('active');
            });
        });
    });

    // Mermaid 初始化
    if (window.mermaid) {
        mermaid.initialize({
            startOnLoad: true,
            theme: 'neutral',
            flowchart: { useMaxWidth: true, htmlLabels: true, curve: 'basis' },
            themeVariables: {
                primaryColor: '#eaf2fa',
                primaryBorderColor: '#3b6ea5',
                primaryTextColor: '#1c2530',
                lineColor: '#5a7088',
                secondaryColor: '#f1f4f8',
                tertiaryColor: '#fbfcfd',
                fontFamily: '-apple-system, "Segoe UI", "Microsoft YaHei", sans-serif'
            }
        });
    }
});
