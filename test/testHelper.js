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
  }
};

module.exports = testHelpers;
