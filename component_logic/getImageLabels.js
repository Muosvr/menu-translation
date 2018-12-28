const batchAnnotateImages = require("../googleAPI/batchAnnotateImages");
const parseImageLabels = require("../utils/parseImageLabels");

// retrive images' labels based on urls
// @param urls {string[]} array of image urls
const getImageLabels = async (urls, referer) => {
  const responses = await batchAnnotateImages(
    urls,
    "LABEL_DETECTION",
    referer
  ).catch(err => {
    console.log("getImageLabels error:", err);
  });

  const collection = parseImageLabels(responses);
  return collection;
};

module.exports = getImageLabels;
