// 创建侧边栏
function createSidebar() {
    let sidebar = document.getElementById('cheko-sidebar');
    if (sidebar) return sidebar;

    sidebar = document.createElement('div');
    sidebar.id = 'cheko-sidebar';
    sidebar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 500px; 
        height: 100vh;
        background: white;
        border-right: 1px solid #e0e0e0;
        padding: 20px;
        overflow-y: auto;
        display: none;
        z-index: 9999;
        transition: left 0.3s ease;
        font-family: 'Segoe UI', sans-serif;
        line-height: 1.6;
        box-sizing: border-box;
        font-size: 0.9em; 
    `;

    // 创建缩放手柄
    const resizeHandle = document.createElement('div');
    resizeHandle.style.cssText = `
        position: absolute;
        top: 0;
        right: -5px;
        width: 10px;
        height: 100vh;
        background: #ddd;
        cursor: ew-resize;
        z-index: 10000;
    `;

    // 处理鼠标按下事件
    resizeHandle.addEventListener('mousedown', (e) => {
        e.preventDefault();
        const startX = e.clientX;
        const initialWidth = parseInt(sidebar.style.width);

        const onMouseMove = (e) => {
            const delta = e.clientX - startX;
            const newWidth = Math.max(200, initialWidth + delta); 
            sidebar.style.width = `${newWidth}px`;
            document.body.style.paddingLeft = `${newWidth}px`;
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    sidebar.appendChild(resizeHandle);

    // 创建关闭按钮
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        padding: 6px 12px;
        background: #f44336;
        color: white;
        border: none;
        border-radius: 3px;
        cursor: pointer;
    `;
    closeBtn.onclick = () => {
        sidebar.style.display = 'none';
        document.body.style.paddingLeft = '0px';
    };
    sidebar.appendChild(closeBtn);

    document.body.appendChild(sidebar);
    return sidebar;
}

// 更新侧边栏内容
function updateSidebarContent() {
    const sidebar = document.getElementById('cheko-sidebar');
    if (!sidebar) {
        console.log('未找到侧边栏元素');
        return;
    }

    const targetDiv = document.querySelector('[class="w-[1000px] flex flex-col gap-10"]');
    if (!targetDiv) {
        console.log('未找到目标内容区域');
        return;
    }

    const content = document.createElement('div');
    content.innerHTML = targetDiv.innerHTML;

    // 优化内容显示样式
    content.querySelectorAll('*').forEach(el => {
        if (el.tagName === 'IMG') {
            el.style.maxWidth = '100%';
            el.style.height = 'auto';
        }
        el.style.boxSizing = 'border-box';
        el.style.wordBreak = 'break-word';
        el.style.fontSize = '0.9em'; 
    });

    sidebar.innerHTML = `
        ${content.innerHTML}
    `;
}

// 初始化侧边栏展示
function initSidebar() {
    const sidebar = createSidebar();
    updateSidebarContent();
    sidebar.style.display = 'block';
    document.body.style.paddingLeft = sidebar.style.width;

    // 监听 DOM 变化
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const allButtons = document.querySelectorAll('button');
                let prevButton = null;
                let nextButton = null;
                let endButton = null;

                allButtons.forEach(button => {
                    if (button.textContent.includes('上一题')) {
                        prevButton = button;
                    } else if (button.textContent.includes('下一题')) {
                        nextButton = button;
                    } else if (button.textContent.includes('结束')) {
                        endButton = button;
                    }
                });

                if (prevButton && !prevButton.hasAttribute('data-event-bound')) {
                    prevButton.setAttribute('data-event-bound', 'true');
                    prevButton.addEventListener('click', () => {
                        // 等待 300 毫秒后更新侧边栏内容
                        setTimeout(updateSidebarContent, 300); 
                    });
                }

                if (nextButton && !nextButton.hasAttribute('data-event-bound')) {
                    nextButton.setAttribute('data-event-bound', 'true');
                    nextButton.addEventListener('click', () => {
                        // 等待 300 毫秒后更新侧边栏内容
                        setTimeout(updateSidebarContent, 300); 
                    });
                }

                if (endButton && !endButton.hasAttribute('data-event-bound')) {
                    endButton.setAttribute('data-event-bound', 'true');
                    endButton.addEventListener('click', () => {
                        sidebar.style.display = 'none';
                        document.body.style.paddingLeft = '0px';
                    });
                }

                const targetDivs = document.querySelectorAll('.flex.justify-center.items-center');
                targetDivs.forEach((targetDiv) => {
                    if (!targetDiv.hasAttribute('data-event-bound')) {
                        targetDiv.setAttribute('data-event-bound', 'true');
                        targetDiv.addEventListener('click', () => {
                            // 等待 300 毫秒后更新侧边栏内容
                            setTimeout(updateSidebarContent, 300); 
                        });
                    }
                });
            }
        }
    });

    // 开始监听
    observer.observe(document.body, { childList: true, subtree: true });
}

// 页面加载完成后执行初始化操作
window.addEventListener('load', initSidebar);