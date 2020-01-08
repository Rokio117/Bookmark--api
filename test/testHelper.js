const bcrypt = require("bcryptjs");

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
  seeduserBookInfo(db, bookInfos) {
    return db.into("bookmark_user_book_info").insert(bookInfos);
  },
  seedAuthors(db, authors) {
    return db.into("bookmark_authors").insert(authors);
  },
  seedNotes(db, notes) {
    return db.into("bookmark_notes").insert(notes);
  },
  seedAllTables(db, users, books, bookInfos, authors, notes) {
    return this.seedUsers(db, users).then(() => {
      return this.seedBooks(db, books).then(() => {
        return this.seeduserBookInfo(db, bookInfos).then(() => {
          return this.seedAuthors(db, authors).then(() => {
            return this.seedNotes(db, notes);
          });
        });
      });
    });
  }
};

module.exports = testHelpers;
