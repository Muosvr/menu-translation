const vision = require("@google-cloud/vision");

// Google vision images batch annotator API call
// @param url {string[]} - image url
// @param type {string} - Features to use. e.g. "DOCUMENT_TEXT_DETECTION", "LABEL_DETECTION"
// @returns {object} - json response object
const batchAnnotateImages = async (urls, type) => {
  // Set request options
  const requests = urls.map(url => {
    return {
      image: {
        source: {
          imageUri: url
        }
      },
      features: [{ type: type }]
    };
  });

  // Creates a client
  const client = new vision.ImageAnnotatorClient({
    keyFilename: "../MenuTranslation-ed6bba598a92.json"
  });

  // Annotate image
  const result = await client.batchAnnotateImages({ requests: requests });
  console.log(result);
  return result;
};

module.exports = batchAnnotateImages;
