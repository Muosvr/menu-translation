import { supportedLanguages } from "../../options/supportedLanguages";
import React, { Component } from "react";
import { Dropdown } from "semantic-ui-react";

const options = Object.keys(supportedLanguages).map(language => {
  return {
    key: supportedLanguages[language],
    value: supportedLanguages[language],
    text: language
  };
});
const defaultValue = "en";

class LanguagePicker extends Component {
  setLanguage = (e, data) => {
    this.props.setLanguage(data.value);
  };
  render() {
    return (
      <div style={{ display: "block", textAlign: "center", marginTop: "20px" }}>
        <h5> Select a desired language </h5>
        <Dropdown
          search
          floating
          selection
          options={options}
          defaultValue={"en"}
          onChange={this.setLanguage}
        />
      </div>
    );
  }
}

export default LanguagePicker;
