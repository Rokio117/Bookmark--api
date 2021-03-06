require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const testHelpers = {
  comparePasswords(encryptedPassword, userPassword) {
    return bcrypt.compare(encryptedPassword, userPassword);
  },
  seedUsers(db, users) {
    return db.into("bookmark_users").insert(users);
  },
  seedBooks(db, books) {
    return db.into("bookmark_books").insert(books);
  },
  seeduserBookInfo(db, userBookInfos) {
    return db.into("bookmark_user_book_info").insert(userBookInfos);
  },
  seedAuthors(db, authors) {
    return db.into("bookmark_authors").insert(authors);
  },
  seedNotes(db, notes) {
    return db.into("bookmark_notes").insert(notes);
  },
  seedAllTables(db, testDataObject) {
    return this.seedUsers(db, testDataObject.users).then(() => {
      return this.seedBooks(db, testDataObject.books).then(() => {
        return this.seeduserBookInfo(db, testDataObject.userBookInfos).then(
          () => {
            return this.seedAuthors(db, testDataObject.authors).then(() => {
              return this.seedNotes(db, testDataObject.notes);
            });
          }
        );
      });
    });
  },
  cleanTables(db) {
    return db.raw(
      `TRUNCATE
          bookmark_users,
          bookmark_books,
          bookmark_user_book_info,
          bookmark_authors,
          bookmark_notes
          RESTART IDENTITY CASCADE
      `
    );
  },
  makeAuthHeader(user, secret = process.env.JWT_SECTET) {
    const token = jwt.sign({ userid: user.id }, secret, {
      subject: user.username,
      algorithm: "HS256"
    });
    return `Bearer=${token}`;
  },
  authHeader() {
    const user = {
      username: "Demo",
      password: "$2a$12$XFXXLoeBCpkD6nkZtdoSEeI.6BEpEk4cC/djrnYB/Da8HjkC/tmzi",
      id: 1
    };
    return this.makeAuthHeader(user, process.env.JWT_SECRET);
  },
  splitTokens(token) {
    const splitToken = token.split(".");
    splitToken.pop();
    const returnToken = splitToken.join(".");
    return returnToken;
  }
};

module.exports = testHelpers;
