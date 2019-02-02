import React, { Component } from "react";
// import { Container, Segment, Image } from "semantic-ui-react";
import { Redirect } from "react-router-dom";

export default class MenuEditor extends Component {
  componentDidMount() {
    if (this.props.menuImage) {
      const canvas = this.refs.canvas;
      // canvas.width = document.body.clientWidth;
      // canvas.height = document.body.clientHeight;
      const width = 800;
      const ctx = canvas.getContext("2d");
      const img = this.refs.image;

      // console.log(img);
      img.onload = () => {
        // console.log(img);
        canvas.width = width;
        canvas.height = (width * img.height) / img.width;
        console.log(img.width, img.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.rect(0, 20, 150, 100);
        ctx.stroke();
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(20, 20, 150, 100);
        ctx.stroke();
      };
    }
  }

  render() {
    if (this.props.menuImage) {
      return (
        <div>
          <canvas ref="canvas" />
          {/* <Container> */}
          <img
            alt="menu"
            ref="image"
            style={{ width: "600px" }}
            src={this.props.menuImage}
            hidden
          />
          {/* </Container> */}
        </div>
      );
    } else {
      return <Redirect to="/" />;
    }
  }
}
