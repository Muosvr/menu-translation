import React, { Component } from "react";
import { Button, Message, Container } from "semantic-ui-react";
import axios from "axios";

export default class UploadToServer extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      error: false
    };
  }

  upload = byLine => {
    if (!this.props.file) {
      this.setState({
        error: "Please upload an image"
      });
    } else if (!this.props.desiredLanguage) {
      this.setState({
        error: "Please pick a desired language"
      });
    } else if (byLine === undefined) {
      this.setState({
        error: "Please select a layout"
      });
    } else {
      this.setState({
        loading: true
      });
      const data = new FormData();
      data.append("image", this.props.file);
      const path = byLine ? "/cards/imageByLine" : "/cards/image";
      axios
        .post(path + "/" + this.props.desiredLanguage, data)
        .then(res => {
          // Testing
          console.log(res["data"]);

          this.props.setResponse(res["data"]);
          if (res["data"]["cards"].length < 1) {
            this.setState({
              error: "Cannot find any food or drink items"
            });
          }
          this.setState({
            loading: false
          });
        })
        .catch(err => {
          this.setState({ loading: false, error: err });
          console.log(err);
        });
    }
  };
  render() {
    return (
      <Container>
        <Button
          primary
          style={{ marginTop: "20px" }}
          onClick={() => this.upload(this.props.byLine)}
          loading={this.state.loading}
        >
          Generate Menu
        </Button>
        <Message negative hidden={!this.state.error}>
          Error: {this.state.error}
        </Message>
      </Container>
    );
  }
}
