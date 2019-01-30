import React, { Component } from "react";
import { Card, Image, Button } from "semantic-ui-react";
// import validator from "validate-image-url";

class CardExampleCard extends Component {
  constructor() {
    super();
    this.state = {
      imageIndex: 0,
      imageURL: undefined
    };
  }

  details = () => {
    const details = Object.keys(this.props.card.description)
      .filter(key => key !== "0")
      .map((key, index) => {
        return (
          <div key={index}>
            <Card.Description>
              {this.props.card.description[key]}
            </Card.Description>
            <Card.Meta>
              (
              {this.props.card.translation
                ? this.props.card.translation[key]
                : "No translation found"}
              )
            </Card.Meta>
          </div>
        );
      });
    return details;
  };

  componentDidMount() {
    this.setState({
      imageURL: this.props.card.images[this.props.card.isFood[0]],
      numOfValidImages: this.props.card.isFood.length
    });
  }

  nextImage = () => {
    const validIndexes = this.props.card.isFood;
    const length = validIndexes.length;
    this.setState({
      imageURL: this.props.card.images[
        validIndexes[(this.state.imageIndex + 1) % length]
      ],
      imageIndex: (this.state.imageIndex + 1) % length
    });
  };

  render() {
    return (
      <Card fluid key={this.props.keyProp} style={{ overflow: "hidden" }}>
        <div style={{ maxHeight: "300px", overflow: "hidden" }}>
          <Image src={this.state.imageURL} fluid />

          {/* {validateImage()[0]} */}
        </div>
        {/* <Button fluid onClick={this.nextImage}>
          Next image
        </Button> */}
        <Button fluid onClick={this.nextImage}>
          Click for another image
        </Button>
        <Card.Content>
          <Card.Header>{this.props.card.description[0]}</Card.Header>
          <Card.Meta>
            (
            {this.props.card.translation
              ? this.props.card.translation[0]
              : "No translation found"}
            )
          </Card.Meta>
          {this.details()}
        </Card.Content>
      </Card>
    );
  }
}

export default CardExampleCard;
