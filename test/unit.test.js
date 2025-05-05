const { greetUser } = require('../app.js');

describe('Unit test greetUser()', () => {
  test('returns greeting message', () => {
    expect(greetUser('Kirti')).toBe('Hello, Kirti!');
    expect(greetUser('John')).toBe('Hello, John!');
  });
});

