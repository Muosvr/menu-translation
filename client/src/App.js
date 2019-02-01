import React, { Component } from "react";
import Layout from "./components/common/Layout";
import CardContainer from "./components/CardContainer";
import Interface from "./components/Interface";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class App extends Component {
  constructor() {
    super();
    this.state = {
      upload: false,
      response: null
    };
  }

  setUpload = () => {
    this.setState({
      upload: true
    });
  };

  setResponse = response => {
    this.setState({ response });
  };
  render() {
    return (
      <Router>
        <div className="App">
          <Layout>
            <Route
              path="/"
              exact
              render={props => (
                <Interface
                  {...props}
                  setResponse={this.setResponse}
                  setUpload={this.setUpload}
                />
              )}
            />
            <Route
              path="/cards"
              render={props => (
                <CardContainer
                  {...props}
                  upload={this.state.upload}
                  response={this.state.response}
                />
              )}
            />
          </Layout>
        </div>
      </Router>
    );
  }
}

export default App;
