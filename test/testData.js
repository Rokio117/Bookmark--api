const testData = {
  newUser() {
    return {
      user_name: "Demo2",
      password: "password",
      repeat_password: "password"
    };
  },
  newBook() {
    return {
      onTab: "finished",
      currentpage: null,
      startedon: null,
      finishedon: null,
      userid: 1,

      title: "The Name of the Wind",
      coverart:
        "http://books.google.com/books/content?id=c-qcoAEACAAJ&printsec=frontcover&img=1&zoom=5&source=gbs_api",
      description:
        "I have stolen princesses back from sleeping barrow kings. I burned down the town of Trebon. I have spent the night with Felurian and left with both my sanity and my life. I was expelled from the University at a younger age than most people are allowed in. I tread paths by moonlight that others fear to speak of during day. I have talked to Gods, loved women, and written songs that make the minstrels weep. My name is Kvothe. You may have heard of me So begins the tale of Kvothe - currently known as Kote, the unassuming innkeepter - from his childhood in a troupe of traveling players, through his years spent as a near-feral orphan in a crime-riddled city, to his daringly brazen yet successful bid to enter a difficult and dangerous school of magic. In these pages you will come to know Kvothe the notorious magician, the accomplished thief, the masterful musician, the dragon-slayer, the legend-hunter, the lover, the thief and the infamous assassin. The Name of the Wind is fantasy at its very best, and an astounding must-read title.",
      googleid: "c-qcoAEACAAJ"
    };
  },
  authHeader() {
    return `Bearer =
      eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
        .eyJ1c2VyX2lkIjoxLCJpYXQiOjE1Nzg2Mjc0ODQsInN1YiI6IkRlbW8ifQ
        .SB1q4_35AGpThyAhqpDibRB8 - lggHD4DqiBx2y64XlI`;
  }
};

module.exports = testData;
