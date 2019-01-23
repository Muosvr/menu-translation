const Search = require("../models/Search");

const searchImageFromDB = async keywords => {
  var results = [];
  const promise = Search.findOne({ keywords: keywords })
    .then(res => {
      results = res.images.map(item => {
        return item.url;
      });
    })
    .catch(err => {
      console.log(err);
    });
  await promise;

  return results;
};

module.exports = searchImageFromDB;
