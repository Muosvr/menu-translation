import React, { Component } from "react";
import { Button, Icon, Segment, Image } from "semantic-ui-react";
// import sampleImage from "./sample.jpg";

// function binEncode(data) {
//   var binArray = [];
//   var datEncode = "";

//   for (var i = 0; i < data.length; i++) {
//     binArray.push(data[i].charCodeAt(0).toString(2));
//   }
//   for (var j = 0; j < binArray.length; j++) {
//     var pad = padding_left(binArray[j], "0", 8);
//     datEncode += pad + " ";
//   }
//   function padding_left(s, c, n) {
//     if (!s || !c || s.length >= n) {
//       return s;
//     }
//     var max = (n - s.length) / c.length;
//     for (var i = 0; i < max; i++) {
//       s = c + s;
//     }
//     return s;
//   }
//   return binArray;
// }

// var canvas = document.createElement("canvas");
// var ctx = canvas.getContext("2d");
// var img = new Image();
// img.onload = function() {
//   canvas.width = img.width;
//   canvas.height = img.height;
//   ctx.drawImage(img, 0, 0);
//   var data = canvas.toDataURL("image/jpeg");
//   alert(data);
// };
// img.src = sampleImage;

export default class SelectFile extends Component {
  constructor() {
    super();
    this.state = {
      file: null,
      imagePreviewUrl: null
    };
  }

  selectFile = e => {
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      this.setState({
        imagePreviewUrl: reader.result
      });
    };
    reader.readAsDataURL(file);
    this.props.setFile(e.target.files[0]);
  };

  // useSample = () => {
  //   this.setState({
  //     imagePreviewUrl: sampleImage
  //   });
  //   // const file = binEncode(dataInBase64);
  //   this.props.setFile(img);
  // };

  render() {
    return (
      <div>
        <div
          style={{
            display: "block",
            textAlign: "center",
            marginTop: "20px"
          }}
        >
          <h1>To translate a menu</h1>
          <h3>1. Take/upload a photo of the menu</h3>
          <Button primary as="label" htmlFor="upload">
            <Icon name="photo" />
            Upload
          </Button>
          {/* <p>No menu in front of you? Try a sample menu</p> */}
          {/* <Button onClick={this.useSample}>Use sample menu</Button> */}
          <input
            hidden
            id="upload"
            type="file"
            onChange={e => this.selectFile(e)}
          />
        </div>
        <Segment hidden={!this.state.imagePreviewUrl}>
          <Image
            fluid
            style={{ margin: "auto", marginTop: "20px" }}
            src={this.state.imagePreviewUrl}
            alt="menu preview"
          />
        </Segment>
      </div>
    );
  }
}
