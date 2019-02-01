import React from "react";
import { Grid, Message, Icon, Button } from "semantic-ui-react";
import Card from "./Card";
import { Redirect, Link } from "react-router-dom";

export default function CardContainer(props) {
  var cards = null;
  if (props.upload) {
    if (props.response) {
      cards = props.response["cards"]
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
      <div style={{ marginTop: "10px" }}>
        <Message icon hidden={cards}>
          <Icon name="circle notched" loading />
          <Message.Content>
            <Message.Header>Your menu is being prepared</Message.Header>
            This may take a minute
          </Message.Content>
        </Message>
        <Link to="/" hidden={!cards}>
          <Button primary>Upload a new menu</Button>
        </Link>
        <Grid
          columns={3}
          doubling
          stackable
          style={{ marginTop: "30px" }}
          hidden={!cards}
        >
          {cards}
        </Grid>
      </div>
    );
    // try {
    //   const cards = props.response["cards"]
    //     .filter(card => card.isFood)
    //     .map((card, index) => {
    //       return (
    //         <Grid.Column key={Math.random()}>
    //           <Card card={card} />
    //         </Grid.Column>
    //       );
    //     });

    //   return (
    //     <div>
    //       <Grid columns={3} doubling stackable style={{ marginTop: "30px" }}>
    //         {cards}
    //       </Grid>
    //     </div>
    //   );
    // } catch (err) {
    //   console.log("No data present");
    //   return (
    //     <Message icon>
    //       <Icon name="circle notched" loading />
    //       <Message.Content>
    //         <Message.Header>You menu is being prepared</Message.Header>
    //         This may take a minute
    //       </Message.Content>
    //     </Message>
    //   );
    // }
  } else {
    return <Redirect to="/" />;
  }
}
