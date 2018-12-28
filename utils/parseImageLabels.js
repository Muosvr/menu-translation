// pare responses from google vision image label api to arrays of labels
// @param {object[]} - array of responses from google vision api
// @returns {string[[]]} - nested array of labels for each image
const parseImageLabels = response => {
  try {
    const collection = response["responses"].map(item => {
      if (item["labelAnnotations"]) {
        return item["labelAnnotations"].map(label => {
          return label.description;
        });
      } else {
        return ["cannot access image"];
      }
    });
    return collection;
  } catch (err) {
    console.log("No response received");
    return [["no images available for the search term"]];
  }
};

module.exports = parseImageLabels;
