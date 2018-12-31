const { googleAPIKey } = require("../config/keys");
const request = require("request-promise");

// Get a list of google translate supported languages
const getSupportedLanguages = async referer => {
  // const response = await client.translate(text, language).catch(err => {
  //   console.log(err);
  // });

  const options = {
    method: "GET",
    uri:
      "https://translation.googleapis.com/language/translate/v2/languages?key=" +
      googleAPIKey,
    headers: {
      Referer: referer
    },
    json: true
  };

  const response = await request(options).catch(err => console.log(err));

  return response;
};

module.exports = getSupportedLanguages;
