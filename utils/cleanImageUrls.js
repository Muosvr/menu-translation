// Testing
const urls = [
  "https://www.drdavidludwig.com/wp-content/uploads/2017/01/1-RIS_6IbCLYv1X3bzYW1lmA.jpegasdf@",
  "https://img.huffingtonpost.com/asset/585be1aa1600002400bdf2a6.jpegasfasd2",
  "https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/one_pot_chorizo_and_15611_16x9.jpgadsfsdf"
];

const cleanImageUrls = urls => {
  const jpg = /.jpg.+/;
  const jpeg = /.jpeg.+/;
  const png = /.png.+/;
  cleanUrls = urls.map(url => {
    url = url.replace(jpg, ".jpg");
    url = url.replace(jpeg, ".jpeg");
    url = url.replace(png, ".png");
    return url;
  });
  return cleanUrls;
};

// testing
// cleanImageUrls(urls);

module.exports = cleanImageUrls;
