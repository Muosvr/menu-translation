import React, { Component } from "react";
import { Button, Message, Container } from "semantic-ui-react";
import axios from "axios";
import { Link } from "react-router-dom";

export default class UploadToServer extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      error: false,
      file: null
    };
  }
  srcToFile = async (src, fileName, mimeType) => {
    return fetch(src)
      .then(function(res) {
        return res.arrayBuffer();
      })
      .then(function(buf) {
        return new File([buf], fileName, { type: mimeType });
      });
  };

  upload = byLine => {
    if (!this.props.file) {
      this.setState({
        error: "No image uploaded"
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
      this.props.setUpload();
      this.setState({
        loading: true,
        error: false
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
        <Link to="/cards">
          <Button
            primary
            style={{ marginTop: "20px" }}
            onClick={() => this.upload(this.props.byLine)}
            loading={this.state.loading}
          >
            Generate Menu
          </Button>
        </Link>

        <Message negative hidden={!this.state.error}>
          Error: {this.state.error}
        </Message>
      </Container>
    );
  }
}
