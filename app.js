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

