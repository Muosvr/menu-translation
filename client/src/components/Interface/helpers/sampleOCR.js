const sampleOCR = [
  {
    text: "SUPPEN",
    boundingBox: { x1: 229, y1: 94, x3: 334, y3: 117 },
    location: [1, 1]
  },
  {
    text: "Gulaschsuppe",
    boundingBox: { x1: 88, y1: 134, x3: 200, y3: 155 },
    location: [2, 1]
  },
  {
    text: "Zwiebelsuppe",
    boundingBox: { x1: 91, y1: 155, x3: 197, y3: 173 },
    location: [2, 2]
  },
  {
    text: "mit Weißbrot und Gouda überbacken",
    boundingBox: { x1: 96, y1: 174, x3: 298, y3: 189 },
    location: [2, 3]
  },
  {
    text: "Tomatensuppe",
    boundingBox: { x1: 94, y1: 190, x3: 206, y3: 208 },
    location: [2, 4]
  },
  {
    text: "VORSPEISEN",
    boundingBox: { x1: 198, y1: 253, x3: 368, y3: 280 },
    location: [3, 1]
  },
  {
    text: "Tzatziki mit Joghurt Gurken und frischen Knoblauch",
    boundingBox: { x1: 93, y1: 300, x3: 424, y3: 323 },
    location: [4, 1]
  },
  {
    text: "Oliven und Peperoni",
    boundingBox: { x1: 89, y1: 321, x3: 285, y3: 343 },
    location: [4, 2]
  },
  {
    text: "Feta griechischer Schafskäse",
    boundingBox: { x1: 91, y1: 344, x3: 277, y3: 364 },
    location: [4, 3]
  },
  {
    text: "Saganaki panierte Feta frittiert",
    boundingBox: { x1: 90, y1: 366, x3: 304, y3: 385 },
    location: [4, 4]
  },
  {
    text: "Rawasaki",
    boundingBox: { x1: 90, y1: 386, x3: 184, y3: 403 },
    location: [4, 5]
  },
  {
    text: "überbackener Schafskäse mit Tomaten und scharfer Paprika",
    boundingBox: { x1: 97, y1: 405, x3: 428, y3: 423 },
    location: [4, 6]
  },
  {
    text: "Dolmadakia gefüllte Weinblätter mit Reis",
    boundingBox: { x1: 88, y1: 431, x3: 370, y3: 448 },
    location: [4, 7]
  },
  {
    text: "Garides Saganaki",
    boundingBox: { x1: 89, y1: 451, x3: 257, y3: 468 },
    location: [4, 8]
  },
  {
    text: "Garnellen in Tomatensauce mit Feta Überbacken",
    boundingBox: { x1: 98, y1: 469, x3: 370, y3: 484 },
    location: [4, 9]
  },
  {
    text: "SALATE",
    boundingBox: { x1: 226, y1: 511, x3: 331, y3: 540 },
    location: [5, 1]
  },
  {
    text: "Choriatiki Tomaten Gurken Zwiebeln Schafskäse",
    boundingBox: { x1: 91, y1: 570, x3: 430, y3: 590 },
    location: [6, 1]
  },
  {
    text: "Oliven Peperoni Olivenöl und Oregano",
    boundingBox: { x1: 88, y1: 590, x3: 308, y3: 604 },
    location: [6, 2]
  },
  {
    text: "Hähnchenbrustsalat gegrilltes Hähnchenbrustfilet",
    boundingBox: { x1: 88, y1: 616, x3: 453, y3: 632 },
    location: [7, 1]
  },
  {
    text: "grüner Salat Gouda und Tomaten",
    boundingBox: { x1: 91, y1: 633, x3: 272, y3: 648 },
    location: [7, 2]
  },
  {
    text: "Salat nach Art des Hauses",
    boundingBox: { x1: 90, y1: 657, x3: 331, y3: 674 },
    location: [7, 3]
  },
  {
    text: "grüner Salat Thunfisch Kochschinken Ei Mais",
    boundingBox: { x1: 98, y1: 676, x3: 377, y3: 691 },
    location: [7, 4]
  },
  {
    text: "Gouda Gurken und Hausdressing",
    boundingBox: { x1: 87, y1: 692, x3: 281, y3: 705 },
    location: [7, 5]
  },
  {
    text: "Alle Speisen incl MwSt Und Bedienung",
    boundingBox: { x1: 157, y1: 768, x3: 409, y3: 781 },
    location: [8, 1]
  },
  {
    text: "Konservierungsstoffe",
    boundingBox: { x1: 61, y1: 789, x3: 137, y3: 797 },
    location: [9, 1]
  },
  {
    text: "Geschmacksverstärker",
    boundingBox: { x1: 61, y1: 798, x3: 146, y3: 808 },
    location: [9, 2]
  }
];

export default sampleOCR;
