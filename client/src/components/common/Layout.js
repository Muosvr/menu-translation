/* eslint-disable max-len */

import React from "react";
import { Container } from "semantic-ui-react";
import Menu from "./Menu";

export default props => {
  return (
    <Container style={{ marginTop: "20px", textAlign: "center" }}>
      {/* <Menu /> */}
      <h1>Menu Translator</h1>
      {props.children}
    </Container>
  );
};
