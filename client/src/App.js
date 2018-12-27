import React, { Component } from "react";
import Layout from "./components/common/Layout";
import CardContainer from "./components/CardContainer";
import { testCards } from "./components/test_objs";

// import Card from "./components/Card";
// import { Grid, Segment } from "semantic-ui-react";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Layout>
          <CardContainer response={JSON.parse(testCards)} />
        </Layout>
      </div>
    );
  }
}

export default App;
