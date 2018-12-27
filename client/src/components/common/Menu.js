import React, { Component } from "react";
import { Menu } from "semantic-ui-react";

export default class MenuPointing extends Component {
  state = { activeItem: "home" };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;

    return (
      <div>
        <Menu style={{ height: "80px" }}>
          <Menu.Item
            name="cards"
            active={activeItem === "cards"}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            name="photos"
            active={activeItem === "photos"}
            onClick={this.handleItemClick}
          />

          <Menu.Menu position="right">
            <Menu.Item name="logout" />
          </Menu.Menu>
        </Menu>
      </div>
    );
  }
}
