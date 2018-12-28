import React, { Component } from "react";
import Layout from "./components/common/Layout";
import CardContainer from "./components/CardContainer";
import { testCards } from "./components/test_objs";
import axios from "axios";
import { Dimmer, Loader, Button } from "semantic-ui-react";

class App extends Component {
  constructor() {
    super();
    this.state = {
      file: null,
      loading: false,
      response: JSON.parse(testCards)
    };
  }

  selectFile = e => {
    this.setState({
      file: e.target.files[0]
    });
  };

  upload = () => {
    // var img = new Image();
    // img.src = e.target.files[0];
    this.setState({
      loading: true
    });
    const data = new FormData();
    data.append("image", this.state.file);
    axios
      .post("/cards/image", data)
      .then(res => {
        console.log(res["data"]);
        this.setState({
          response: res["data"],
          loading: false
        });
      })
      .catch(err => console.log(err));
  };

  render() {
    return (
      <div className="App">
        <Layout>
          <input
            style={{ marginTop: "20px" }}
            id="upload"
            type="file"
            onChange={e => this.selectFile(e)}
          />
          <Button style={{ marginTop: "20px" }} primary onClick={this.upload}>
            Generate Menu By Block
          </Button>
          <Button style={{ marginTop: "20px" }} onclick={this.upload_byLine}>
            Generate Menu By Line
          </Button>
          <Dimmer active={this.state.loading}>
            <Loader />
          </Dimmer>
          <CardContainer response={this.state.response} />
        </Layout>
      </div>
    );
  }
}

export default App;
