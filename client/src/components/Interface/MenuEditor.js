import React, { Component } from "react";
// import { Container, Segment, Image } from "semantic-ui-react";
import { Redirect } from "react-router-dom";
import { Stage, Sprite, withPixiApp } from "@inlet/react-pixi";
import BoundingBox from "./helpers/BoundingBox";
import sampleOCR from "./helpers/sampleOCR";

import * as PIXI from "pixi.js";

export default class MenuEditor extends Component {
  state = {
    oldImageHeight: null,
    imageWidth: document.body.clientWidth - 30,
    imageHeight: null,
    boundingBoxes: null
  };
  componentDidMount() {
    const imageWidth = this.state.imageWidth;
    this.setState({ imageWidth });
    if (this.props.menuImage) {
      console.log("window", this.state.imageWidth);
      // const canvas = this.refs.canvas;
      // canvas.width = document.body.clientWidth;
      // canvas.height = document.body.clientHeight;
      // const width = 800;
      // const ctx = canvas.getContext("2d");
      const img = this.refs.image;

      // console.log(img);
      img.onload = () => {
        const imageHeight = (this.state.imageWidth * img.height) / img.width;
        this.setState({
          imageHeight: imageHeight,
          oldImageHeight: img.height
        });
        // this.createBoundingBox(img.height, imageHeight);
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
  scaleVertices = (
    { x: x1, y: y1 },
    { x: x3, y: y3 },
    preLength,
    newLength
  ) => {
    x1 = (x1 * newLength) / preLength;
    y1 = (y1 * newLength) / preLength;
    x3 = (x3 * newLength) / preLength;
    y3 = (y3 * newLength) / preLength;
    return { x1, y1, x3, y3 };
  };
  createBoundingBox = () => {
    // const boundingBoxes = sampleOCR.map(item=>{
    //   bBoxes =
    // })
    // const test = [
    //   { x: 229, y: 94 },
    //   { x: 334, y: 94 },
    //   { x: 334, y: 117 },
    //   { x: 229, y: 117 }
    // ];
    const test = sampleOCR[0]["boundingBoxes"][0];
    const { x1, y1, x3, y3 } = this.scaleVertices(
      test[0],
      test[2],
      this.state.oldImageHeight,
      this.state.imageHeight
    );
    console.log("new coords", x1, y1, x3, y3);
    this.setState({
      boundingBoxes: (
        <BoundingBox
          x1={x1}
          y1={y1}
          x3={x3}
          y3={y3}
          fill={0xff0000}
          alpha={0.5}
        />
      )
    });
    // return (
    //   <BoundingBox
    //     x1={x1}
    //     y1={y1}
    //     x3={x3}
    //     y3={y3}
    //     fill={0xff0000}
    //     alpha={0.5}
    //   />
    // );
  };

  render() {
    // console.log(sampleOCR[0]);
    if (this.props.menuImage) {
      return (
        <div>
          <p>Menu Editor PixiReact</p>

          <Stage width={this.state.imageWidth} height={this.state.imageHeight}>
            {/* {menuImage[0]} */}

            <Sprite
              image={this.props.menuImage}
              x={0}
              y={0}
              width={this.state.imageWidth}
              height={this.state.imageHeight}
            />
            {this.state.boundingBoxes}
          </Stage>
          {/* <canvas ref="canvas" /> */}
          {/* <Container> */}
          <img alt="menu" ref="image" src={this.props.menuImage} hidden />
          <button onClick={this.createBoundingBox}>Create Bounding Box</button>
          {/* </Container> */}
        </div>
      );
    } else {
      return <Redirect to="/" />;
    }
  }
}
