import React from "react";
import { Grid } from "semantic-ui-react";
import Card from "./Card";

export default function CardContainer(props) {
  // console.log(props.response);
  try {
    const cards = props.response["cards"]
      .filter(card => card.isFood)
      .map((card, index) => {
        return (
          <Grid.Column key={index}>
            <Card card={card} />
          </Grid.Column>
        );
      });

    return (
      <div>
        <Grid columns={3} doubling stackable style={{ marginTop: "30px" }}>
          {cards}
        </Grid>
      </div>
    );
  } catch (err) {
    console.log("No data present");
    return <div />;
  }
}
