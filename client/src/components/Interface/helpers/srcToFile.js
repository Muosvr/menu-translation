const srcToFile = async (src, fileName, mimeType) => {
  return fetch(src)
    .then(function(res) {
      return res.arrayBuffer();
    })
    .then(function(buf) {
      return new File([buf], fileName, { type: mimeType });
    });
};

export default srcToFile;
