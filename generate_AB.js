const fs = require('fs');
const path = require('path');

const baseDir = "d:\\Ai\\封面比例转换工具";
const indexOld = path.join(baseDir, "index.html");

if(!fs.existsSync(indexOld)) {
    console.error("No index.html found!");
    process.exit(1);
}

let content = fs.readFileSync(indexOld, 'utf-8');

// ==== 环节 一：对目前的方案 A（手风琴版）进行“标题居中”微调 ====
let aContent = content;
// 检测目前使用的 flex 构架并打下修改布丁
aContent = aContent.replace(
    ".acc-header { display: flex; align-items: center; justify-content: space-between;", 
    ".acc-header { display: flex; align-items: center; justify-content: center; position: relative;"
);
// 因为图标不能被居中排版顶掉位置，给右方图标打上固定锚点
aContent = aContent.replace(
    ".acc-icon { transition: transform 0.45s", 
    ".acc-icon { position: absolute; right: var(--sp-4); transition: transform 0.45s"
);

// 将完成所有要求的 A 方案拷贝封装保存
fs.writeFileSync(path.join(baseDir, "index_A.html"), aContent, 'utf-8');


// ==== 环节 二：提取所有独立的卡片元件，装配方案 B (星舰控制台版本) ====
const cardRegex = /<a href="[^"]*".*?class="glass-card[^>]*>[\s\S]*?<\/a>/g;
const cards = [];
let match;
while ((match = cardRegex.exec(content)) !== null) {
    cards.push(match[0]);
}

const gpSYS = [];
const gpAI = [];
const gpLAB = [];

// 将它们解压出原有动画包袱，并投递到对应的科属大类里
cards.forEach(c => {
    let html = c.replace(/opacity: 0;\s*transform:\s*translateY\(20px\);?/, '') // 洗净多余冗余动画
                .replace(/opacity:\s*0\s*!important;/, '');
    
    if(html.includes("AI摄影创作工作台") || html.includes("Gemini水印修复")) {
        gpAI.push(html);
    } else if (html.includes("字体") || html.includes("顶级字幕") || html.includes("Gruvbox") || html.includes("Catppuccin") || html.includes("Nippon")) {
        gpLAB.push(html);
    } else {
        gpSYS.push(html);
    }
});

// 构建全新的 CSS 与 HTML 骨架
let bContent = content;

const bCss = `
        /* ===== 星舰控制台（Side-Tab Dashboard）系统 ===== */
        .dashboard-container {
            width: 100%; max-width: 1300px; 
            display: flex; gap: var(--sp-4);
            margin-top: var(--sp-2);
            min-height: 60vh;
            z-index: 10;
        }

        /* 左侧中控导航 */
        .side-nav {
            width: 260px; flex-shrink: 0;
            display: flex; flex-direction: column; gap: var(--sp-2);
            background: rgba(18, 20, 26, 0.65);
            backdrop-filter: blur(24px);
            border: 1px solid rgba(255,255,255,0.06);
            border-radius: var(--radius-xl);
            padding: var(--sp-3) var(--sp-2);
            box-shadow: inset -10px 0 30px rgba(0,0,0,0.5), 0 20px 40px rgba(0,0,0,0.2);
            align-self: flex-start;
            position: sticky; top: 20px; 
        }

        .tab-btn {
            background: transparent; border: none; outline: none;
            color: var(--text-dim); text-align: left;
            padding: var(--sp-2) var(--sp-3);
            border-radius: 12px; cursor: pointer;
            font-size: 0.95rem; font-weight: 700; letter-spacing: 1px;
            display: flex; flex-direction: column; gap: 8px;
            transition: var(--transition);
            position: relative;
            overflow: hidden;
            text-decoration: none;
        }
        .tab-btn span.tab-title { display: flex; align-items: center; justify-content: space-between; width: 100%; }
        
        .tab-btn.sys-btn:hover, .tab-btn.sys-btn.active { color: #fff; background: rgba(99,102,241,0.15); box-shadow: inset 4px 0 0 #6366f1; }
        .tab-btn.ai-btn:hover, .tab-btn.ai-btn.active { color: #fff; background: rgba(155,114,255,0.15); box-shadow: inset 4px 0 0 #9b72ff; }
        .tab-btn.lab-btn:hover, .tab-btn.lab-btn.active { color: #fff; background: rgba(244,63,94,0.15); box-shadow: inset 4px 0 0 #f43f5e; }

        .tab-badge {
            background: rgba(255,255,255,0.1); color: #fff;
            padding: 2px 10px; border-radius: 100px;
            font-size: 0.65rem; font-family: monospace; font-weight: 800;
        }
        .sys-btn.active .tab-badge { background: #6366f1; }
        .ai-btn.active .tab-badge { background: #9b72ff; }
        .lab-btn.active .tab-badge { background: #f43f5e; }

        /* 右侧展示核心舱 */
        .tab-content-area {
            flex: 1; min-width: 0;
            position: relative;
        }
        .tab-pane {
            display: none; animation: fadePane 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        .tab-pane.active { display: block; }

        @keyframes fadePane {
            0% { opacity: 0; transform: translateY(30px) scale(0.98); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* 重载网格：B区专供横移阵列 */
        .dash-grid {
            display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--sp-3);
        }

        /* 移动端向下缩减 */
        @media (max-width: 1024px) { 
            .dashboard-container { flex-direction: column; } 
            .side-nav { width: 100%; flex-direction: row; flex-wrap: wrap; align-items: center; justify-content: center; position: static;} 
            .tab-btn { flex: 1; min-width: 150px; justify-content: center; text-align:center;} 
            .tab-btn.sys-btn:hover, .tab-btn.sys-btn.active, .tab-btn.ai-btn:hover, .tab-btn.ai-btn.active, .tab-btn.lab-btn:hover, .tab-btn.lab-btn.active { box-shadow: inset 0 -4px 0 currentColor; }
        }
        @media (max-width: 820px) { .dash-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 520px) { .dash-grid { grid-template-columns: 1fr; } }
`;

// 把现存在文件内的原 A版 Accordion CSS 用正则清除并替换。
bContent = bContent.replace(/\/\* ===== Accordion 折叠系统 ===== \*\/[\s\S]*?\/\* ===== 动态背景 ===== \*\//, bCss + '\n        /* ===== 动态背景 ===== */');

const bHtml = `
        <div class="dashboard-container">
            
            <!-- 导航侧栏：悬浮矩阵定点 -->
            <aside class="side-nav">
                <div style="font-size:0.7rem; color:var(--text-dim); padding-left:14px; margin-bottom: 6px; letter-spacing: 2px;">SYS NAVIGATION</div>
                
                <button class="tab-btn sys-btn active" onclick="switchTab('pane-sys', this)">
                    <span class="tab-title">原生视觉与排版 <span class="tab-badge">CORE</span></span>
                    <span style="font-size: 0.72rem; color:var(--text-dim); font-weight:400; padding-top:4px;">日常切割、对齐套印及封面基础。</span>
                </button>
                
                <button class="tab-btn ai-btn" onclick="switchTab('pane-ai', this)">
                    <span class="tab-title">AI 工作矩阵 <span class="tab-badge">NEURAL</span></span>
                    <span style="font-size: 0.72rem; color:var(--text-dim); font-weight:400; padding-top:4px;">中枢引擎接入与图像物理级脱密算法。</span>
                </button>
                
                <button class="tab-btn lab-btn" onclick="switchTab('pane-lab', this)">
                    <span class="tab-title">专业色彩实验室 <span class="tab-badge">COLORS</span></span>
                    <span style="font-size: 0.72rem; color:var(--text-dim); font-weight:400; padding-top:4px;">各大电影配色极静库提取面板。</span>
                </button>
            </aside>

            <!-- 渲染画廊主舱：随波而变的呈现窗 -->
            <main class="tab-content-area">
                <div id="pane-sys" class="tab-pane active">
                    <div class="dash-grid">${gpSYS.join("\n")}</div>
                </div>
                <div id="pane-ai" class="tab-pane">
                    <div class="dash-grid">${gpAI.join("\n")}</div>
                </div>
                <div id="pane-lab" class="tab-pane">
                    <div class="dash-grid">${gpLAB.join("\n")}</div>
                </div>
            </main>
        </div>

        <script>
            function switchTab(targetId, btnEle) {
                // 控制渲染区块呈现
                document.querySelectorAll('.tab-pane').forEach(el => el.classList.remove('active'));
                document.getElementById(targetId).classList.add('active');
                
                // 控制侧边栏按键极客指示发光条
                document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
                btnEle.classList.add('active');
            }
        </script>
`;

const startIdx = bContent.indexOf('<div class="accordion-container">');
const endIdx = bContent.indexOf('<!-- 页脚 -->');
if(startIdx !== -1 && endIdx !== -1) {
    const beforeBlock = bContent.substring(0, startIdx);
    const afterBlock = bContent.substring(endIdx);
    
    // 我们也顺手抹去由于原本由于A版本遗留在之前的JS代码块（在底部的 window 事件里）
    let cleanAfterBlock = afterBlock.replace(/function toggleAcc[\s\S]*?}, 100\);\s*window.addEventListener/, "window.addEventListener");
    
    bContent = beforeBlock + bHtml + "\n\n        " + cleanAfterBlock;
}

// 写入正式的 B版本对照测试板
fs.writeFileSync(path.join(baseDir, "index_B.html"), bContent, 'utf-8');

console.log("Dual-Core Split Task Completed: index_A and index_B generated.");
