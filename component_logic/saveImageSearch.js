const Search = require("../models/Search");

const saveImageSearch = (keywords, imageUrls, isFood) => {
  Search.findOne({ keywords: keywords })
    .then(result => {
      if (!result) {
        console.log("Search result saved");
        const payload = imageUrls.map(url => {
          return { url };
        });
        const newSearh = new Search({
          keywords: keywords,
          images: payload,
          isFood: isFood
        });
        return newSearh.save();
      }
    })
    .catch(err => {
      console.log(err);
    });
};

module.exports = saveImageSearch;
