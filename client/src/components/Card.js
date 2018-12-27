import React from "react";
import { Card, Image } from "semantic-ui-react";

const CardExampleCard = props => {
  const details = Object.keys(props.card.description)
    .filter(key => key !== "0")
    .map(key => {
      return (
        <div>
          <Card.Description>{props.card.description[key]}</Card.Description>
          <Card.Meta>({props.card.translation[key]})</Card.Meta>
        </div>
      );
    });

  return (
    <Card fluid>
      <Image src={props.card.images[1]} fluid />
      <Card.Content>
        <Card.Header>{props.card.description[0]}</Card.Header>
        <Card.Meta>({props.card.translation[0]})</Card.Meta>
        {details}
      </Card.Content>
    </Card>
  );
};

export default CardExampleCard;
