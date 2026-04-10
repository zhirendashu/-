const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(indexPath, 'utf-8');

// 1. 追加 CSS
const cssAccordionBlock = `
        /* ===== Accordion 折叠系统 ===== */
        .accordion-container { width: 100%; max-width: 1200px; display: flex; flex-direction: column; gap: var(--sp-2); margin-top: var(--sp-1); z-index: 10; position: relative; }
        .acc-group { background: rgba(255,255,255,0.015); border: 1px solid rgba(255,255,255,0.06); border-radius: var(--radius-xl); overflow: hidden; transition: var(--transition); }
        .acc-header { display: flex; align-items: center; justify-content: space-between; padding: var(--sp-4); cursor: pointer; background: rgba(0,0,0,0.3); transition: 0.3s; }
        .acc-header:hover { background: rgba(255,255,255,0.04); }
        .acc-title { display: flex; align-items: center; gap: var(--sp-2); font-size: 1.15rem; font-weight: 700; letter-spacing: 1.5px; color: var(--text-main); }
        .acc-title span.acc-badge { background: var(--text-main); color: #000; padding: 3px 10px; border-radius: 100px; font-size: 0.75rem; font-weight: 800; font-family: monospace; }
        .acc-icon { transition: transform 0.45s cubic-bezier(0.23, 1, 0.32, 1); width: 24px; height: 24px; color: var(--text-dim); border: 1px solid rgba(255,255,255,0.1); border-radius: 50%; display:flex; align-items:center; justify-content:center; }
        .acc-content { max-height: 0; overflow: hidden; transition: max-height 0.45s cubic-bezier(0.23, 1, 0.32, 1), padding 0.45s ease; padding: 0 var(--sp-4); }
        
        /* 独立科技感边框高亮状态 */
        .acc-group.sys-active { border-color: rgba(99,102,241,0.3); background: rgba(99,102,241,0.02); box-shadow: 0 10px 40px rgba(0,0,0,0.5); }
        .acc-group.sys-active .acc-badge { background: #6366f1; color: #fff; }
        .acc-group.ai-active { border-color: rgba(155,114,255,0.3); background: rgba(155,114,255,0.02); box-shadow: 0 10px 40px rgba(0,0,0,0.5); }
        .acc-group.ai-active .acc-badge { background: #9b72ff; color: #fff; }
        .acc-group.lab-active { border-color: rgba(244,63,94,0.3); background: rgba(244,63,94,0.02); box-shadow: 0 10px 40px rgba(0,0,0,0.5); }
        .acc-group.lab-active .acc-badge { background: #f43f5e; color: #fff; }

        .acc-group.active .acc-header { background: rgba(255,255,255,0.03); border-bottom: 1px solid rgba(255,255,255,0.05); }
        .acc-group.active .acc-title { color: #fff; }
        .acc-group.active .acc-icon { transform: rotate(180deg); color: #fff; border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.1); }
        .acc-group.active .acc-content { padding: var(--sp-4); }

        /* 卡片内部适配网格 */
        .acc-grid { width: 100%; display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--sp-3); align-items: stretch; }
        @media (max-width: 1024px) { .acc-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .acc-grid { grid-template-columns: 1fr; } .acc-header { padding: var(--sp-3); } .acc-group.active .acc-content { padding: var(--sp-3); } }
`;
if(!content.includes(".accordion-container")) {
    content = content.replace("/* ===== 动态背景 ===== */", cssAccordionBlock + "\n        /* ===== 动态背景 ===== */");
}

/* 2. 提取所有的卡片块 */
const cardRegex = /<a href="[^"]*".*?class="glass-card[^>]*>[\s\S]*?<\/a>/g;
const cards = [];
let match;
while ((match = cardRegex.exec(content)) !== null) {
    cards.push(match[0]);
}

// 基于链接分组
const gpSYS = [];
const gpAI = [];
const gpLAB = [];

cards.forEach(c => {
    let html = c;
    html = html.replace(/opacity: 0;\s*transform:\s*translateY\(20px\);?/, ''); // 移除旧GSAP残留
    html = html.replace(/opacity:\s*0\s*!important;/, '');
    
    if(html.includes("AI摄影创作工作台") || html.includes("Gemini水印修复")) {
        gpAI.push(html);
    } else if (html.includes("字体") || html.includes("顶级字幕") || html.includes("Gruvbox") || html.includes("Catppuccin") || html.includes("Nippon")) {
        gpLAB.push(html);
    } else {
        gpSYS.push(html);
    }
});

// 构建新的 HTML DOM 树
const accordionHTML = `
        <div class="accordion-container">
            
            <!-- 视觉图文处理主干舱 -->
            <div class="acc-group active sys-active" id="grp-sys">
                <div class="acc-header" onclick="toggleAcc('grp-sys', 'sys-active')">
                    <div class="acc-title"><span class="acc-badge">CORE</span> 原生视觉与排版套件</div>
                    <div class="acc-icon"><svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><polyline points="6 9 12 15 18 9"></polyline></svg></div>
                </div>
                <div class="acc-content">
                    <div class="acc-grid">
                        ${gpSYS.join("\n                        ")}
                    </div>
                </div>
            </div>

            <!-- AI 核心智脑中枢 -->
            <div class="acc-group active ai-active" id="grp-ai">
                <div class="acc-header" onclick="toggleAcc('grp-ai', 'ai-active')">
                    <div class="acc-title"><span class="acc-badge">NEURAL</span> AI 物理工作站矩阵</div>
                    <div class="acc-icon"><svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><polyline points="6 9 12 15 18 9"></polyline></svg></div>
                </div>
                <div class="acc-content">
                    <div class="acc-grid">
                        ${gpAI.join("\n                        ")}
                    </div>
                </div>
            </div>

            <!-- 美学色彩分离调取实验室 -->
            <div class="acc-group" id="grp-lab">
                <div class="acc-header" onclick="toggleAcc('grp-lab', 'lab-active')">
                    <div class="acc-title"><span class="acc-badge">COLORS</span> 专业美学色彩色盘实验室</div>
                    <div class="acc-icon"><svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><polyline points="6 9 12 15 18 9"></polyline></svg></div>
                </div>
                <div class="acc-content">
                    <div class="acc-grid">
                        ${gpLAB.join("\n                        ")}
                    </div>
                </div>
            </div>

        </div>
`;

// 3. 截断替换：找到 <main class="tool-grid"> 的开头，和 <!-- 页脚 --> 之前。
const startTag = '<main class="tool-grid">';
const endTag = '<!-- 页脚 -->';
const startIndex = content.indexOf(startTag);
const endIndex = content.indexOf(endTag);

if(startIndex !== -1 && endIndex !== -1) {
    const beforeBlock = content.substring(0, startIndex);
    const afterBlock = content.substring(endIndex);
    content = beforeBlock + accordionHTML + "\n\n        " + afterBlock;
}

// 追加 JS Accordion Controller
const scriptBlock = `
                function toggleAcc(id, activeClass) {
                    const group = document.getElementById(id);
                    const content = group.querySelector('.acc-content');
                    if(group.classList.contains('active')) {
                        content.style.maxHeight = '0px';
                        group.classList.remove('active');
                        group.classList.remove(activeClass);
                    } else {
                        group.classList.add('active');
                        group.classList.add(activeClass);
                        content.style.maxHeight = content.scrollHeight + 'px';
                    }
                }

                // 初始赋予所有已打开的 Accordion 计算高度
                setTimeout(() => {
                    document.querySelectorAll('.acc-group.active .acc-content').forEach(el => {
                        el.style.maxHeight = el.scrollHeight + 'px';
                    });
                }, 100);
`;

if(!content.includes("toggleAcc(id, activeClass)")) {
    content = content.replace("window.addEventListener('DOMContentLoaded', () => {", scriptBlock + "\n                window.addEventListener('DOMContentLoaded', () => {");
}

fs.writeFileSync(indexPath, content, 'utf-8');
console.log("Refactored into accordion!");
