const fs = require('fs');
const path = 'Gemini水印修复.html';
let html = fs.readFileSync(path, 'utf8');

// 1. 注入外部 JS 关联
if (!html.includes('gemini-alpha-maps.js')) {
    html = html.replace('<script id="engine-script">', '<script src="./gemini-alpha-maps.js"></script>\n    <script id="engine-script">');
}

// 2. 切除庞大冗余的 MASK_STORE 和 getMask() 函数
const startStr = 'const MASK_STORE = {';
const endStr = '// 识别逻辑';

const startIdx = html.indexOf(startStr);
const endIdx = html.indexOf(endStr);

if (startIdx !== -1 && endIdx !== -1) {
    html = html.substring(0, startIdx) + html.substring(endIdx);
    console.log("Removed MASK_STORE block.");
}

// 3. 替换调用的 API 名
html = html.replace(/getMask\(style\.size\)/g, 'getEmbeddedAlphaMap(style.size)');

// 写回
fs.writeFileSync(path, html);
console.log("Gemini水印修复.html 完美打补丁完毕！");
