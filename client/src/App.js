import React, { Component } from "react";
import Layout from "./components/common/Layout";
import CardContainer from "./components/CardContainer";
import Interface from "./components/Interface";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class App extends Component {
  constructor() {
    super();
    this.state = {
      response: null
    };
  }

  setResponse = response => {
    this.setState({ response });
  };
  render() {
    const Interface = <Interface setResponse={this.setResponse} />;
    // const Index = () => <h2>Home</h2>;

    return (
      <Router>
        <div className="App">
          {/* <Link to="/index">Index</Link> */}
          <Layout>
            {/* <Link to="/">Interface</Link> */}

            <Route path="/" component={Interface} />
            {/* <Interface /> */}
            <CardContainer response={this.state.response} />
          </Layout>
          {/* <Route path="/index" component={Index} /> */}
        </div>
      </Router>
    );
  }
}

export default App;
