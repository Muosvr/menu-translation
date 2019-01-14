import React, { Component } from "react";
import { Button, Icon, Segment, Image } from "semantic-ui-react";

export default class SelectFile extends Component {
  constructor() {
    super();
    this.state = {
      file: null,
      imagePreviewUrl: null
    };
  }

  selectFile = e => {
    this.setState({
      file: e.target.files[0]
    });
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
          <input
            hidden
            id="upload"
            type="file"
            onChange={e => this.selectFile(e)}
          />
        </div>
        <Segment hidden={!this.state.file}>
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
