/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
importScripts('https://unpkg.com/@babel/standalone/babel.min.js');

const babel = self.Babel;

function compile(source) {
    const result = babel.transform(source, {
        presets: [['env', {
            modules: 'umd',
        }], 'react'],
        // plugins: ['transform-runtime', 'proposal-class-properties', ['transform-modules-umd', {
        //     react: "React",
        //     "react-dom": "ReactDOM",
        // }]],
    });
    if (result.code) {
        return result.code;
    } else {
        console.log(result);
        return '';
    }
}

onmessage = function (e) {
    console.log('Message received from main script');
    const workerResult = compile(e.data);
    console.log('Posting message back to main script');
    postMessage(workerResult);
};
