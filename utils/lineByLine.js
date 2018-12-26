// Expand text object so that every object only contain one line of text
// @param fullTextArr {object[]} - array of objects containing text
// @returns {object[]}
const lineByLine = fullTextArr => {
  var newFullTextArr = [];

  fullTextArr.forEach(textObj => {
    keys = Object.keys(textObj);
    const newTextObjs = keys.map(key => {
      return {
        0: textObj[key]
      };
    });

    newFullTextArr = newFullTextArr.concat(newTextObjs);
  });

  return newFullTextArr;
};

module.exports = lineByLine;
