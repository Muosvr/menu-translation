import React, { Component } from "react";
import Layout from "./components/common/Layout";
import CardContainer from "./components/CardContainer";
import { testCards } from "./components/test_objs";
import { Container } from "semantic-ui-react";
import axios from "axios";
import {
  Dimmer,
  Loader,
  Button,
  Grid,
  Segment,
  Icon,
  Image
} from "semantic-ui-react";
import LanguagePicker from "./components/LanguagePicker";

// test only

class App extends Component {
  constructor() {
    super();
    this.state = {
      file: null,
      loading: false,
      response: JSON.parse(testCards),
      desiredLanguage: "en",
      loaded: false,
      byLine: undefined
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
        imagePreviewUrl: reader.result,
        loaded: true
      });
    };
    reader.readAsDataURL(file);
  };

  selectLanguage = (e, data) => {
    console.log("language picked:", data.value);

    // event = e.target;
    this.setState({
      desiredLanguage: data.value
    });
  };

  onTest = () => {
    console.log("Test button clicked");
  };

  // handleLayoutByLine = () => {
  //   this.setState
  // }

  upload = byLine => {
    // var img = new Image();
    // img.src = e.target.files[0];
    this.setState({
      loading: true
    });
    const data = new FormData();
    data.append("image", this.state.file);
    const path = byLine ? "/cards/imageByLine" : "/cards/image";
    this.setState({
      byLine: byLine
    });
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
    // if (this.state.byLine !== undefined) {
    //   const byLineButtonBackground = this.state.byLine ? "#2185d0" : "white";
    //   const notByLineButtonBackground = this.state.byLine ? "white" : "2185d0";
    //   const byLineButtonColor = this.state.byLine ? "white" : "black";
    //   const notByLineButtonColor = this.state.byLine ? "black" : "white";
    // }
    return (
      <div className="App">
        <Layout>
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
          <Segment hidden={!this.state.loaded}>
            <Image
              fluid
              style={{ margin: "auto", marginTop: "20px" }}
              src={this.state.imagePreviewUrl}
              alt="menu preview"
            />
          </Segment>

          <div
            style={{ display: "block", textAlign: "center", marginTop: "20px" }}
          >
            <h3 style={{ margin: "0px" }}>
              2. Pick a language to translate to
            </h3>
            <LanguagePicker
              handleOnChange={this.selectLanguage}
              style={{ width: "300px", marginTop: "0px" }}
            />
          </div>

          <div
            style={{
              display: "block",
              textAlign: "center",
              marginBottom: "10px"
            }}
          >
            <h3 tyle={{ marginBottom: "0px", textAlign: "center" }}>
              {" "}
              3. Choose a menu layout
            </h3>
          </div>
          <Container style={{ textAlign: "center" }}>
            <Grid
              columns={2}
              doubling
              stackable
              centered
              style={{ maxWidth: "550px", margin: "auto" }}
            >
              <Grid.Column
                centered
                key={1}
                style={{
                  textAlign: "center",
                  maxWidth: "250px",
                  margin: "auto"
                }}
              >
                <Button
                  style={{ marginTop: "20px", width: "250px" }}
                  onClick={() => this.setState({ byLine: false })}
                  primary={
                    !this.state.byLine && this.state.byLine !== undefined
                  }
                >
                  <h3>Menu</h3>
                  <p style={{ marginBottom: "0px", marginTop: "20px" }}>Item</p>
                  <p style={{ margin: "0px" }}>Description</p>
                  <p style={{ marginBottom: "0px", marginTop: "20px" }}>Item</p>
                  <p style={{ margin: "0px" }}>Description</p>
                  <p style={{ marginBottom: "0px", marginTop: "20px" }}>Item</p>
                  <p style={{ margin: "0px" }}>Description</p>
                </Button>
              </Grid.Column>

              <Grid.Column
                centered
                key={2}
                style={{
                  textAlign: "center",
                  maxWidth: "250px",
                  margin: "auto"
                }}
              >
                <Button
                  style={{ marginTop: "20px", width: "250px" }}
                  onClick={() => this.setState({ byLine: true })}
                  primary={this.state.byLine && this.state.byLine !== undefined}
                >
                  <h3>Menu</h3>
                  <p style={{ marginBottom: "0px", marginTop: "10px" }}>Item</p>
                  <p style={{ marginBottom: "0px", marginTop: "10px" }}>Item</p>
                  <p style={{ marginBottom: "0px", marginTop: "10px" }}>Item</p>
                  <p style={{ marginBottom: "0px", marginTop: "10px" }}>Item</p>
                  <p style={{ marginBottom: "0px", marginTop: "10px" }}>Item</p>
                  <p style={{ marginBottom: "0px", marginTop: "10px" }}>Item</p>
                </Button>
              </Grid.Column>
            </Grid>
            <Button
              primary
              style={{ marginTop: "20px" }}
              onClick={() => this.upload(this.state.byLine)}
              loading={this.state.loading}
            >
              Generate Menu
            </Button>
          </Container>

          <CardContainer response={this.state.response} />
        </Layout>
      </div>
    );
  }
}

export default App;
