var obj;
var wordArr=[];
var translatedText = "";

function sendRequest(){
  
  console.log("Request has been sent.");
  $("h3").css({color:"red"});
  
  
  var data = 
  {
    "requests": [
      {
        "image": {
          "source": {
            "gcsImageUri": "gs://laughabc/menu1.jpg"
          }
        },
        "features": [
          {
            "type": "DOCUMENT_TEXT_DETECTION"
          }
        ]
      }
    ]
  }
  
  $.ajax({
      type: "POST",
      url: "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyD7ZO5TgmBvGBwjdhDnP2Ms7O5hbiwcEZg",
      data: JSON.stringify(data),
      contentType:"application/json",
      success:function(response){
          console.log(response);
          obj = response;
          boundTextByWord(response);
          }
  })
  
  //click event handler
  $(".container").click(function(e){
    
    var selectedWord = wordArr[e.target.id].description;
    translate(selectedWord);
    $("input").val(selectedWord);
    
  });
    
}

function searchImage(keyword){
  $.ajax({
    type:"GET",
    url:"https://www.googleapis.com/customsearch/v1?key=AIzaSyD0ijHhvi6X1ypRLdlkgVTodi-Ff8mIknc&cx=016534509464678393715:5ihrfh22yvg&q="+keyword,
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
      url:"https://translation.googleapis.com/language/translate/v2?key=AIzaSyD7ZO5TgmBvGBwjdhDnP2Ms7O5hbiwcEZg",
      data:JSON.stringify(translate),
      contentType:"application/json",
      success:function(response){
        translatedText = response.data.translations[0].translatedText;
        console.log(translatedText);
        $("h3").text(translatedText);
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