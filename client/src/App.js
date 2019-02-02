import React, { Component } from "react";
import Layout from "./components/common/Layout";
import CardContainer from "./components/CardContainer";
import Interface from "./components/Interface";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
// import createBrowserHistory from "history/createBrowserHistory";
import MenuEditor from "./components/Interface/MenuEditor";
// const customHistory = createBrowserHistory();

class App extends Component {
  constructor() {
    super();
    this.state = {
      upload: false,
      response: null,
      image: null
    };
  }

  setUpload = boolean => {
    this.setState({
      upload: boolean
    });
  };

  setResponse = response => {
    this.setState({ response });
  };

  clearResponse = () => {
    this.setState({
      response: null
    });
  };

  setImage = imageURL => {
    this.setState({
      image: imageURL
    });
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
                  setImage={this.setImage}
                />
              )}
            />
            <Route
              path="/editmenu"
              render={props => (
                <MenuEditor {...props} menuImage={this.state.image} />
              )}
            />
            <Link to="/editmenu">Edit Menu</Link>

            <Route
              path="/cards"
              render={props => (
                <CardContainer
                  {...props}
                  menuImage={this.state.image}
                  setUpload={this.setUpload}
                  upload={this.state.upload}
                  response={this.state.response}
                  clearResponse={this.clearResponse}
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
