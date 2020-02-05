/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

const http = require('http').Server(app);

require('pug');

const logger = t => console.log(t);

app.set('PORT', process.env.PORT || 3000);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
// app.use(express.json());
// app.use(express.urlencoded());

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('index');
});

app.use(express.static('www'));

http.listen(app.get('PORT'), (error) => {
  if (error) {
    logger('Server started with an error', error);
    process.exit(1);
  }
  logger(`Server started and is listening at:${app.get('PORT')}`);
});
