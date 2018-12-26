const request = require("request-promise");

// For testing only
const key = "AIzaSyCJzJNmUUgLfbZWx13mUDD66lIagLqUt-U";
const referer = "http://localhost:5000";

// Google Image Search from API
// @param keyphrase {string}
// @param numOfResults {int}
// @returns {string[]} - array of image urls
const searchImage = async (keyphrase, numOfResults) => {
  const options = {
    method: "GET",
    uri:
      "https://www.googleapis.com/customsearch/v1?key=" +
      key +
      "&cx=016534509464678393715:5ihrfh22yvg&q=" +
      keyphrase +
      "&searchType=image&num=" +
      numOfResults,
    headers: {
      Referer: referer
    },
    json: true
  };

  const response = await request(options).catch(err => console.log(err));
  var imageURLs = [];

  if (response.items) {
    response.items.forEach(item => {
      imageURLs.push(item.link);
    });
  }
  // console.log(response);
  return imageURLs;
};

module.exports = searchImage;
