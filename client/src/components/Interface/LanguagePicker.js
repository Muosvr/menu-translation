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

class LanguagePicker extends Component {
  setLanguage = (e, data) => {
    this.props.setLanguage(data.value);
  };
  render() {
    return (
      <div style={{ display: "block", textAlign: "center", marginTop: "20px" }}>
        <h5> then </h5>
        <Dropdown
          style={{ marginTop: "0px", marginBottom: "20px", width: "300px" }}
          placeholder="Select Desired Language"
          search
          selection
          options={options}
          onChange={this.setLanguage}
        />
      </div>
    );
  }
}

export default LanguagePicker;
