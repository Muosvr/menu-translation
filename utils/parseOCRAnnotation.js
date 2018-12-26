const removeSpecialChar = require("./removeSpecialChar");

// Parse annotation from Google OCR API response
const parseOCRAnnotations = response => {
  var minPhraseChar = 2;
  var fullText = [];

  if (response[0]["fullTextAnnotation"]) {
    var blocks = response[0]["fullTextAnnotation"]["pages"][0]["blocks"];
    var blockCount = blocks.length;

    // Concat fullText from blocks
    for (var i = 0; i < blockCount; i++) {
      var paragraphs = blocks[i]["paragraphs"];
      var paragraphCount = paragraphs.length;
      var block = {};
      var paragraphIndex = 0;

      // Concat pharagraphs
      for (var j = 0; j < paragraphCount; j++) {
        words = paragraphs[j]["words"];
        wordCount = words.length;
        var paragraph = "";

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

          word = letters.join("");
          paragraph += word + " ";
          if (lineBreak) {
            var pureText = removeSpecialChar(paragraph);
            if (pureText != "" && pureText != undefined) {
              if (pureText.length >= minPhraseChar) {
                block[paragraphIndex++] = pureText;
                paragraph = "";
              }
            }
          }
        }
      }
      if (Object.keys(block).length != 0) {
        fullText.push(block);
      }
    }
  }
  return fullText;
};

module.exports = parseOCRAnnotations;
