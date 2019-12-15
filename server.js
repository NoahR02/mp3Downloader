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

app.get("/", (req,res) => {
  rp({url:"https://www.youtube.com/results?search_query=taylor+swift",json:false})
  .then( (data) => {
  const $ = cheerio.load(data);
  res.render("Index", { obj: $(".yt-lockup-title a") });
  }
  );
});

app.post("/getSongList" , (req, res) => {
  rp({url:`https://www.youtube.com/results?search_query=${req.body.songName}`,json:false})
  .then( (data) => {
    const $ = cheerio.load(data);
    res.render("Index", { obj: $(".yt-lockup-title a"), hrefs:$(".yt-lockup-title a")});
    }
    );
});

app.post("/download", (req, res) => {
  const songURL = `https://www.youtube.com${req.body.songURL}`;
  ytdl.getInfo(songURL, (err, info) => { 
    if(err) throw err;
    const songName = info.title;
    ytdl(songURL)
    .pipe(fs.createWriteStream(`./music/${songName}.mp3`));
  });
  res.redirect("/");
} );


app.listen(3000, () => console.log("connected"));