function getBodyData(req) {
  return new Promise((reslove, reject) => {
    try {
      let body = "";

      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        reslove(body);
      });
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = getBodyData;
