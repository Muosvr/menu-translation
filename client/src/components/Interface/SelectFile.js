import React, { Component } from "react";
import { Button, Icon, Segment, Image } from "semantic-ui-react";
import sampleImage from "./sample.png";

export default class SelectFile extends Component {
  constructor() {
    super();
    this.state = {
      file: null,
      imagePreviewUrl: null
    };
  }

  srcToFile = (src, fileName, mimeType) => {
    return fetch(src)
      .then(function(res) {
        return res.arrayBuffer();
      })
      .then(function(buf) {
        return new File([buf], fileName, { type: mimeType });
      });
  };

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

  srcToFile = (src, fileName, mimeType) => {
    return fetch(src)
      .then(function(res) {
        return res.arrayBuffer();
      })
      .then(function(buf) {
        return new File([buf], fileName, { type: mimeType });
      });
  };

  useSample = () => {
    this.setState({
      imagePreviewUrl: sampleImage
    });
    this.srcToFile(sampleImage, "sample.png", "image/png").then(file => {
      this.props.setFile(file);

      // console.log("file", file);
    });
  };

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
          <Button onClick={this.useSample}>Use sample menu</Button>
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
