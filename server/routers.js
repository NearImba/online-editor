const parse = require('co-body');

const fetchTemlpate = require('./fetchTemplate');
const { compile, compile2 } = require('./compile');

async function fRoute(ctx) {
    console.log(ctx.path);
    let body = null;
    let template = 'default';
    switch (ctx.path) {
        case '/fetch-template':
            body = await parse(ctx.req);
            template = body.template || 'default';
            ctx.body = await fetchTemlpate(template).catch(err => {
                ctx.body = JSON.stringify(err);
                ctx.status = 500;
            });
            break;
        case '/compile':
            try {
                body = await parse(ctx.req);
                const { js = '', css = '', html = '', hash } = body;
                await compile(css, js, html, hash);
                ctx.body = {
                    hash,
                };
                ctx.status = 200;
            } catch (err) {
                console.log(err);
                ctx.body = JSON.stringify(err);
                ctx.status = 500;
            }

            break;
        case '/compile2':
            try {
                body = await parse(ctx.req);
                const { js = '', css = '', html = '', hash } = body;
                await compile2(css, js, html, hash);
                ctx.body = {
                    hash,
                };
                ctx.status = 200;
            } catch (err) {
                console.log(err);
                ctx.body = JSON.stringify(err);
                ctx.status = 500;
            }

            break;
        default:
            ctx.body = 'unmatched route';
            ctx.status = 406;
            break;
    }
}

module.exports = fRoute;
