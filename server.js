// Express

/**
 * TODO
 * Github clean
 * Page transitions
 */

const express = require('express');
const fs = require('fs');
const compression = require('compression');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const path = require('path');
const PORT = process.env.PORT || 3000;

const STATIC = path.resolve(__dirname, 'public');

const app = express();

/**
 * Pre-middleware routes
 */

app.get('/robots.txt', function (req, res) {
  res.type('text/plain');
  res.end();
});

app.get('*.js', function (req, res, next) {
  req.url = req.url + '.gz';
  res.set('Content-Encoding', 'gzip');
  res.set('Content-Type', 'text/javascript');
  next();
});

/**
 * Middleware
 */

app.use(express.static(STATIC));
app.use(compression({
  filter: function () { return true; }
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

/**
 * Routes
 */


app.get('/invoke/home', function(req, res) {
  fs.readFile(__dirname + '/views/home.html', 'utf8', function (err, html) {
    res.send(html);
  });
});

app.get('/invoke/projects', function(req, res) {
  fs.readFile(__dirname + '/views/projects.html', 'utf8', function (err, html) {
    res.send(html);
  });
});

app.get('/invoke/about-me', function(req, res) {
  fs.readFile(__dirname + '/views/about-me.html', 'utf8', function (err, html) {
    res.send(html);
  });
});

app.get('/invoke/contact-me', function(req, res) {
  fs.readFile(__dirname + '/views/contact-me.html', 'utf8', function (err, html) {
    res.send(html);
  });
});

app.get('/invoke/*', function(req, res) {
  fs.readFile(__dirname + '/views/404.html', 'utf8', function (err, html) {
    res.send(html);
  });
});

app.get('*', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

/**
 * Mailer
 */

app.post('/send-mail', [
  body('femail')
  .isEmail()
  .normalizeEmail(),
  body('fname')
  .not().isEmpty()
  .trim()
  .escape(),
  body('fmessage')
  .not().isEmpty()
  .trim()
  .escape()
], (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {fname, femail, fmessage} = req.body;

    const transporter = nodemailer.createTransport({
      service: 'Mailjet',
      auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS
      }
    });

    var message = {
    from: '"Kyle Wetton" <noreply@kwetton.dev>',
    to: 'kylewetton@me.com',
    subject: 'Portfolio message',
    html: `
      <p>${fname}</p>
      <p>${femail}</p>
      <p>${fmessage}</p>
    `
  };
  transporter.sendMail(message, function(error, info){
    if(error){
      console.log('Error', error);
      res.status(503).json({errors: error});
    }else{
      console.log(info);
      res.json({success: info.response});
    };
  });
});

// Start server
app.listen(PORT, function () {
  console.log('Server up and running on ', `http://localhost:${PORT}/`);
});