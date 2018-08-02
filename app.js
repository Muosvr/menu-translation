var obj;
var wordArr=[];
var translatedText = "";
var reader  = new FileReader();
var data;
var dataurl;
var imgResize;
var language;


function sendRequest(lan){
  language = lan;
  console.log("Request has been sent.");
  $("input.gsc-input").val("Select a word to search for image");
  
  //"gs://laughabc/menu1.jpg"
  
  
  //OCR on photo
  $.ajax({
      type: "POST",
      url: "https://vision.googleapis.com/v1/images:annotate?key="+key,
      data: JSON.stringify(data),
      contentType:"application/json",
      success:function(response){
          console.log(response);
          obj = response;
          boundTextByWord(response);
          }
  })
  
  //word selection click event handler
  $(".container").click(function(e){
    var selectedWord = wordArr[e.target.id].description;
    translate(selectedWord,language);
    $("input.gsc-input").val(selectedWord);
    $("button.gsc-search-button").click();
  });
    
}

//function to upload image
function previewFile() {
  
  //create preview image element
  var preview = new Image();
  preview.id = 'uploadImg';
  preview.alt = 'Sorry please try again...';
  $(".container").empty();
  $(".container").append(preview);
  
  // var preview = document.querySelector('#uploadImg');
  var file    = document.querySelector('input[type=file]').files[0];
  
  //create trigger to load image
  reader.addEventListener("load", function () {
    
    //create a temp image element as buffer
    var img = new Image();
    img.src = reader.result;

    //resize image after it's fully loaded using canvas
    img.onload = function(){

      var width = 800;
      var height = img.height*width/img.width;
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext("2d");
      
      canvas.width = width;
      canvas.height = height;
      console.log("img has loaded");
      
      ctx.drawImage(img,0,0,width,height);
      dataurl = canvas.toDataURL("image/jpeg");
      
      //display image
      preview.src = dataurl;
      
      //load into data for google vision api
      data = 
      {
        "requests": [
          {
            "image": {
              "content": dataurl.slice(23)
            },
            "features": [
              {
                "type": "DOCUMENT_TEXT_DETECTION"
              }
            ]
          }
        ]
      }
    };
  }, false);

  //read file when it's been uploaded
  if (file) {
    reader.readAsDataURL(file);
  }
}

//make google translate API calls
function translate(text,language){
    var translate = {
      'q': "",
      'target': language
    } 
    
    translate.q = text;
  
    $.ajax({
      type: "POST",
      url:"https://translation.googleapis.com/language/translate/v2?key="+key,
      data:JSON.stringify(translate),
      contentType:"application/json",
      success:function(response){
        translatedText = response.data.translations[0].translatedText;
        console.log(translatedText);
        $("h3.translation").text(translatedText);
        $("button.gsc-search-button").click();
      }
      
    })
}

function boundTextByWord(obj){
  wordArr = obj.responses[0].textAnnotations;
  for(i=1;i<wordArr.length;i++){ //skipping 0
    var positionArr = wordArr[i].boundingPoly.vertices;
    
      var x1 = positionArr[0].x;
      var y1 = positionArr[0].y;
      var x3 = positionArr[2].x;
      var y3 = positionArr[2].y;
      
      drawBox(x1,y1,x3,y3,i);
  }
}


function boundTextByBlocks(obj){
  var blocksArr = obj.responses[0].fullTextAnnotation.pages[0].blocks;
  for (i=0; i<blocksArr.length; i++){
    
      var positionArr = blocksArr[i].boundingBox.vertices;
      
      var x1 = positionArr[0].x;
      var y1 = positionArr[0].y;
      var x3 = positionArr[2].x;
      var y3 = positionArr[2].y;
      
      drawBox(x1,y1,x3,y3,i);
  }
}


function drawBox(x1,y1,x3,y3,index){
  
    //create box element
    var box = "<div class='box' id="+ index +"></div>"
    $(".container").append(box);

    //resize and position box
    var width = x3-x1;
    var height = y3-y1;
    var top = y1;
    var left = x1;
    $("#"+index).css({
        "top":top,
        "left": left,
        "width": width,
        "height": height
    })
}

// function strByBlock(obj){
//   var strArr = [];
//   var blocksArr = obj.responses[0].fullTextAnnotation.pages[0].blocks;
//   for(i=0;i<blocksArr.length;i++){
//     for(j=0;j<blocksArr[i].paragraphs.length;j++){
//       for(k=0;k<blocksArr[i].paragraphs[i].words.length; k++){
//         var word = "";
//         for(l=0;l<blocksArr[i].paragraphs[i].words.symbols.length;l++){
                  
//         }
//       }
//     }
        
//   }
//   return strArr;
// }