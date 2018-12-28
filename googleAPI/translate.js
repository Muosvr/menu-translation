// const { Translate } = require("@google-cloud/translate");
const { googleAPIKey } = require("../config/keys");
const request = require("request-promise");

// Create autherized client
// const client = new Translate({
//   keyFilename: "../MenuTranslation-ed6bba598a92.json"
// });

// translate text into target language
// @param text {string}
// @param lanaguage {string} - target language e.g. "en", "es", "zh-CN"
const translate = async (text, language, referer) => {
  // const response = await client.translate(text, language).catch(err => {
  //   console.log(err);
  // });

  const data = {
    q: text,
    target: language
  };

  const options = {
    method: "POST",
    uri:
      "https://translation.googleapis.com/language/translate/v2?key=" +
      googleAPIKey,
    headers: {
      Referer: referer
    },
    body: data,
    json: true
  };

  const response = await request(options).catch(err => console.log(err));

  return response.data.translations[0].translatedText;
};

module.exports = translate;
