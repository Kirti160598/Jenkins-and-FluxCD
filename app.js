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
  app.listen(8080, () => console.log('App listening on port 8080'));
}

module.exports = { app, greetUser };

