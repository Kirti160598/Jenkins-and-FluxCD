const { greetUser } = require('../../app');

describe('Unit test greetUser()', () => {
  test('returns greeting message', () => {
    expect(greetUser('Kirti')).toBe('Hello, Kirti!');
    expect(greetUser('John')).toBe('Hello, John!');
  });
});

