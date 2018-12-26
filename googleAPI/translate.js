const { Translate } = require("@google-cloud/translate");

// Create autherized client
const client = new Translate({
  keyFilename: "../MenuTranslation-ed6bba598a92.json"
});

// translate text into target language
// @param text {string}
// @param lanaguage {string} - target language e.g. "en", "es", "zh-CN"
const translate = async (text, language) => {
  const response = await client.translate(text, language).catch(err => {
    console.log(err);
  });

  return response;
};

module.exports = translate;
