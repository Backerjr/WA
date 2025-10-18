const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World from Polyglot Starter API!');
});

app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});
