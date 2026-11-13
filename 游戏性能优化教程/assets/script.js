document.addEventListener('DOMContentLoaded', () => {
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

    document.querySelectorAll('.tabs').forEach(tabGroup => {
        const buttons = tabGroup.querySelectorAll('.tab-buttons button');
        const contents = tabGroup.querySelectorAll('.tab-content');
        buttons.forEach((button, index) => {
            button.setAttribute('role', 'tab');
            button.setAttribute('aria-selected', button.classList.contains('active') ? 'true' : 'false');
            button.addEventListener('click', () => {
                buttons.forEach((b, i) => {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                    contents[i].classList.remove('active');
                });
                button.classList.add('active');
                button.setAttribute('aria-selected', 'true');
                contents[index].classList.add('active');
            });
        });
    });

    if (window.mermaid) {
        window.mermaid.initialize({
            startOnLoad: true,
            theme: 'default',
            securityLevel: 'loose',
            flowchart: { useMaxWidth: true, htmlLabels: true },
            sequence: { useMaxWidth: true }
        });
    }
});
