const translate = require("../googleAPI/translate");
const getImageLabels = require("../component_logic/getImageLabels");
const searchImage = require("../googleAPI/searchImage");
const imageOCR = require("../googleAPI/imageOCR");
const parseOCRAnnotation = require("../utils/parseOCRAnnotation");
const assert = require("assert");
const fs = require("fs");
const request = require("request-promise");

describe("translate", function() {
  it("should translate 牛肉面 into English", async function() {
    translate("牛肉面", "en", "localhost:5000").then(response => {
      assert.equal(response, "beef noodles");
    });
  });
});

describe("getImageLabels", function() {
  it("should retrive labels for images", async function() {
    urls = [
      "https://www.drdavidludwig.com/wp-content/uploads/2017/01/1-RIS_6IbCLYv1X3bzYW1lmA.jpeg",
      "https://img.huffingtonpost.com/asset/585be1aa1600002400bdf2a6.jpeg",
      "https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/one_pot_chorizo_and_15611_16x9.jpg"
    ];

    getImageLabels(urls, "localhost:5000").then(response => {
      response = response.map(labels => {
        return labels.filter(label => label === "food");
      });
      assert.equal(response[0], "food");
      assert.equal(response[1], "food");
      assert.equal(response[2], "food");
    });
  });
});

describe("imageSearch", function() {
  it("should be able to search for images", async function() {
    searchImage("burger", 10, "localhost:5000").then(response => {
      assert.ok(response);
    });
  });
});

describe("imageOCR", function() {
  it("should be able to perform OCR on images", async function() {
    fs.readFile("./test_images/16pic_4982744_b.jpg", (err, data) => {
      if (err) throw err;
      const base64Image = Buffer.from(data).toString("base64");
      imageOCR(base64Image, "DOCUMENT_TEXT_DETECTION", "localhost:5000").then(
        response => {
          assert.ok(parseOCRAnnotation(response));
        }
      );
    });
  });
});

describe("cards", function() {
  it("should generate cards with menu items", async function() {
    fs.readFile("./test_images/speisekarte_small.jpg", (err, data) => {
      if (err) throw err;
      const options = {
        method: "POST",
        uri: "http://localhost:5000/cards/image/en",
        formData: {
          image: {
            value: data,
            options: {
              filename: "test.jpg",
              contentType: "image/jpg"
            }
          }
        },
        json: true
      };

      request(options).then(response => {
        const cards = response["cards"];
        assert.ok(cards);
      });
    });
  });
});
