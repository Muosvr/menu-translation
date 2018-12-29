import React from "react";
import { Card, Image, Container } from "semantic-ui-react";

const CardExampleCard = props => {
  const details = Object.keys(props.card.description)
    .filter(key => key !== "0")
    .map((key, index) => {
      return (
        <div key={index}>
          <Card.Description>{props.card.description[key]}</Card.Description>
          <Card.Meta>
            (
            {props.card.translation
              ? props.card.translation[key]
              : "No translation found"}
            )
          </Card.Meta>
        </div>
      );
    });

  return (
    <Card fluid key={props.keyProp} style={{ overflow: "hidden" }}>
      <div style={{ maxHeight: "300px", overflow: "hidden" }}>
        <Image src={props.card.images[1]} fluid />
      </div>

      <Card.Content>
        <Card.Header>{props.card.description[0]}</Card.Header>
        <Card.Meta>
          (
          {props.card.translation
            ? props.card.translation[0]
            : "No translation found"}
          )
        </Card.Meta>
        {details}
      </Card.Content>
    </Card>
  );
};

export default CardExampleCard;
