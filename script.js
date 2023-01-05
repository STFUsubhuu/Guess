const express = require("express");
const bodyparser = require("body-parser");
const port = process.env.PORT || 3000
const fs = require('fs');
const cheerio = require('cheerio');
let score = 3;

const app = express();
app.use(express.static("file"));
app.use(bodyparser.urlencoded({extended : true}));
app.set('view engine', 'ejs');

app.get("/", function(req, res){

  fs.readFile('index.html', 'utf-8', function (err, data) {
  if (err) throw err;

  // Load the HTML into cheerio
  const $ = cheerio.load(data);


  $('.question').text("?");
  $('.guess').val(" ");
  $('.score').text('3');
  score = 3;
  $('.message').text('Start. Guessing');
  $('body').css('background-color', 'black');


  // Save the modified HTML back to the file
  fs.writeFile('index.html', $.html(), 'utf-8', function (err) {
    if (err) throw err;
    // console.log('Successfully changed message element!');
    res.sendFile(__dirname + "/index.html");
  });

});



});

app.post("/", function(req, res){
const reset = req.body.num1;
guess = Math.floor(Math.random() * 20 + 1);
// console.log(guess);
num = req.body.num;

if(reset == 1){

  fs.readFile('index.html', 'utf-8', function (err, data) {
      if (err) throw err;

      // Load the HTML into cheerio
      const $ = cheerio.load(data);


      $('.question').text("?");
      $('.guess').val(" ");
      $('.score').text('3');
      score = 3;
      $('.message').text('Start. Guessing');
      $('body').css('background-color', 'black');


      // Save the modified HTML back to the file
      fs.writeFile('index.html', $.html(), 'utf-8', function (err) {
        if (err) throw err;
        // console.log('Successfully changed message element!');
        res.sendFile(__dirname + "/index.html");
      });
});
}else if(!num && num > 20){
    fs.readFile('index.html', 'utf-8', (err, data) => {
          if (err) throw err;

          // Load the HTML into cheerio
          const $ = cheerio.load(data);

          // Change the h1 element
            $('.message').text('No, Number Found!');
            $('body').css('background-color', 'red');


          // Save the modified HTML back to the file
          fs.writeFile('index.html', $.html(), 'utf-8', (err) => {
            if (err) throw err;
            // console.log('Successfully changed message element!');
            res.sendFile(__dirname + "/index.html");
          });
      });
  } else{
      fs.readFile('index.html', 'utf-8', (err, data) => {
          if (err) throw err;

          // Load the HTML into cheerio
          const $ = cheerio.load(data);

          if(guess == num){
            $('.question').text(guess);
            $('.guess').val(num);
            $('.message').text('Correct.🎉🦾🦾');
            $('body').css('background-color', 'green');

          }else{
            $('.question').text(guess);
            $('.guess').val(num);
            score--;
            $('.score').text(score);
            if(score == 0){
              res.render('index.ejs');
              app.post("/submit", function(req, res){
                res.redirect("/")
              });
            }
            $('.message').text('False. 🎃❌');
            $('body').css('background-color', 'red');
          }

          // Save the modified HTML back to the file
          fs.writeFile('index.html', $.html(), 'utf-8', (err) => {
            if (err) throw err;
            // console.log('Successfully changed message element!');
            res.sendFile(__dirname + "/index.html");
          });
      });
  }
});

app.listen(port, function(){
  console.log("Up and running");
});
