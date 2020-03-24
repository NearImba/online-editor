const fs = require('fs');
const path = require('path');
function fetchTemplate(template) {
    return Promise.all([
        fRead(`./${template}-template/index.html`),
        fRead(`./${template}-template/index.js`),
        fRead(`./${template}-template/style.css`),
    ]).then(res => {
        return {
            html: res[0],
            js: res[1],
            css: res[2],
        };
    });
}

function fRead(str) {
    return new Promise((resolve, reject) => {
        fs.readFile(path.resolve(__dirname, str), { encoding: 'utf-8' }, (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    });
}
module.exports = fetchTemplate;
