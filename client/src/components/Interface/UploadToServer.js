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
    if (byLine === undefined) {
      console.log("Error: please pick a layout");
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
          // console.log(res["data"]);
          this.props.setResponse(res["data"]);
          this.setState({
            loading: false
          });
        })
        .catch(err => {
          this.setState({ loading: false, error: err.message });
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
