const fs = require("fs");
const express = require("express");
const app = express();
const path = require("path");
const ytdl = require("ytdl-core");
const cheerio = require("cheerio");
const rp = require("request-promise");
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

/* 
  @name [GET]/,
  @type Function : Void,
  @description : Load default videos onto home screen and render the home page via ejs.
*/
app.get("/", (req, res) => {
  // Load html in from url.
  rp({ url: "https://www.youtube.com/results?search_query=taylor+swift", json: false })
    .then((data) => {
      // Pick values out of html and render it onto the homepage.
      const $ = cheerio.load(data);
      res.render("Index", { obj: $(".yt-lockup-title a") });
    }
    );
});

/* 
  @name [POST]/getSongList,
  @type Function : Void,
  @description : Load search results and render them onto the home page.
*/
app.post("/getSongList", (req, res) => {
  // Load html in from url.
  rp({ url: `https://www.youtube.com/results?search_query=${req.body.songName}`, json: false })
    .then((data) => {
      // Pick values out of html and render it onto the homepage.
      const $ = cheerio.load(data);
      res.render("Index", { obj: $(".yt-lockup-title a"), hrefs: $(".yt-lockup-title a") });
    }
    );
});

/* 
  @name [POST]/download,
  @type Function : Void,
  @description : Download the selected song then redirect to the home page.
*/
app.post("/download", (req, res) => {
  const songURL = `https://www.youtube.com${req.body.songURL}`;
  ytdl.getInfo(songURL, (err, info) => {
    if (err) throw err;
    const songName = info.title;
    ytdl(songURL, { quality: 'highestaudio' })
    // Select mp3 as audio format and set the file name to the song name. Then download the song.
      .pipe(fs.createWriteStream(`./music/${songName}.mp3`)); 
  });
  res.redirect("/");
});


app.listen(3000, () => console.log("connected"));