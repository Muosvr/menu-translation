import { readFileSync } from "fs";

// pare responses from google vision image label api to arrays of labels
// @param {object[]} - array of responses from google vision api
// @returns {string[[]]} - nested array of labels for each image
const parseImageLabels = response => {
  var collection = [];

  if (response.responses) {
    for (var i = 0; i < response.responses.length; i++) {
      annotations = response.responses[i].labelAnnotations;
      // console.log("annotations:", annotations);
      labels = [];
      if (annotations) {
        for (j = 0; j < annotations.length; j++) {
          // console.log(annotations[j].description);
          labels.push(annotations[j].description);
        }
      }
      collection.push(labels);
    }
  } else {
    console.log("No response to parse");
  }

  return collection;
};
