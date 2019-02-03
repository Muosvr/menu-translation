import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Stage, Sprite, withPixiApp } from "@inlet/react-pixi";
import BoundingBox from "./helpers/BoundingBox";
import sampleOCR from "./helpers/sampleOCR";

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
      const img = this.refs.image;

      // console.log(img);
      img.onload = () => {
        const imageHeight = (this.state.imageWidth * img.height) / img.width;
        this.setState({
          imageHeight: imageHeight,
          oldImageHeight: img.height
        });
      };
    }
  }
  scaleVertices = ({ x1, y1, x3, y3 }, preLength, newLength) => {
    x1 = (x1 * newLength) / preLength;
    y1 = (y1 * newLength) / preLength;
    x3 = (x3 * newLength) / preLength;
    y3 = (y3 * newLength) / preLength;
    return { x1, y1, x3, y3 };
  };
  createBoundingBox = () => {
    const boundingBoxes = sampleOCR.map(item => {
      const { x1, y1, x3, y3 } = this.scaleVertices(
        item["boundingBox"],
        this.state.oldImageHeight,
        this.state.imageHeight
      );

      return (
        <BoundingBox
          key={Math.random()}
          x1={x1}
          y1={y1}
          x3={x3}
          y3={y3}
          fill={0xff0000}
          alpha={0.5}
        />
      );
    });

    // Testing
    // const test = [
    //   { x: 379, y: 676 },
    //   { x: 0, y: 0 },
    //   { x: 382, y: 691 },
    //   { x: 0, y: 0 }
    // ];
    // const { x1, y1, x3, y3 } = this.scaleVertices(
    //   test[0],
    //   test[2],
    //   this.state.oldImageHeight,
    //   this.state.imageHeight
    // );
    // const boundingBoxes = (
    //   <BoundingBox
    //     x1={x1}
    //     y1={y1}
    //     x3={x3}
    //     y3={y3}
    //     fill={0xff0000}
    //     alpha={0.5}
    //   />
    // );
    // console.log("new coords", x1, y1, x3, y3);
    this.setState({ boundingBoxes });
  };

  createBoundingBoxByBlocks = () => {};

  render() {
    if (this.props.menuImage) {
      return (
        <div>
          <p>Menu Editor PixiReact</p>

          <Stage width={this.state.imageWidth} height={this.state.imageHeight}>
            <Sprite
              image={this.props.menuImage}
              x={0}
              y={0}
              width={this.state.imageWidth}
              height={this.state.imageHeight}
            />
            {this.state.boundingBoxes}
          </Stage>
          <img alt="menu" ref="image" src={this.props.menuImage} hidden />
          <button onClick={this.createBoundingBox}>Create Bounding Box</button>
          <button onClick={this.createBoundingBoxByBlocks}>
            Create Bounding Box By Blocks
          </button>
        </div>
      );
    } else {
      return <Redirect to="/" />;
    }
  }
}
