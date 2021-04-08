const user = "akshaygpta26";
var crypto = require("crypto");
var hash = crypto.createHash("sha512");
const axios = require("axios");

const api = `https://codeforces.com/api/user.rating?handle=${user}`;

const timestamp = Math.floor(new Date().getTime() / 1000);

const ha = `123456/user.rating?apikey=fb242893ffb2dcbbb4d2b9f790f1092f1df3c5f8&handle=${user}$time=${timestamp}#68eabfbabaa5367fd496df428ed540727dbd5fd2`;

const data = hash.update(ha, "utf-8");
const gen_hash = data.digest("hex");

console.log("gen_hash is", gen_hash);

const url = `${api}&apikey=fb242893ffb2dcbbb4d2b9f790f1092f1df3c5f8&time=${timestamp}&apiSig=123456${gen_hash}`;

// axios
//     .get(url)
//     .then(function (response) {
//       // handle success
//       return response.data.result.slice(-1).pop().newRating;
//     })
//     .catch(function (error) {
//       // handle error
//       return error;
//     })
//     .then(function () {
//       // always executed
//     });
function getResponse() {
  const promise = axios.get(url);
  const dataPromise = promise.then((response) => response);
  return dataPromise;
}

getResponse()
  .then((data) => console.log(data))
  .catch((err) => console.log(err));
