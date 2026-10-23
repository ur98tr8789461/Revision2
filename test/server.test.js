const assert = require('node:assert/strict');
const { after, before, test } = require('node:test');
const http = require('node:http');
const app = require('../server');

let server;
let baseUrl;

before(async () => {
  server = http.createServer(app);
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  if (server?.listening) {
    await new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    });
  }
});

test('serves the home page', async () => {
  const response = await fetch(baseUrl);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /text\/html/);
  assert.match(await response.text(), /<title>Aster/);
});

test('serves the stylesheet and browser module', async () => {
  const stylesheet = await fetch(`${baseUrl}/styles.css`);
  assert.equal(stylesheet.status, 200);
  assert.match(stylesheet.headers.get('content-type'), /text\/css/);

  const script = await fetch(`${baseUrl}/app.js`);
  assert.equal(script.status, 200);
  assert.match(script.headers.get('content-type'), /javascript/);
});

test('reports a healthy status', async () => {
  const response = await fetch(`${baseUrl}/healthz`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ok' });
});

test('returns 404 for unknown paths', async () => {
  const response = await fetch(`${baseUrl}/unknown`);
  assert.equal(response.status, 404);
  assert.equal(await response.text(), 'Not found');
});
