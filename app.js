var obj;
var wordArr = [];
var translatedText = "";
var reader = new FileReader();
var data;
var dataurl;
var imgResize;
var language;

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
      logText(response);
    }
  });

  // ============Test only==================
  function logText(response) {
    if (response["responses"][0]["fullTextAnnotation"]) {
      var blocks =
        response["responses"][0]["fullTextAnnotation"]["pages"][0]["blocks"];
      var blockCount = blocks.length;
      var fullText = [];
      console.log("Number of blocks:", blockCount);
      for (var i = 0; i < blockCount; i++) {
        var paragraphs = blocks[i]["paragraphs"];
        var paragraphCount = paragraphs.length;
        var block = "";
        for (var j = 0; j < paragraphCount; j++) {
          words = paragraphs[j]["words"];
          wordCount = words.length;
          for (var k = 0; k < wordCount; k++) {
            symbols = words[k]["symbols"];
            symbolCount = symbols.length;
            var letters = [];
            var word = "";
            var lineBreak = undefined;
            for (var f = 0; f < symbolCount; f++) {
              if (symbols[f]["property"]) {
                if (symbols[f]["property"]["detectedBreak"]) {
                  if (
                    symbols[f]["property"]["detectedBreak"]["type"] ==
                      "LINE_BREAK" ||
                    symbols[f]["property"]["detectedBreak"]["type"] ==
                      "EOL_SURE_SPACE"
                  ) {
                    lineBreak = " ||";
                  }
                }
              }
              var letter = symbols[f]["text"];
              letters.push(letter);
            }
            word = letters.join("");
            block = block + word + " ";
            if (lineBreak) {
              block += lineBreak;
            }
          }
        }
        fullText.push(block);
      }
      // console.log(fullText);
    }
  }

  //word selection click event handler
  $(".container").click(function(e) {
    var selectedWord = wordArr[e.target.id].description;
    translate(selectedWord, language);
    $("input.gsc-input").val(selectedWord);
    $("button.gsc-search-button").click();
  });
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

                // Test only
                // source: {
                //   imageUri:
                //     "https://hips.hearstapps.com/del.h-cdn.co/assets/18/09/1519654520-delish-glazed-carrots-1.jpg"
                // }
              },
              features: [
                {
                  type: "DOCUMENT_TEXT_DETECTION"
                },
                {
                  type: "LABEL_DETECTION"
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
function translate(text, language) {
  var translate = {
    q: "",
    target: language
  };

  translate.q = text;

  $.ajax({
    type: "POST",
    url: "https://translation.googleapis.com/language/translate/v2?key=" + key,
    data: JSON.stringify(translate),
    contentType: "application/json",
    success: function(response) {
      translatedText = response.data.translations[0].translatedText;
      console.log(translatedText);
      $("h3.translation").text(translatedText);
      $("button.gsc-search-button").click();
    }
  });
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
  } else {
    imageURLs.push(undefined);
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
  // console.log(collection);
  return collection;
}

// check if it is food
function isFood(collection) {
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
  if (foodVote / collection.length > tolerance) {
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
    checkTerms(removeSpecialChar(arr[i]), i);
  }
}

function removeSpecialChar(str) {
  var re = /[^A-Za-z' \-\&]/g;
  return str.replace(re, "").trim();
}

// Handle check food
async function checkTerms(keyphrase, index) {
  numOfImages = 5;
  searchImage(keyphrase, numOfImages)
    .then(urls => {
      // console.log("urls:", urls);
      if (urls[0]) {
        return getImageLabels(urls);
      } else {
        return false;
      }
    })
    .then(collection => {
      if (collection) {
        // console.log("collection:", collection);
        return isFood(collection);
      } else {
        return false;
      }
    })
    .then(result => {
      console.log("index:", index, "result:", result);
    });
}

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
