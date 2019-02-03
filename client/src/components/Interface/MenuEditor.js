import React, { Component } from "react";
// import { Container, Segment, Image } from "semantic-ui-react";
import { Redirect } from "react-router-dom";
import { Stage, Sprite } from "@inlet/react-pixi";
import { render, Text } from "@inlet/react-pixi";
import * as PIXI from "pixi.js";

export default class MenuEditor extends Component {
  state = {
    imageWidth: null,
    imageHeight: null
  };
  componentDidMount() {
    const imageWidth = document.body.clientWidth;
    this.setState({ imageWidth });
    if (this.props.menuImage) {
      console.log("window", document.body.clientWidth);
      // const canvas = this.refs.canvas;
      // canvas.width = document.body.clientWidth;
      // canvas.height = document.body.clientHeight;
      // const width = 800;
      // const ctx = canvas.getContext("2d");
      const img = this.refs.image;

      // console.log(img);
      img.onload = () => {
        const imageHeight =
          (document.body.clientWidth * img.height) / img.width;
        this.setState({ imageHeight });

        // console.log(img);
        //   canvas.width = width;
        //   canvas.height = (width * img.height) / img.width;
        //   console.log(img.width, img.height);
        //   ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        //   ctx.rect(0, 20, 150, 100);
        //   ctx.stroke();
        //   ctx.fillStyle = "#FF0000";
        //   ctx.fillRect(20, 20, 150, 100);
        //   ctx.stroke();
      };
    }
  }

  render() {
    if (this.props.menuImage) {
      // const app = new PIXI.Application(800, 600, {
      //   backgroundColor: 0x10bb99,
      //   view: document.getElementById("container")
      // });
      const menuImage = new PIXI.Sprite.from(this.props.menuImage);
      return (
        <div>
          <p>Menu Editor PixiReact</p>

          <Stage
            width={document.body.clientWidth}
            height={this.state.imageHeight}
          >
            {/* {menuImage[0]} */}

            <Sprite
              image={this.props.menuImage}
              width={document.body.clientWidth}
              height={this.state.imageHeight}
            />
          </Stage>
          {/* <canvas ref="canvas" /> */}
          {/* <Container> */}
          <img alt="menu" ref="image" src={this.props.menuImage} hidden />
          {/* </Container> */}
        </div>
      );
    } else {
      return <Redirect to="/" />;
    }
  }
}
