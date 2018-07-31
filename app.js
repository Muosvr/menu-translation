var obj;

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
            boundText(response);
            }
    })
    
}

function boundText(obj){
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