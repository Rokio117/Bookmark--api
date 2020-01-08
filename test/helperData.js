const helperData = {
  users() {
    return [
      {
        username: "Demo",
        password: "$2a$12$XFXXLoeBCpkD6nkZtdoSEeI.6BEpEk4cC/djrnYB/Da8HjkC/tmzi"
      }
    ];
  },
  books() {
    return [{ title: "", coverart: "", description: "", googleid: "" }];
  },
  userBookInfo() {
    return [
      {
        ontab: "",
        currentpage: "",
        startedon: "",
        finishedon: "",
        userid: "",
        bookid: ""
      }
    ];
  },
  authors() {
    return [{ author: "", bookid: "" }];
  },
  notes() {}
};

module.exports = helperData;
