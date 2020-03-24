import * as monaco from 'monaco-editor';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import request from './utils/request';

import Worker from './compile.worker';


import './index.less';

const worker = new Worker();

let jsCode = '';

const pHash = localStorage.getItem('p-hash') || `mark42${Math.floor(Math.random() * 1000000000)}`;
localStorage.setItem('p-hash', pHash);

window.MonacoEnvironment = {
    getWorkerUrl(moduleId, label) {
        if (label === 'json') {
            return './json.worker.js';
        }
        if (label === 'css') {
            return './css.worker.js';
        }
        if (label === 'html') {
            return './html.worker.js';
        }
        if (label === 'typescript' || label === 'javascript') {
            return './ts.worker.js';
        }
        return './editor.worker.js';
    },
};

class Index extends Component {
    state = {
        focus: 1,
        error: null,
    }

    cssDom = React.createRef()

    jsDom = React.createRef()

    htmlDom = React.createRef()

    iframe = React.createRef()

    jsEditor = null

    cssEditor = null

    htmlEditor = null

    rId = null;

    componentDidMount() {
        request({
            url: `/fetch-template`,
            data: {
                template: 'react' || 'default',
            },
        }).then(res => {
            jsCode = res.js;
            worker.postMessage(jsCode);
            this.jsEditor = monaco.editor.create(this.jsDom.current, {
                value: res.js,
                minimap: {
                    enabled: false,
                },
                language: 'javascript',
            });

            this.cssEditor = monaco.editor.create(this.cssDom.current, {
                value: res.css,
                language: 'css',
                minimap: {
                    enabled: false,
                },
            });

            this.htmlEditor = monaco.editor.create(this.htmlDom.current, {
                value: res.html,
                minimap: {
                    enabled: false,
                },
                language: 'html',
            });

            this.cssEditor.onDidChangeModelContent(this.limitFefresh);
            this.jsEditor.onDidChangeModelContent(() => {
                const code = this.jsEditor.getValue();
                worker.postMessage(code);
            });
            worker.onmessage = (event) => {
                console.log(event.data);
                jsCode = event.data;
                this.limitFefresh();
            };

            this.htmlEditor.onDidChangeModelContent(this.limitFefresh);
            this.limitFefresh();
        });
    }

    onClick = (t) => {
        return () => {
            const { focus } = this.state;
            if (focus !== t) {
                this.setState({
                    focus: t,
                });
            }
        };
    }

    limitFefresh = () => {
        if (this.rId) {
            clearTimeout(this.rId);
            this.rId = setTimeout(this.codeRefresh, 1000);
        } else {
            this.rId = setTimeout(this.codeRefresh, 1000);
        }
    }

    codeRefresh = () => {
        if (this.jsEditor && this.cssEditor && this.htmlEditor) {
            request({
                url: '/compile2',
                data: {
                    css: this.cssEditor.getValue(),
                    js: jsCode,
                    html: this.htmlEditor.getValue(),
                    hash: pHash,
                },
            }).then(res => {
                if (res.hash) {
                    this.iframe.current.src = `//${window.location.hostname}:1001/${res.hash}/index.html`;
                    if (this.rId) {
                        clearTimeout(this.rId);
                        this.rId = null;
                    }
                }
            });
        }
    }

    openNewPage = () => {
        if (this.jsEditor && this.cssEditor && this.htmlEditor) {
            request({
                url: '/compile2',
                data: {
                    css: this.cssEditor.getValue(),
                    js: jsCode,
                    html: this.htmlEditor.getValue(),
                    hash: pHash,
                },
            }).then(res => {
                console.log(res);
                if (res.hash) {
                    window.open(`//${window.location.hostname}:1001/${res.hash}/index.html`, '_blank');
                }
            });
        }
    }

    render() {
        const {
            focus,
            error,
        } = this.state;

        return (
          <React.Fragment>
            <div className="menu">
              <button type="button" onClick={this.onClick(0)}>css</button>
              <button type="button" onClick={this.onClick(1)}>js</button>
              <button type="button" onClick={this.onClick(2)}>html</button>
              <button type="button" onClick={this.codeRefresh}>立即生成</button>
              <button type="button" onClick={this.openNewPage}>预览</button>
            </div>
            <div className="main">
              <div className="editors">
                <div ref={this.cssDom} className={`css ${focus === 0 ? "focus" : ""}`} />
                <div ref={this.jsDom} className={`js ${focus === 1 ? "focus" : ""}`} />
                <div ref={this.htmlDom} className={`html ${focus === 2 ? "focus" : ""}`} />
              </div>
              <iframe ref={this.iframe} frameBorder="0" title="stage" src="" />
              <div className="error-panel">{error}</div>
            </div>
          </React.Fragment>
        );
    }
}

ReactDOM.render(<Index />, document.getElementById('app'));
