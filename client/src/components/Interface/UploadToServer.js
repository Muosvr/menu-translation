import React, { Component } from "react";
import { Button, Message, Container } from "semantic-ui-react";
import axios from "axios";

export default class UploadToServer extends Component {
  state = {
    error: false,
    file: null
  };

  upload = (byLine, history) => {
    if (!this.props.file) {
      this.setState({
        error: "No image uploaded"
      });
    } else if (!this.props.desiredLanguage) {
      this.setState({
        error: "Please pick a desired language"
      });
    } else {
      this.props.history.push("/cards");
      this.props.setUpload(true);
      const data = new FormData();
      data.append("image", this.props.file);

      axios
        .post("/cards/image/" + this.props.desiredLanguage, data)
        .then(res => {
          this.props.setResponse(res["data"]);
          if (res["data"]["cards"].length < 1) {
            this.setState({
              error: "Cannot find any food or drink items"
            });
          }
        })
        .catch(err => {
          console.log("fetch error", err);
        });
    }
  };
  render() {
    return (
      <Container>
        <Message negative hidden={!this.state.error}>
          Error: {this.state.error}
        </Message>
        <Button
          primary
          style={{ marginTop: "20px" }}
          onClick={() => this.upload(this.props.byLine)}
        >
          Submit
        </Button>
      </Container>
    );
  }
}
