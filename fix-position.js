const fs = require('fs');
const path = require('path');

const files = [
    "封面比例转换工具.html",
    "时髦加湿器.html",
    "图片切分神器.html",
    "小红书拼图工具.html",
    "前后对比展示工具.html"
];

const baseDir = "d:\\Ai\\封面比例转换工具";

files.forEach(f => {
    let fp = path.join(baseDir, f);
    if(fs.existsSync(fp)) {
        let content = fs.readFileSync(fp, 'utf-8');
        // 将缺少的绝对居中定位属性追加进 inner-drop-zone 中
        if(content.includes("#inner-drop-zone {")) {
             // 检查是否已经存在 position: absolute
             if(!content.includes("transform: translate(-50%, -50%);") && !content.includes("transform:translate(-50%,-50%);")) {
                 content = content.replace(/#inner-drop-zone\s*\{/, "#inner-drop-zone { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); ");
                 fs.writeFileSync(fp, content, 'utf-8');
                 console.log("Fixed:", f);
             } else {
                 console.log("Skipped (already fixed):", f);
             }
        }
    }
});
