const fs = require('fs');
const babelCore = require("@babel/core");
const path = require('path');

async function compile(css, js, html, hash) {
    const projectHash = path.resolve(__dirname, `../contents/${hash}`);
    if (!fs.existsSync(projectHash)) {
        fs.mkdirSync(projectHash);
    }
    await Promise.all([
        compileJs(js, projectHash),
        compileCss(css, projectHash),
        compileHtml(html, projectHash),
    ]);
}

async function compile2(css, js, html, hash) {
    const projectHash = path.resolve(__dirname, `../contents/${hash}`);
    if (!fs.existsSync(projectHash)) {
        fs.mkdirSync(projectHash);
    }
    await Promise.all([
        writeJs(js, projectHash),
        compileCss(css, projectHash),
        compileHtml(html, projectHash),
    ]);
}

function compileJs(source, hash) {
    return new Promise((resolve, reject) => {
        babelCore.transform(source, {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['@babel/plugin-transform-runtime', '@babel/plugin-proposal-class-properties', '@babel/plugin-syntax-dynamic-import'],
        }, (err, result) => {
            if (err) {
                reject(err);
            }
            if (result && result.code) {
                fs.writeFile(`${hash}/index.js`, result.code, err => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve('done');
                    }
                });
            } else {
                reject(err);
            }
        });
    });
}

function writeJs(js, hash) {
    return new Promise((resolve, reject) => {
        fs.writeFile(`${hash}/index.js`, js, err => {
            if (err) {
                reject(err);
            } else {
                resolve('done');
            }
        });
    });
}

function compileCss(css, hash) {
    return new Promise((resolve, reject) => {
        fs.writeFile(`${hash}/style.css`, css, err => {
            if (err) {
                reject(err);
            } else {
                resolve('done');
            }
        });
    });
}

function compileHtml(html, hash) {
    return new Promise((resolve, reject) => {
        fs.writeFile(`${hash}/index.html`, html, err => {
            if (err) {
                reject(err);
            } else {
                resolve('done');
            }
        });
    });
}


exports.compile = compile;
exports.compile2 = compile2;
