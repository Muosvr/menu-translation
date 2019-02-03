const removeSpecialChar = require("./removeSpecialChar");

// Parse annotation from Google OCR API response
const parseOCRAnnotations = response => {
  var minPhraseChar = 2;
  var fullText = [];
  var location = [1, 1];
  var newLine = false;

  if (response["responses"][0]["fullTextAnnotation"]) {
    var blocks =
      response["responses"][0]["fullTextAnnotation"]["pages"][0]["blocks"];
    var blockCount = blocks.length;

    // Concat fullText from blocks
    for (var i = 0; i < blockCount; i++) {
      var paragraphs = blocks[i]["paragraphs"];
      var paragraphCount = paragraphs.length;

      // Concat pharagraphs
      for (var j = 0; j < paragraphCount; j++) {
        words = paragraphs[j]["words"];

        wordCount = words.length;
        var paragraph = "";
        var boundingBoxes = [];

        // Concat sentence by words
        for (var k = 0; k < wordCount; k++) {
          symbols = words[k]["symbols"];
          symbolCount = symbols.length;
          var letters = [];
          var word = "";
          var lineBreak = false;

          // Concat word by symbols
          for (var f = 0; f < symbolCount; f++) {
            var letter = symbols[f]["text"];
            letters.push(letter);
            if (symbols[f]["property"]) {
              if (symbols[f]["property"]["detectedBreak"]) {
                if (
                  symbols[f]["property"]["detectedBreak"]["type"] ==
                    "LINE_BREAK" ||
                  symbols[f]["property"]["detectedBreak"]["type"] ==
                    "EOL_SURE_SPACE"
                ) {
                  lineBreak = true;
                }
              }
            }
          }

          // Concatenate into one line of text
          word = letters.join("");
          word = removeSpecialChar(word.trim());
          if (word) {
            paragraph += word + " ";
            boundingBoxes.push(words[k]["boundingBox"]["vertices"]);
          }

          // Break down a block into lines
          if (lineBreak) {
            newLine = false;
            var pureText = removeSpecialChar(paragraph);
            if (pureText != "" && pureText != undefined) {
              if (pureText.length >= minPhraseChar) {
                const line = {};
                line["text"] = pureText;
                line["boundingBox"] = {
                  x1: boundingBoxes[0][0]["x"],
                  y1: boundingBoxes[0][0]["y"],
                  x3: boundingBoxes[boundingBoxes.length - 1][2]["x"],
                  y3: boundingBoxes[boundingBoxes.length - 1][2]["y"]
                };
                line["location"] = location.slice();
                fullText.push(line);

                location[1]++;
                paragraph = "";
                boundingBoxes = [];
                newLine = true;
              }
            }
          }
        }
      }
      // If a new Line has just been added, this acknowledges a new paragraph marked by Google API
      if (newLine) {
        location[0]++;
        location[1] = 1;
      }
      // Push complete block into final text array
      // if (Object.keys(block).length != 0) {
      //   fullText.push(block);
      // }
    }
  }
  return fullText;
};

module.exports = parseOCRAnnotations;
