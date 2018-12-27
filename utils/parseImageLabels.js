// pare responses from google vision image label api to arrays of labels
// @param {object[]} - array of responses from google vision api
// @returns {string[[]]} - nested array of labels for each image
const parseImageLabels = response => {
  // var collection = [];
  try {
    const collection = response[0].responses.map(item => {
      return item["labelAnnotations"].map(label => {
        return label.description;
      });
    });
    return collection;
  } catch (err) {
    console.log("Failed to parse response:", err);
  }
};

module.exports = parseImageLabels;
