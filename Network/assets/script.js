document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('pre').forEach(pre => {
        const button = document.createElement('button');
        button.className = 'copy-button';
        button.textContent = '复制';
        button.addEventListener('click', () => {
            const code = pre.querySelector('code');
            navigator.clipboard.writeText(code ? code.textContent : pre.textContent);
            button.textContent = '已复制!';
            setTimeout(() => button.textContent = '复制', 2000);
        });
        if (!pre.querySelector('.copy-button')) {
            pre.appendChild(button);
        }
    });

    document.querySelectorAll('.tabs').forEach(tabGroup => {
        const buttons = tabGroup.querySelectorAll('.tab-buttons button');
        const contents = tabGroup.querySelectorAll('.tab-content');
        buttons.forEach((button, index) => {
            button.addEventListener('click', () => {
                buttons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-selected', 'false');
                });
                contents.forEach(content => content.classList.remove('active'));
                button.classList.add('active');
                button.setAttribute('aria-selected', 'true');
                if (contents[index]) contents[index].classList.add('active');
            });
        });
    });
});
