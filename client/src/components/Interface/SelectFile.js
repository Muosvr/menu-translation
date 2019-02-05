import React, { Component } from "react";
import { Button, Icon, Segment, Image } from "semantic-ui-react";
import sampleImage1 from "./sampleMenu/sample1.png";
import sampleImage2 from "./sampleMenu/sample2.png";
import sampleImage3 from "./sampleMenu/sample3.jpg";
import sampleImage4 from "./sampleMenu/sample4.jpg";
import sampleImage5 from "./sampleMenu/sample5.jpg";
import sampleImage6 from "./sampleMenu/sample6.jpg";
import sampleImage7 from "./sampleMenu/sample7.jpg";
import srcToFile from "./helpers/srcToFile";

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
      this.props.setImage(reader.result);
    };
    reader.readAsDataURL(file);
    this.props.setFile(e.target.files[0]);
  };

  useSample = () => {
    const sampleImages = [
      sampleImage1,
      sampleImage2,
      sampleImage3,
      sampleImage4,
      sampleImage5,
      sampleImage6,
      sampleImage7
    ];
    const index = Math.floor(Math.random() * sampleImages.length);
    this.setState({
      imagePreviewUrl: sampleImages[index]
    });
    this.props.setImage(sampleImages[index]);

    srcToFile(sampleImages[index], "sample.png", "image/png").then(file => {
      this.props.setFile(file);
    });
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
          <Button primary as="label" htmlFor="upload">
            <Icon name="photo" />
            Upload an Image
          </Button>
          <p
            style={{ color: "#2185d0", cursor: "pointer", marginTop: "10px" }}
            onClick={this.useSample}
          >
            {" "}
            No menu in front of you? Try a random sample menu.{" "}
          </p>
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
