import React, { Component } from "react";
import Layout from "./components/common/Layout";
import CardContainer from "./components/CardContainer";
import Interface from "./components/Interface";
import { testCards } from "./components/test_objs";

class App extends Component {
  constructor() {
    super();
    this.state = {
      response: JSON.parse(testCards)
    };
  }

  setResponse = response => {
    this.setState({ response });
  };
  render() {
    return (
      <div className="App">
        <Layout>
          <Interface setResponse={this.setResponse} />
          <CardContainer response={this.state.response} />
        </Layout>
      </div>
    );
  }
}

export default App;
