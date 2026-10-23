const express = require('express');
const path = require('node:path');

const app = express();
const port = Number(process.env.PORT) || 3000;
const root = __dirname;

app.get('/', (_request, response) => {
  response.sendFile(path.join(root, 'index.html'));
});

app.get('/styles.css', (_request, response) => {
  response.sendFile(path.join(root, 'styles.css'));
});

app.get('/app.js', (_request, response) => {
  response.type('js').sendFile(path.join(root, 'app.js'));
});

app.use((_request, response) => {
  response.status(404).send('Not found');
});

app.listen(port, () => {
  console.log(`Aster is running at http://localhost:${port}`);
});
