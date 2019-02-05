import React, { Component } from "react";
import { Container, Image } from "semantic-ui-react";

export default class MenuEditor extends Component {
  render() {
    return (
      <div>
        <Container>
          <Image src={this.props.menuImage} />
        </Container>
      </div>
    );
  }
}
