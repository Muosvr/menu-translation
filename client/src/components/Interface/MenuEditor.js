import React, { Component } from "react";
import { Container, Segment, Image } from "semantic-ui-react";

export default class MenuEditor extends Component {
  componentDidMount() {
    // const canvas = this.refs.canvas;
    // canvas.width = document.body.clientWidth;
    // canvas.height = document.body.clientHeight;
    // const ctx = canvas.getContext("2d");
    const img = this.refs.image;
    console.log(img);
    // img.onload = () => {
    //   console.log(img);
    //   // ctx.drawImage(img, 0, 0);
    // };
  }
  render() {
    return (
      <div>
        {/* <canvas ref="canvas" /> */}
        {/* <Container> */}
        <Image ref="image" src={this.props.menuImage} />
        {/* </Container> */}
      </div>
    );
  }
}
