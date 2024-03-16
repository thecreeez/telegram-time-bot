const fetch = require("node-fetch");

module.exports = class RandomCatAPI {
  static LINK_TO_API = `https://api.thecatapi.com/v1/images/search?limit=1`;

  static async getLink() {
    let request = await fetch(RandomCatAPI.LINK_TO_API);
    try {
      let requestJson = await request.json();

      return requestJson[0].url;
    } catch(e) {
      console.log(e);
      return null;
    }
  }
}