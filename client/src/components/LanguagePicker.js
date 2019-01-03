// import React from "react";
// import { Input } from "semantic-ui-react";
import { supportedLanguages } from "../options/supportedLanguages";

// const LanguagePicker = () => {
//   const options = Object.keys(supportedLanguages).map((key, index) => {
//     return <option value={key} code={supportedLanguages[key]} key={index} />;
//   });

//   return (
//     <div>
//       <Input
//         list="languages"
//         placeholder="Choose desired language"
//         style={{ marginTop: "20px", marginBottom: "20px", width: "210px" }}
//       />
//       <datalist id="languages">{options}</datalist>
//     </div>
//   );
// };

// export default LanguagePicker;

import React from "react";
import { Dropdown } from "semantic-ui-react";

// import { countryOptions } from "../common";
// const countryOptions = [
//   { key: "af", value: "af", flag: "af", text: "Afghanistan" },
//   { key: "cn", value: "cn", flag: "cn", text: "China" }
// ];

const options = Object.keys(supportedLanguages).map(language => {
  return {
    key: supportedLanguages[language],
    value: supportedLanguages[language],
    text: language
  };
});

const LanguagePicker = props => (
  <Dropdown
    style={{ marginTop: "20px", marginBottom: "20px" }}
    placeholder="Select Desired Language"
    search
    selection
    options={options}
    onChange={props.handleOnChange}
  />
);

export default LanguagePicker;
