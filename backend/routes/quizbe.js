const data = require("./data.json");

function quiz(app) {
  let score = 0;
  let isGameOver = false;
  let callUsed = false;
  let crowdUsed = false;
  let halfUsed = false;
  let dataCopy = [...data]; //later on I'm using splice - so I need copy to don't interrupt with main db
  let newQuestion; //declaration to have this variable in global scope

  //main rules - check if win/lost and getting new question
  app.get("/question", (req, res) => {
    if (score === data.length) {
      res.json({
        winner: true,
        score
      });
    } else if (isGameOver) {
      res.json({ loser: true });
    } else {
      newQuestion = dataCopy.splice(
        Math.floor(Math.random() * dataCopy.length),
        1
      );
      const { question, answers } = newQuestion[0];
      res.json({
        question,
        answers,
        score
      });
    }
  });

  //posting and checking if answer is correct
  app.post("/answer/:index", (req, res) => {
    if (isGameOver) {
      res.json({ loser: true });
    }
    const { index } = req.params;
    const question = newQuestion[0];
    const isCorrect = question.correctAnswer === parseInt(index);

    if (isCorrect) {
      score++;
    } else {
      isGameOver = true;
    }

    res.json({ correct: isCorrect, score });
  });

  //'call to a friend' lifeline
  app.get("/rescue/call", (req, res) => {
    if (callUsed) {
      return res.json({
        text: "You have already used this Lifeline."
      });
    }
    callUsed = true;
    const doesFriendKnow = Math.random() < 0.7; //we decide that friend had 70% to know the answer
    const question = newQuestion[0];
    res.json({
      text: doesFriendKnow
        ? `Hmmm... I think the correct answer is ${
            question.answers[question.correctAnswer]
          }`
        : "I'm sorry but I don't know the correct answer."
    });
  });

  //'fifty fifty' lifeline
  app.get("/rescue/half", (req, res) => {
    if (halfUsed) {
      return res.json({ text: "You have already used this Lifeline." });
    }
    halfUsed = true;
    const question = newQuestion[0];
    const answersCopy = question.answers.filter(
      (answer, index) => index !== question.correctAnswer
    );
    answersCopy.splice(Math.floor(Math.random() * answersCopy.length), 1);
    res.json({
      answersToRemove: answersCopy
    });
  });

  //'question to the crowd' lifeline
  app.get("/rescue/crowd", (req, res) => {
    if (crowdUsed) {
      return res.json({ text: "You have already used this Lifeline." });
    }
    crowdUsed = true;

    const chart = [10, 20, 30, 40];

    for (let i = chart.length - 1; i > 0; i--) {
      const change = Math.floor(Math.random() * 20 - 10);
      chart[i] += change;
      chart[i - 1] -= change;
    }

    const question = newQuestion[0];
    const { correctAnswer } = question;

    [chart[3], chart[correctAnswer]] = [chart[correctAnswer], chart[3]];
    res.json({ chart });
  });
}

module.exports = quiz;
