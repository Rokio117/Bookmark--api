const expectedData = {
  testUser() {
    return {
      id: 1,
      user_name: "Demo",
      password: "$2a$12$XFXXLoeBCpkD6nkZtdoSEeI.6BEpEk4cC/djrnYB/Da8HjkC/tmzi"
    };
  },
  testUserNoId() {
    return {
      user_name: "Demo",
      password: "$2a$12$XFXXLoeBCpkD6nkZtdoSEeI.6BEpEk4cC/djrnYB/Da8HjkC/tmzi"
    };
  },
  testUserNoUnderscore() {
    return {
      id: 1,
      username: "Demo",
      password: "$2a$12$XFXXLoeBCpkD6nkZtdoSEeI.6BEpEk4cC/djrnYB/Da8HjkC/tmzi"
    };
  }
};

module.exports = expectedData;
