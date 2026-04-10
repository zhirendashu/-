const fs = require('fs');
const path = require('path');

const cssOverride = `
    <!-- ==============================================================
         SPOTIFY GLASS UI - GLOBAL OVERRIDE (Injected by Script)
         ============================================================== -->
    <style id="spotify-glass-global">
        :root {
            --bg-dark: #121212 !important;
            --surface-glass: rgba(18, 18, 18, 0.72) !important;
            --border-glass: rgba(255, 255, 255, 0.08) !important;
            --accent-primary: #1ed760 !important;
            --accent-secondary: #1db954 !important;
            --text-main: #ffffff !important;
            --text-dim: #b3b3b3 !important;
            --radius: 8px !important;
            --radius-pill: 500px !important;
        }

        body, html { background-color: var(--bg-dark) !important; }

        /* 导航与面板 */
        header { 
            background: rgba(10, 10, 10, 0.85) !important; 
            backdrop-filter: blur(24px) !important; 
            border-bottom: 1px solid var(--border-glass) !important;
        }
        
        .sidebar, .nav-col, .side-nav {
            background: rgba(18, 18, 18, 0.65) !important;
            backdrop-filter: blur(32px) !important;
            border: none !important;
            border-left: 1px solid rgba(255,255,255,0.04) !important;
            border-right: 1px solid rgba(255,255,255,0.04) !important;
        }
        
        .panel-card, .tool-card, .card {
            background: rgba(30, 30, 30, 0.5) !important;
            backdrop-filter: blur(24px) !important;
            border: 1px solid var(--border-glass) !important;
            border-radius: var(--radius) !important;
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.03), 0 8px 24px rgba(0,0,0,0.4) !important;
        }
        
        .panel-title { color: var(--text-main) !important; font-weight: 700 !important; letter-spacing: 0.5px !important; }

        /* 核心与次级按钮 */
        .btn, .primary-btn {
            background: var(--accent-primary) !important;
            color: #000000 !important;
            border-radius: var(--radius-pill) !important;
            font-weight: 800 !important;
            text-transform: uppercase !important;
            letter-spacing: 1.5px !important;
            box-shadow: rgba(0, 0, 0, 0.4) 0px 8px 24px !important;
            padding: 12px 28px !important;
            border: none !important;
            background-image: none !important; /* 清除流光渐变 */
            transition: all 0.2s !important;
        }
        .btn:hover, .primary-btn:hover { background: #1fdf64 !important; transform: scale(1.03) !important; }
        .btn:active, .primary-btn:active { transform: scale(0.97) !important; }
        
        .btn-ghost, .btn-outline, .header-back, .secondary-btn {
            background: transparent !important;
            color: var(--text-main) !important;
            border: 1px solid #7c7c7c !important;
            border-radius: var(--radius-pill) !important;
            box-shadow: none !important;
            text-transform: uppercase !important; 
            letter-spacing: 1px !important;
        }
        .btn-ghost:hover, .btn-outline:hover, .header-back:hover { border-color: #ffffff !important; }

        .style-btn, .radio-btn, .mode-tab, .filter-tab, .preset-btn {
            border-radius: var(--radius-pill) !important;
            background: rgba(255,255,255,0.06) !important;
            border: 1px solid transparent !important;
            text-transform: uppercase !important;
            letter-spacing: 0.5px !important;
            color: #b3b3b3 !important;
            transition: all 0.2s !important;
        }
        .style-btn.active, .radio-btn.active, .mode-tab.active, .filter-tab.active, .preset-btn.active, .style-btn:hover {
            background: #282828 !important;
            color: #ffffff !important;
            border-color: #4d4d4d !important;
            box-shadow: rgba(0,0,0,0.3) 0 4px 10px !important;
        }

        /* 进度条、输入与滑块 */
        input[type="range"] { accent-color: var(--accent-primary) !important; }
        
        input[type="text"], input[type="number"], select {
            background: rgba(255,255,255,0.06) !important;
            border: 1px solid rgba(255,255,255,0.1) !important;
            color: #ffffff !important;
            border-radius: var(--radius-pill) !important;
            padding: 8px 16px !important;
            box-shadow: rgb(18,18,18) 0px 1px 0px, rgb(124,124,124) 0px 0px 0px 1px inset !important;
        }
        input[type="text"]:focus, input[type="number"]:focus, select:focus {
            border-color: #b3b3b3 !important;
            outline: none !important;
        }

        /* 提示与拖拽上传区 */
        #drop-zone, .upload-slot {
            background: rgba(255,255,255,0.02) !important;
            border: 1px dashed #4d4d4d !important;
            border-radius: var(--radius) !important;
        }
        #drop-zone:hover, .upload-slot:hover {
            border-color: #7c7c7c !important;
            background: rgba(255,255,255,0.05) !important;
        }
        #inner-drop-zone {
            border-radius: var(--radius) !important;
            border: 1px dashed #4d4d4d !important;
            background: rgba(18,18,18,0.7) !important;
            backdrop-filter: blur(12px) !important;
        }
        #main-preview-box:hover #inner-drop-zone, .preview-area:hover #inner-drop-zone {
            border-color: #7c7c7c !important;
            background: rgba(30,30,30,0.85) !important;
        }

        /* 光斑调整 (保留但不刺眼) */
        .blob-1 { background: radial-gradient(circle, #1ed760, transparent 70%) !important; opacity: 0.1 !important; }
        .blob-2 { background: radial-gradient(circle, #0ea5e9, transparent 70%) !important; opacity: 0.06 !important; }
        .blob-3 { background: radial-gradient(circle, #ffffff, transparent 70%) !important; opacity: 0.05 !important; }
        
        /* 其他关键点缀 */
        .progress-fill { background: var(--accent-primary) !important; }
        .spinner { border-top-color: var(--accent-primary) !important; }
        .header-badge { 
            background: rgba(30,215,96,0.15) !important; 
            border: 1px solid rgba(30,215,96,0.3) !important; 
            color: #1ed760 !important; 
            border-radius: var(--radius-pill) !important;
        }
        
        /* Custom UI */
        .dz-icon { font-size: 2.8rem !important; line-height: 1 !important; }
        .dz-title { font-size: 1.05rem !important; font-weight: 700 !important; color: #fff !important; }
        .dz-sub { font-size: .84rem !important; color: var(--text-dim) !important; }
        .dz-chip {
            font-size: .72rem !important; color: #94a3b8 !important;
            padding: 5px 14px !important; border-radius: 100px !important;
            border: 1px solid rgba(255,255,255,0.08) !important; background: rgba(255, 255, 255, .03) !important;
        }
    </style>
`;

const fileList = [
    "封面比例转换工具.html",
    "封面精修大师.html",
    "截图套壳美化大师.html",
    "前后对比展示工具.html",
    "时髦加湿器.html",
    "图片切分神器.html",
    "小红书拼图工具.html",
    "index.html"
];

const baseDir = "d:\\Ai\\封面比例转换工具";
const outDir = path.join(baseDir, "UI优化版本");

if (!fs.existsSync(outDir)){
    fs.mkdirSync(outDir, { recursive: true });
}

fileList.forEach(fname => {
    const inPath = path.join(baseDir, fname);
    const outPath = path.join(outDir, fname);
    if (!fs.existsSync(inPath)) {
        console.log("File not found:", inPath);
        return;
    }
    
    let content = fs.readFileSync(inPath, 'utf-8');
    
    if (content.includes("</head>")) {
        content = content.replace("</head>", cssOverride + "\n</head>");
    } else {
        content += cssOverride;
    }
    
    fs.writeFileSync(outPath, content, 'utf-8');
    console.log("Processed:", fname);
});
