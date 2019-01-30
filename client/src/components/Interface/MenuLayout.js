import React, { Component } from "react";
import { Container, Grid, Button } from "semantic-ui-react";

export default class MenuLayout extends Component {
  constructor() {
    super();
    this.state = {
      byLine: undefined
    };
  }
  setByLine = byLine => {
    this.setState({
      byLine: byLine
    });
    this.props.setByLine(byLine);
  };
  render() {
    return (
      <div>
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
        <Container>
          <Grid
            columns={2}
            doubling
            stackable
            centered
            style={{ maxWidth: "550px", margin: "auto" }}
          >
            <Grid.Column
              key={1}
              style={{
                textAlign: "center",
                maxWidth: "250px",
                margin: "10px"
              }}
            >
              <Button
                style={{ width: "250px" }}
                onClick={() => this.setByLine(false)}
                primary={!this.state.byLine && this.state.byLine !== undefined}
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
              key={2}
              style={{
                textAlign: "center",
                maxWidth: "250px",
                margin: "10px"
              }}
            >
              <Button
                style={{ width: "250px" }}
                onClick={() => this.setByLine(true)}
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
        </Container>
      </div>
    );
  }
}
