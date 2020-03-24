const fs = require('fs');
const path = require('path');

function removeDir(dir) {
    if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        for (let i = 0; i < files.length; i += 1) {
            const newPath = path.join(dir, files[i]);
            const stat = fs.statSync(newPath);
            if (stat.isDirectory()) {
                //如果是文件夹就递归下去
                removeDir(newPath);
            } else {
                //删除文件
                fs.unlinkSync(newPath);
            }
        }
        fs.rmdirSync(dir);
    }
}

removeDir(path.resolve(__dirname, '../dist'));
console.info('dist 文件夹 清除完毕');
