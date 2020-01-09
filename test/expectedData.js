const authService = require("../src/endpoints/auth-service");
const helpers = require("../src/endpoints/bookmark-service");
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
  },
  registeredUser(userObject) {
    return helpers.hashPassword(userObject.password).then(hashedPassword => {
      const jwtToken = authService.createJwt(userObject.user_name, {
        user_id: 1
      });
      return {
        id: 1,
        username: "Demo2",
        password: hashedPassword,
        authToken: jwtToken
      };
    });
  }
};

module.exports = expectedData;
