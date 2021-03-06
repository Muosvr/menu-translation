const request = require("request-promise");
const { googleAPIKey } = require("../config/keys");

// Google vision images batch annotator API call
// @param url {string[]} - image url
// @param type {string} - Features to use. e.g. "DOCUMENT_TEXT_DETECTION", "LABEL_DETECTION"
// @param referer {string} - url where the request originate from e.g. from req.get("host")
// @returns {object} - json response object
const batchAnnotateImages = async (urls, type, referer) => {
  // Set request options
  const data = urls.map(url => {
    return {
      image: {
        source: {
          imageUri: url
        }
      },
      features: [{ type: type }]
    };
  });

  const options = {
    method: "POST",
    uri: "https://vision.googleapis.com/v1/images:annotate?key=" + googleAPIKey,
    headers: {
      Referer: referer
    },
    body: { requests: data },
    json: true
  };

  const response = await request(options).catch(err => console.log(err));
  return response;
};

module.exports = batchAnnotateImages;
