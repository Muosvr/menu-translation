// const vision = require("@google-cloud/vision");
const { googleAPIKey } = require("../config/keys");
const request = require("request-promise");

// Google vision image annotator API call
// @param url {string} - image url
// @param type {string} - Features to use. e.g. "DOCUMENT_TEXT_DETECTION", "LABEL_DETECTION"
// @param referer {string} - url where the request originates from e.g. from req.get('host')
// @returns {object} - json response object
const imageOCR = async (image, type, referer) => {
  // Set request options
  const data = {
    image: {
      content: image
    },
    features: [{ type: type }]
  };

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

module.exports = imageOCR;
