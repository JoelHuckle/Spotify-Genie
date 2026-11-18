import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import querystring from "querystring";
import cors from "cors";
import cookieParser from "cookie-parser";
import crypto from "crypto";

//pass .env values to process.env
dotenv.config();

const app = express().use(cors()).use(cookieParser());

const port = process.env.PORT || 3000;

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

const generateRandomString = (length) => {
  return crypto.randomBytes(60).toString("hex").slice(0, length);
};

var stateKey = "spotify_auth_state";

app.get("/login", function (req, res) {
  var state = generateRandomString(16);
  // res.cookie(stateKey, state);

  var scope = "user-top-read";
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: clientId,
        scope: scope,
        redirect_uri: redirectUri,
        state: state,
      }),
  );
});

app.get("/callback", function (req, res) {
  var code = req.query.code || null;
  var state = req.query.state || null;
  // var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null) {
    res.redirect(
      process.env.CLIENT_URI +
        querystring.stringify({
          error: "state_mismatch",
        }),
    );
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      },
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          new Buffer.from(clientId + ":" + clientSecret).toString("base64"),
      },
      json: true,
    };

    axios.post(authOptions.url, authOptions, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        var accessToken = body.access_token,
          refreshToken = body.refresh_token;

        //pass tokens to the client
        res.redirect(
          process.env.CLIENT_URI +
            querystring.stringify({
              access_token: accessToken,
              refresh_token: refreshToken,
            }),
        );
      } else {
        res.redirect(
          process.env.CLIENT_URI +
            querystring.stringify({
              error: "invalid_token",
            }),
        );
      }
    });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
