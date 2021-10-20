const express = require("express");


const app = express();
app.use(express.json());


const quotes = require("./quotes.json");
const lodash = require('lodash');
const quotesWithIdPath = "./quotes-with-id.json";
let quotesWithId = require(quotesWithIdPath);
const fs = require('fs');


const saveToJson = (qs) => {
  fs.writeFileSync(quotesWithIdPath, JSON.stringify(qs, null, 4));
};

const getFromJson = () => JSON.parse(fs.readFileSync(quotesWithIdPath));



app.get("/", function (request, response) {
  response.send("Neill's Quote Server!  Ask me for /quotes/random, or /quotes");
});

//START OF YOUR CODE...
const returnQuotes = (req, res) => {
  res.send(quotes)
}

const returnRandomQuote = (req, res) => {
    res.send(lodash.sample(quotes));
}

const returnQuotesWithId = (req, res) => {
  res.send(quotesWithId)
}

const searchFunction = (req, res) => {
  const searchTerm = req.query.term;
  const match = quotes.filter(q => q.quote.toLowerCase().includes(searchTerm.toLowerCase()) || q.author.toLowerCase().includes(searchTerm.toLowerCase()));
  res.send(match);
}

const getQuoteById = (req, res) => {
  const id = parseInt(req.params.id);
  const quote = quotesWithId.find(q => q.id === id);
  if (quote) {
  res.send(quote)} else {
    res.status(404).send('Not found')
  };
}

const saveQuote = (req, res) => {
  const newQuote = req.body;
  const quotes = getFromJson();
  const sameQuote = quotes.find((q) => q.quote === newQuote.quote);
  if (sameQuote) {
    response
      .status(400)
      .send("A quote with the same content already exists.");
  }
  const maxId = Math.max(...quotes.map((q) => q.id));
  newQuote.id = maxId + 1;
  quotes.push(newQuote);
  saveToJson(quotes);
  quotesWithId = require(quotesWithIdPath);
  res.status(201).send(newQuote);

  
}

const editQuoteById = (request, response) => {
  const quoteId = parseInt(request.params.quoteId);
  const editedQuote = request.body;

  const quotes = getFromJson();
  const jsonQuote = quotes.find((q) => q.id === quoteId);
  jsonQuote.quote = editedQuote.quote;
  jsonQuote.author = editedQuote.author;
  saveToJson(quotes);

  response.status(200).send(editedQuote);
};

const deleteQuoteById = (request, response) => {
  const quoteId = parseInt(request.params.quoteId);

  let quotes = getFromJson();
  const jsonQuote = quotes.find((q) => q.id === quoteId);
  if (jsonQuote) {
    quotes = quotes.filter((q) => q.id != quoteId);
    saveToJson(quotes);
    response.status(200).send(jsonQuote);
  } else {
    response.status(404).send("Did not find quote with id " + quoteId);
  }
};

//app.get('/quotes', returnQuotes);
app.get('/quotes/random', returnRandomQuote);
app.get('/quotes/search', searchFunction);
app.get('/quotes', returnQuotesWithId);
app.get('/quotes/:id', getQuoteById);
app.post('/quotes', saveQuote);
app.put('/quotes/:quoteId', editQuoteById);
app.delete('/quotes/:quoteId', deleteQuoteById);


//...END OF YOUR CODE

//You can use this function to pick one element at random from a given array
//example: pickFromArray([1,2,3,4]), or
//example: pickFromArray(myContactsArray)
//
// function pickFromArray(arr) {
//   return arr[Math.floor(Math.random() * arr.length)];
// }

//Start our server so that it listens for HTTP requests!
let port = 5000;

app.listen( port, function () {
  console.log("Your app is listening on port " + port);
});
