const { default: axios } = require("axios");
var crypto = require("crypto");
var hash = crypto.createHash("sha512");

function giveUrl(username) {
  const user = username;
  const api = `https://codeforces.com/api/user.rating?handle=${user}`;

  const timestamp = Math.floor(new Date().getTime() / 1000);
  const randomNumber = Math.floor(100000 + Math.random() * 900000);
  const ha = `${randomNumber}/user.rating?apikey=fb242893ffb2dcbbb4d2b9f790f1092f1df3c5f8&handle=${user}$time=${timestamp}#68eabfbabaa5367fd496df428ed540727dbd5fd2`;

  const data = hash.update(ha, "utf-8");
  const gen_hash = data.digest("hex");
  const url = `${api}&apikey=fb242893ffb2dcbbb4d2b9f790f1092f1df3c5f8&time=${timestamp}&apiSig=123456${gen_hash}`;

  return url;
}

export async function fetchUserhandle(user) {
  if (!user) {
    return undefined;
  }
  const url = giveUrl(user);
  try {
    const { data } = await axios.get(url);
    return data.result.slice(-1).pop().newRating;
  } catch (err) {
    // console.error(err);
    return undefined;
  }
}

// export default giveAPi;
