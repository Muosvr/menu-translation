import React, { Component } from "react";
import { Button, Icon, Segment, Image } from "semantic-ui-react";
import sampleImage1 from "./sampleMenu/sample1.png";
import sampleImage2 from "./sampleMenu/sample2.png";
import sampleImage3 from "./sampleMenu/sample3.jpg";
import sampleImage4 from "./sampleMenu/sample4.jpg";
import sampleImage5 from "./sampleMenu/sample5.jpg";

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
      this.props.setImage(reader.result);
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
    const sampleImages = [
      sampleImage1,
      sampleImage2,
      sampleImage3,
      sampleImage4,
      sampleImage5
    ];
    const index = Math.floor(Math.random() * sampleImages.length);
    this.setState({
      imagePreviewUrl: sampleImages[index]
    });
    this.props.setImage(sampleImages[index]);

    this.srcToFile(sampleImages[index], "sample.png", "image/png").then(
      file => {
        this.props.setFile(file);
      }
    );
  };

  render() {
    return (
      <div>
        <div
          style={{
            display: "block",
            textAlign: "center"
          }}
        >
          <h3>1. Take/upload a photo of the menu</h3>
          <Button primary as="label" htmlFor="upload">
            <Icon name="photo" />
            Upload
          </Button>
          {/* <p>No menu in front of you? Try a sample menu</p> */}
          <Button onClick={this.useSample}>Use a random sample menu</Button>
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
