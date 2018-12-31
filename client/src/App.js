import React, { Component } from "react";
import Layout from "./components/common/Layout";
import CardContainer from "./components/CardContainer";
import { testCards } from "./components/test_objs";
import axios from "axios";
import { Dimmer, Loader, Button } from "semantic-ui-react";
import LanguagePicker from "./components/LanguagePicker";

// test only
// const countryOptions = [
//   { key: "af", value: "af", flag: "af", text: "Afghanistan" }
// ];

class App extends Component {
  constructor() {
    super();
    this.state = {
      file: null,
      loading: false,
      response: JSON.parse(testCards),
      desiredLanguage: "en"
    };
  }

  selectFile = e => {
    this.setState({
      file: e.target.files[0]
    });
  };

  selectLanguage = e => {
    const languageCode = e.target.value;
    console.log("language picked");
    console.log("Selected:", languageCode);
    this.setState({
      desiredLanguage: languageCode
    });
  };

  onTest = () => {
    console.log("Test button clicked");
  };

  upload = byLine => {
    // var img = new Image();
    // img.src = e.target.files[0];
    this.setState({
      loading: true
    });
    const data = new FormData();
    data.append("image", this.state.file);
    const path = byLine ? "/cards/imageByLine" : "/cards/image";
    axios
      .post(path + "/" + this.state.desiredLanguage, data)
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

          {/* Testing Only */}
          <LanguagePicker onChange={e => this.selectLanguage(e)} />

          {/* Testing Only */}
          <select onChange={e => this.selectLanguage(e)}>
            <option value="zh">Chinese</option>
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
          </select>

          <Button
            style={{ marginTop: "20px" }}
            primary
            onClick={() => this.upload(false)}
          >
            Generate Menu By Block
          </Button>
          <Button
            style={{ marginTop: "20px" }}
            onClick={() => this.upload(true)}
          >
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
