var obj;
var wordArr=[];
var translatedText = "";
var reader  = new FileReader();
var data;
var dataurl;
var imgResize;

function sendRequest(){
  
  console.log("Request has been sent.");
  $("input.gsc-input").val("Click a word to search for image");
  
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
    translate(selectedWord);
    $("input.gsc-input").val(selectedWord);
    $("button.gsc-search-button").click();
    
  });
    
}

function resizeImage(imageId,width){
    
    var img = document.querySelector(imageId);
    var height = img.height*width/img.width;
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    // imgResize = "<img src="+reader.result+">";
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img,0,0,width,height);
    dataurl = canvas.toDataURL("image/jpeg");
    img.src = dataurl;
}

function previewFile() {
  
  var img = "<img id = 'uploadImg' src='' alt='Image preview...'>";
  $(".container").empty();
  $(".container").append(img);
  
  var preview = document.querySelector('#uploadImg');
  var file    = document.querySelector('input[type=file]').files[0];


  reader.addEventListener("load", function () {
    preview.src = reader.result;
    resizeImage("#uploadImg",800);
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
    
  }, false);

  
  
  if (file) {
    reader.readAsDataURL(file);
  }
}

function searchImage(keyword){
  $.ajax({
    type:"GET",
    url:"https://www.googleapis.com/customsearch/v1?key="+key+"&cx=016534509464678393715:5ihrfh22yvg&q="+keyword,
    success:function(response){
      console.log(response);
    }
  })
}

function translate(text){
    var translate = {
      'q': "",
      'target': 'zh-CN'
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