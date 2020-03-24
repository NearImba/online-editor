const Koa = require('koa');
const cors = require('@koa/cors');
const fRoute = require('./routers');

const app = new Koa();

app.use(cors());
app.use(async (ctx, next) => {
  // 只接受get请求
  await next();
});
// 应用规则
app.use(fRoute);

app.listen(2333);

console.log('started');
