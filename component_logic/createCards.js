const lineByLine = require("../utils/lineByLine");
const searchImage = require("../googleAPI/searchImage");
const translate = require("../googleAPI/translate");
const getImageLabels = require("./getImageLabels");
const hasFoodLabels = require("./hasFoodLabels");
const cleanImageUrls = require("../utils/cleanImageUrls");
const saveImageSearch = require("./saveImageSearch");

// Create card objects
// @param collection {object[]} - array of parsed text objects in the format of [{0: text, 1: text, ...}, ...]
// @param byLine {bool} - whether to process text objects to one line per object
// @param targetLanguage {string} - e.g. "en", "zh-CN", "es" for English, Simplified Chinese, Spanish
const createCards = async (collection, byLine, targetLanguage, referer) => {
  // For testing only
  const maxImageSearchQueries = 100;
  var imageSeachQueryCount = 0;

  const parsedCollection = byLine ? lineByLine(collection) : collection;
  const newCollection = parsedCollection.map(description => {
    return {
      description: description
    };
  });

  const promises = newCollection.map(async card => {
    await populateCard(card, card["description"][0]);
    const keys = Object.keys(card["description"]);

    if (!card["isFood"] && keys.length > 1) {
      const longDescription = keys
        .map(key => {
          return card["description"][key];
        })
        .join(" ");
      await populateCard(card, longDescription);
    }

    if (card["isFood"]) {
      card["translation"] = {};
      const translationPromises = keys.map(async key => {
        card["translation"][key] = await translate(
          card["description"][key],
          targetLanguage,
          referer
        );
      });

      await Promise.all(translationPromises);
    }
  });

  // Populate fields in cards
  async function populateCard(item, description) {
    var numOfImageToSearch = 6;
    imageSeachQueryCount++;

    if (imageSeachQueryCount <= maxImageSearchQueries) {
      item["images"] = await searchImage(
        description,
        numOfImageToSearch,
        referer
      );
      saveImageSearch(description, item["images"]);
      item["images"] = cleanImageUrls(item["images"]);
      item["imageLabels"] = await getImageLabels(item["images"], referer);
      item["isFood"] = hasFoodLabels(item["imageLabels"]);
    } else {
      item["images"] = "Max image query limit reached";
      item["imageLabels"] = "Max image query limite reached";
      item["isFood"] = undefined;
    }
  }

  await Promise.all(promises);

  return newCollection;
};

module.exports = createCards;
