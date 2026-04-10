const fs = require('fs');
const path = require('path');

const baseDir = "d:\\Ai\\封面比例转换工具";
const indexA = path.join(baseDir, "index_A.html");
const indexMain = path.join(baseDir, "index.html");
const indexB = path.join(baseDir, "index_B.html");

if(fs.existsSync(indexA)) {
    let content = fs.readFileSync(indexA, 'utf-8');

    // 1. 无情切除那三个引发语言割裂感的英文小角标
    content = content.replace(/<span class="acc-badge">CORE<\/span>\s*/g, '');
    content = content.replace(/<span class="acc-badge">NEURAL<\/span>\s*/g, '');
    content = content.replace(/<span class="acc-badge">COLORS<\/span>\s*/g, '');

    // 2. 剥离相关的死库 CSS 残留，防止打包堆积
    content = content.replace(/\.acc-title span\.acc-badge[^{]*\{[^}]*\}/g, '');
    content = content.replace(/\.acc-group\.[^\s]+\s*\.acc-badge\s*{[^}]+}/g, '');

    // 3. 强势扶正，将其直接写入唯一的入口骨架
    fs.writeFileSync(indexMain, content, 'utf-8');
    
    // 4. 清剿历史 B 版本分支及临时体
    try {
        fs.unlinkSync(indexA);
        if(fs.existsSync(indexB)) fs.unlinkSync(indexB);
    } catch(e) {}
    
    console.log("English tags stripped. A-version firmly established.");
} else {
    console.log("Error: A-version not found!");
}
