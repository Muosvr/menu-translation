import React, { Component } from "react";
import LanguagePicker from "./LanguagePicker";
import MenuLayout from "./MenuLayout";
import SelectFile from "./SelectFile";
import UploadToServer from "./UploadToServer";

export default class Interface extends Component {
  constructor() {
    super();
    this.state = {
      file: null,
      desiredLanguage: undefined,
      byLine: undefined
    };
  }

  setLanguage = symbol => {
    this.setState({
      desiredLanguage: symbol
    });
  };

  setByLine = byLine => {
    this.setState({ byLine });
  };

  setFile = file => {
    this.setState({ file });
  };

  render() {
    return (
      <div style={{ textAlign: "center" }}>
        <SelectFile setFile={this.setFile} />
        <LanguagePicker setLanguage={this.setLanguage} />
        <MenuLayout setByLine={this.setByLine} />
        <UploadToServer
          desiredLanguage={this.state.desiredLanguage}
          file={this.state.file}
          setResponse={this.props.setResponse}
          byLine={this.state.byLine}
        />
      </div>
    );
  }
}
