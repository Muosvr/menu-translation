import React, { Component } from "react";
import { Grid, Message, Icon, Button, Image, Segment } from "semantic-ui-react";
import Card from "./Card";
import { Redirect, Link } from "react-router-dom";

class CardContainer extends Component {
  state = {
    menuImage: false
  };

  toggleImage = () => {
    if (this.state.menuImage) {
      this.setState({
        menuImage: false
      });
    } else {
      this.setState({
        menuImage: true
      });
    }
  };

  clearCards = () => {
    this.props.setUpload(false);
    this.props.clearResponse();
  };

  render() {
    var cards = null;
    if (this.props.upload) {
      if (this.props.response) {
        cards = this.props.response["cards"]
          .filter(card => card.isFood)
          .map((card, index) => {
            return (
              <Grid.Column key={Math.random()}>
                <Card card={card} />
              </Grid.Column>
            );
          });
      }

      return (
        <div style={{ marginTop: "10px", textAlign: "center" }}>
          {!cards && (
            <Message icon>
              <Icon name="circle notched" loading />
              <Message.Content>
                <Message.Header>Your menu is being prepared</Message.Header>
                This may take a minute
              </Message.Content>
            </Message>
          )}
          <div hidden={!cards}>
            <Link to="/">
              <Button primary onClick={this.clearCards}>
                Upload a new menu
              </Button>
            </Link>
            <Button onClick={this.toggleImage}>Show menu image</Button>
            <Segment hidden={!this.state.menuImage}>
              <Image
                fluid
                src={this.props.menuImage}
                style={{ margin: "auto", marginTop: "20px" }}
                alt="menu image"
              />
            </Segment>

            <Grid columns={3} doubling stackable style={{ marginTop: "30px" }}>
              {cards}
            </Grid>
          </div>
        </div>
      );
    } else {
      return <Redirect to="/" />;
    }
  }
}

export default CardContainer;
