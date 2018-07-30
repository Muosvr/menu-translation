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
            }
    })
    
}


function drawBox(x1,y1,x3,y3){
    var width = x3-x1;
    var height = y3-y1;
    var top = y1;
    var left = x1;
    $(".box").css({
        "top":top,
        "left": left,
        "width": width,
        "height": height
    })
}