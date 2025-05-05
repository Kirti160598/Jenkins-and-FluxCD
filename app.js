const express = require('express');
const app = express();

function greetUser(name) {
  return `Hello, ${name}!`;
}

app.get('/greet/:name', (req, res) => {
  const message = greetUser(req.params.name);
  res.send(message);
});

if (require.main === module) {
  app.listen(80, () => console.log('App listening on port 80'));
}

module.exports = { app, greetUser };

