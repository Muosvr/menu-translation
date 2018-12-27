const vision = require("@google-cloud/vision");

// Google vision image annotator API call
// @param url {string} - image url
// @param type {string} - Features to use. e.g. "DOCUMENT_TEXT_DETECTION", "LABEL_DETECTION"
// @returns {object} - json response object
const annotateImage = async (image, type) => {
  // Set request options
  const request = {
    image: {
      content: image
    },
    features: [{ type: type }]
  };

  // Creates a client
  const client = new vision.ImageAnnotatorClient({
    keyFilename: "../MenuTranslation-ed6bba598a92.json"
  });

  // Annotate image
  const result = await client.annotateImage(request);
  return result;
};

module.exports = annotateImage;
