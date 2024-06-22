// const { URLSearchParams } = require("url");
// const fetch = require("node-fetch");
const encodedParams = new URLSearchParams();

encodedParams.set("__a", "1");
encodedParams.set("lsd", "AVr-bcJMh6Y");

let url = "https://www.facebook.com/ads/library/async/search_ads?q=icecream";

let options = {
  method: "POST",
  headers: {
    accept: "*/*",
    "content-type": "application/x-www-form-urlencoded",
    "sec-fetch-site": "same-origin",
    "user-agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    cookie: "datr=o5NgZnfbHr8myUMmTSZXh7_L; ",
  },
  body: encodedParams,
};

fetch(url, options)
  .then((res) => res.text())
  .then((res) => console.log(res))
  .catch((err) => console.error("error:" + err));
