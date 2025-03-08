const express = require("express");
const router = express.Router();
const Question = require("../models/Question");
const { v4: uuidv4 } = require("uuid");

const { GoogleGenerativeAI } = require("@google/generative-ai");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

router.get("/start-quiz", async (req, res) => {
  try {
    const apiResponse = await fetch(
      "https://opentdb.com/api.php?amount=15&type=multiple&category=18"
    );
    const apiData = await apiResponse.json();
    const quizQuestions = apiData.results;
    // console.log(quizQuestions);

    const formattedQuizQuestions = quizQuestions.map((question) => {
      const questionId = uuidv4();
      return {
        _id: questionId,
        type: question.type,
        difficulty: question.difficulty,
        category: question.category,
        question: question.question,
        correctAnswer: question.correct_answer,
        options: shuffleArray([
          question.correct_answer,
          ...question.incorrect_answers,
        ]),
      };
    });

    // console.log(formattedQuizQuestions)
    await Question.insertMany(formattedQuizQuestions);
    const responseQuestions = formattedQuizQuestions.map(
      ({ _id, type, difficulty, category, question, options }) => ({
        _id,
        type,
        difficulty,
        category,
        question,
        options,
      })
    );
    res.send(responseQuestions);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/results", async (req, res) => {
  try {
    const answerSheet = req.body.quiz;
    let score = 0;
    const report = [];

    for (const answer of answerSheet) {
      const question = await Question.findById(answer._id);

      if (question.correctAnswer === answer.answer) {
        score++;
      }
      report.push({
        question: question.question,
        correctAnswer: question.correctAnswer,
        selectedAnswer: answer.answer,
      });
    }

    const prompt =
      "Analyze the following results for the quiz and provide a brief 2 line summary suggesting topics for revision" +
      JSON.stringify(report);

    const result = await model.generateContent(prompt);

    res.send({ score, report,AiGeneratedReport:result.response.text() });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

module.exports = router;
