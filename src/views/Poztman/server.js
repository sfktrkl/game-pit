const PORT = process.env.PORT || 3000;

const app = require("express")();
app.use(require("cors")());
app.use(require("body-parser").json());
app.listen(PORT, () => console.log(`Listening on ${PORT}`));

const fs = require("fs");
const data = fs.readFileSync(require("path").join(__dirname, "words.json"));
let words = JSON.parse(data);

function updateFile(updatedWords) {
  // 2 as indent.
  words = updatedWords;
  let data = JSON.stringify(words, null, 2);
  fs.writeFile("words.json", data, () => {});
}

function print(request, response) {
  response.send("I love you.");
}
app.get("/", print);
app.get("/print", print);

app.get("/print/:word", function(request, response) {
  let data = request.params;
  let word = data.word;
  let reply = "";
  for (let i = 0; i < words[word]; i++) reply += "I love " + word + ".<br>";
  response.send(reply);
});

app.get("/all", function(request, response) {
  response.send(words);
});

function addWord(words, word, score) {
  let reply = { word: word };
  if (isFinite(score)) {
    if (words[word]) words[word] += score;
    else words[word] = score;

    // Do not allow negative numbers and put a maximum limit
    // to a number like 1000, since they can be printed.
    if (words[word] <= 0) {
      delete words[word];
      reply.message = "Lower limit reached, word deleted.";
    } else if (words[word] >= 1000) {
      words[word] = 1000;
      reply.score = words[word];
      reply.message = "Upper limit reached.";
    } else {
      reply.score = words[word];
    }
    reply.status = "Success";
  } else {
    reply.input = data.score;
    reply.status = "Fail: Parameter is not a number.";
  }
  return { reply: reply, updatedWords: words };
}

function updateWord(request, response) {
  let data = request.params;
  let word = data.word;

  let score = data.score;
  // Parameter may not be entered, then just add 1
  if (!score) score = 1;
  // Or parameter may not be a number (invalid entry)
  else score = Number(data.score);

  // For subtract, make value negative
  if (request.route.path == "/subtract/:word/:score?") score *= -1;

  // Only update the file when reply status is "Success"
  // If addWord sends a reply with a "Fail" status,
  // it will not affect the word score.
  let result = addWord(words, word, score);
  if (result.reply.status == "Success") updateFile(result.updatedWords);

  response.send(result.reply);
}
app.get("/add/:word/:score?", updateWord);
app.get("/subtract/:word/:score?", updateWord);

app.get("/search/:word", function(request, response) {
  let data = request.params;
  let word = data.word;

  let reply = { word: word };
  if (words[word]) {
    reply.score = words[word];
    reply.status = "Found";
  } else {
    reply.status = "Not Found";
  }
  response.send(reply);
});

function createUpdateWordsResponse(text, wordsList, updatedWords) {
  // If any of the words is failed, also send response
  // with "Fail" status
  let status = "Success";
  for (let word of wordsList) if (word.status != "Success") status = "Fail";

  // Only update the file when reply status is "Success"
  if (status == "Success") updateFile(updatedWords);

  return {
    text: text,
    words: wordsList,
    status: status,
  };
}

function updateWords(request, response) {
  let text = request.body.text;
  // Split for anything which is not letter or a number
  let data = text.split(/\W+/);

  let score = 1;
  // For subtract, make value negative
  if (request.route.path == "/subtractWords") score = -1;

  // Add each word one by one
  let wordsList = [];
  let updatedWords = words;
  for (let word of data) {
    if (word) {
      // Since we are adding words with a default score
      // which is 1 or -1, reply will have always "Success" status.
      // So, there is no need to worry about addition will fail or not.
      let result = addWord(updatedWords, word, score);
      updatedWords = result.updatedWords;
      wordsList.push(result.reply);
    }
  }

  response.send(createUpdateWordsResponse(text, wordsList, updatedWords));
}
app.post("/addWords", updateWords);
app.post("/subtractWords", updateWords);

function updateWordsWithTable(request, response) {
  let text = request.body.text;
  // Split for anything which is not letter or a number
  let data = text.split(/\W+/);

  let multiplier = 1;
  // For subtract, make value negative
  if (request.route.path == "/subtractTable") multiplier = -1;

  // Add each word one by one
  let wordsList = [];
  // Table may contain scores which may not be allowed.
  // Hence replies of the words may return a "Fail" status.
  // So, do not update the words but to be able to show
  // the replies for each word which is given by the table
  // try adding them to a clone object of the words.
  // So, it will be possible trying to add each word without
  // broking the original and return a response which shows
  // which words are failed to added.
  let updatedWords = Object.assign({}, words); // Shallow copy should be enough
  for (let i = 0; i < data.length; i += 2) {
    let word = data[i];
    let score = data[i + 1];
    if (word) {
      let result = addWord(updatedWords, word, score * multiplier);
      updatedWords = result.updatedWords;
      wordsList.push(result.reply);
    }
  }

  response.send(createUpdateWordsResponse(text, wordsList, updatedWords));
}
app.post("/addTable", updateWordsWithTable);
app.post("/subtractTable", updateWordsWithTable);

export default app;
