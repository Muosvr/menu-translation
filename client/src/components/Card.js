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
  // const validateImage = async () => {
  //   const image = await validator({
  //     url: props.card.images[props.card.isFood[0]],
  //     timeout: 2000
  //   })
  //     .then(({ image, url }) => {
  //       return <Image src={image} fluid />;
  //     })
  //     .catch(err => {
  //       return <p>Image temperarily unavailable</p>;
  //     });

  //   return image;
  // };
  componentDidMount() {
    this.setState({
      imageURL: this.props.card.images[this.props.card.isFood[0]],
      numOfValidImages: this.props.card.isFood.length
    });
  }

  componentWillReceiveProps() {
    this.setState({
      imageURL: this.props.card.images[this.props.card.isFood[0]],
      numOfValidImages: this.props.card.isFood.length
    });
  }

  // componentWillUpdate() {
  //   this.setState({
  //     imageURL: this.props.card.images[this.props.card.isFood[0]],
  //     numOfValidImages: this.props.card.isFood.length
  //   });
  // }

  // componentWillReceiveProps() {
  //   this.setState({
  //     imageURL: this.props.card.images[this.props.card.isFood[0]],
  //     numOfValidImages: this.props.card.isFood.length
  //   });
  // }
  nextImage = () => {
    const numOfValidImagess = this.props;
    this.setState({
      imageURL: this.props.card.images[
        this.props.card.isFood[
          (this.state.imageIndex + 1) % this.state.numOfValidImages
        ]
      ],
      imageIndex: (this.state.imageIndex + 1) % this.state.numOfValidImages
    });
  };

  render() {
    return (
      <Card fluid key={this.props.keyProp} style={{ overflow: "hidden" }}>
        <div style={{ maxHeight: "300px", overflow: "hidden" }}>
          <Image
            src={this.props.card.images[this.props.card.isFood[0]]}
            fluid
          />

          {/* {validateImage()[0]} */}
        </div>
        {/* <Button fluid onClick={this.nextImage}>
          Next image
        </Button> */}

        <Card.Content>
          {/* <Card.Meta style={{ marginBottom: "10px", textAlign: "center" }}>
            <Button onClick={this.reloadImage}>Reload image</Button>
          </Card.Meta> */}
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
