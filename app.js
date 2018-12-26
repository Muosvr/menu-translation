var obj;
var wordArr = [];
var translatedText = "";
var reader = new FileReader();
var data;
var dataurl;
var imgResize;
var language;
var testObj = {};

function sendRequest(lan) {
  language = lan;
  console.log("Request has been sent.");
  $("input.gsc-input").val("Select a word to search for image");

  //OCR on photo
  $.ajax({
    type: "POST",
    url: "https://vision.googleapis.com/v1/images:annotate?key=" + key,
    data: JSON.stringify(data),
    contentType: "application/json",
    success: function(response) {
      console.log(response[0]);
      obj = response;
      boundTextByWord(response);

      // Test only
      parseAnnotation(response);
    }
  });

  //word selection click event handler
  $(".container").click(function(e) {
    var selectedWord = wordArr[e.target.id].description;
    translate(selectedWord, language);
    $("input.gsc-input").val(selectedWord);
    $("button.gsc-search-button").click();
  });
}

// Parse annotation from Google ORC API response
function parseAnnotation(response) {
  var minPhraseChar = 2;

  if (response["responses"][0]["fullTextAnnotation"]) {
    var blocks =
      response["responses"][0]["fullTextAnnotation"]["pages"][0]["blocks"];
    var blockCount = blocks.length;
    var fullText = [];

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
    // console.log(response);
    testObj = fullText;
  }
}

// Create card objects
async function createCard(collection, byLine, targetLanguage) {
  const parsedCollection = byLine ? lineByLine(collection) : collection;
  const newCollection = parsedCollection.map(description => {
    return {
      description: description
    };
  });

  const promises = newCollection.map(async item => {
    // console.log("item 0: ", item[0]);
    var numOfImageToSearch = 3;
    item["images"] = await searchImage(
      item["description"][0],
      numOfImageToSearch
    );
    item["imageLabels"] = await getImageLabels(item["images"]);
    item["isFood"] = hasFoodLabel(item["imageLabels"]);
    const keys = Object.keys(item["description"]);

    if (!item["isFood"]) {
      const longDescription = keys
        .map(key => {
          return item["description"][key];
        })
        .join(" ");
      console.log("Using longDescription:", longDescription);
      item["images"] = await searchImage(longDescription, numOfImageToSearch);
      item["imageLabels"] = await getImageLabels(item["images"]);
      item["isFood"] = hasFoodLabel(item["imageLabels"]);
    }
    if (item["isFood"]) {
      item["translation"] = {};
      const translationPromises = keys.map(async key => {
        item["translation"][key] = await translate(
          item["description"][key],
          targetLanguage
        );
      });
      await Promise.all(translationPromises);
    }
  });

  await Promise.all(promises);

  return newCollection;
}

// Break into one object per line
function lineByLine(fullTextArr) {
  newFullTextArr = [];
  for (var i = 0; i < fullTextArr.length; i++) {
    objKeys = Object.keys(fullTextArr[i]);
    for (var j = 0; j < objKeys.length; j++) {
      var newObj = {};
      newObj[0] = fullTextArr[i][j];
      newFullTextArr.push(newObj);
    }
  }
  return newFullTextArr;
}

//function to upload image
function previewFile() {
  //create preview image element
  var preview = new Image();
  preview.id = "uploadImg";
  preview.alt = "Sorry please try again...";
  $(".container").empty();
  $(".container").append(preview);

  // var preview = document.querySelector('#uploadImg');
  var file = document.querySelector("input[type=file]").files[0];

  //create trigger to load image
  reader.addEventListener(
    "load",
    function() {
      //create a temp image element as buffer
      var img = new Image();
      img.src = reader.result;

      //resize image after it's fully loaded using canvas
      img.onload = function() {
        var width = 800;
        var height = (img.height * width) / img.width;
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");

        canvas.width = width;
        canvas.height = height;
        console.log("img has loaded");

        ctx.drawImage(img, 0, 0, width, height);
        dataurl = canvas.toDataURL("image/jpeg");

        //display image
        preview.src = dataurl;

        //load into data for google vision api
        data = {
          requests: [
            {
              image: {
                content: dataurl.slice(23)
              },
              features: [
                {
                  type: "DOCUMENT_TEXT_DETECTION"
                }
              ]
            }
          ]
        };
      };
    },
    false
  );

  //read file when it's been uploaded
  if (file) {
    reader.readAsDataURL(file);
  }
}

//make google translate API calls
async function translate(text, language) {
  var translate = {
    q: text,
    target: language
  };

  const response = await $.ajax({
    type: "POST",
    url: "https://translation.googleapis.com/language/translate/v2?key=" + key,
    data: JSON.stringify(translate),
    contentType: "application/json"
  });

  return response.data.translations[0].translatedText;
}

// Google Image Search from API
async function searchImage(keyphrase, numOfResults) {
  const response = await $.ajax({
    type: "GET",
    url:
      "https://www.googleapis.com/customsearch/v1?key=" +
      key +
      "&cx=016534509464678393715:5ihrfh22yvg&q=" +
      keyphrase +
      "&searchType=image&num=" +
      numOfResults
  }).fail(function(request, status, error) {
    console.log(error);
  });
  var imageURLs = [];

  if (response.items) {
    for (i = 0; i < response.items.length; i++) {
      imageURLs.push(response.items[i].link);
    }
  }
  return imageURLs;
}

// get image labels
async function getImageLabels(urls) {
  var imageData = {
    requests: []
  };

  for (i = 0; i < urls.length; i++) {
    imageData.requests.push({
      image: {
        source: {
          imageUri: urls[i]
        }
      },
      features: [
        {
          type: "LABEL_DETECTION"
        }
      ]
    });
  }
  const response = await $.ajax({
    type: "POST",
    url: "https://vision.googleapis.com/v1/images:annotate?key=" + key,
    data: JSON.stringify(imageData),
    contentType: "application/json"
  });

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
  }

  // console.log(collection);
  return collection;
}

// check if it is food
function hasFoodLabel(collection) {
  tolerance = 0.6;
  var foodVote = 0;
  for (var i = 0; i < collection.length; i++) {
    hasFood = false;
    for (var j = 0; j < collection[i].length; j++) {
      var words = collection[i][j].split(" ");
      for (var k = 0; k < words.length; k++) {
        if (words[k] == "food" || words[k] == "foods") {
          hasFood = true;
          break;
        }
      }
      if (hasFood) {
        foodVote++;
        break;
      }
    }
  }
  // console.log("foodVote:", foodVote, "collection total:", collection.length);
  if (foodVote / collection.length >= tolerance) {
    // console.log("Food");
    return true;
  } else {
    // console.log("Not Food");
    return false;
  }
}

// Handle multiple food checking
function checkMultiple(arr) {
  for (var i = 0; i < arr.length; i++) {
    isFood(removeSpecialChar(arr[i]), i);
  }
}

// Handle check food
async function isFood(imageURLs, index) {
  const result = await getImageLabels(imageURLs).then(collection => {
    if (collection) {
      console.log(
        "imageURLs",
        imageURLs,
        hasFoodLabel(collection),
        "collection:",
        collection
      );
      return hasFoodLabel(collection);
    } else {
      return false;
    }
  });

  return result;
}

// bound text by word
function boundTextByWord(obj) {
  wordArr = obj.responses[0].textAnnotations;
  if (wordArr) {
    for (i = 1; i < wordArr.length; i++) {
      //skipping 0
      var positionArr = wordArr[i].boundingPoly.vertices;

      var x1 = positionArr[0].x;
      var y1 = positionArr[0].y;
      var x3 = positionArr[2].x;
      var y3 = positionArr[2].y;

      drawBox(x1, y1, x3, y3, i);
    }
  }
}

function boundTextByBlocks(obj) {
  var blocksArr = obj.responses[0].fullTextAnnotation.pages[0].blocks;
  for (i = 0; i < blocksArr.length; i++) {
    var positionArr = blocksArr[i].boundingBox.vertices;

    var x1 = positionArr[0].x;
    var y1 = positionArr[0].y;
    var x3 = positionArr[2].x;
    var y3 = positionArr[2].y;

    drawBox(x1, y1, x3, y3, i);
  }
}

function drawBox(x1, y1, x3, y3, index) {
  //create box element
  var box = "<div class='box' id=" + index + "></div>";
  $(".container").append(box);

  //resize and position box
  var width = x3 - x1;
  var height = y3 - y1;
  var top = y1;
  var left = x1;
  $("#" + index).css({
    top: top,
    left: left,
    width: width,
    height: height
  });
}
