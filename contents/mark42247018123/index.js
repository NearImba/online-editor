function start() {
  console.log('hello work3');
}

async function r() {
  await new Promise(function (resolve, reject) {
    setTimeout(function () {
      document.querySelector('h1').innerHTML = 'ffef';
    }, 0);
  });
}

r();
start();