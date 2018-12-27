import React, { Component } from "react";
import Layout from "./components/common/Layout";
import Card from "./components/Card";
import { Grid, Segment } from "semantic-ui-react";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Layout>
          <Grid columns={3} doubling stackable style={{ marginTop: "30px" }}>
            <Grid.Column>
              <Segment>
                <Card />
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment>
                <Card />
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment>
                <Card />
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment>
                <Card />
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment>
                <Card />
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment>
                <Card />
              </Segment>
            </Grid.Column>
          </Grid>
        </Layout>
      </div>
    );
  }
}

export default App;
