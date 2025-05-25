import React, { useState, useEffect } from "react";
import "./App.css";
import trumpImage from "./assets/images/trump-speech.jpg";
import berkshireImage from "./assets/images/berkshire.jpg";
import startSound from "./assets/sounds/start.mp3";
import correctSound from "./assets/sounds/correct.mp3";
import wrongSound from "./assets/sounds/wrong.mp3";
import gameOverSound from "./assets/sounds/game-over-sound.mp3";

const startAudio = new Audio(startSound);
const correctAudio = new Audio(correctSound);
const wrongAudio = new Audio(wrongSound);
const gameOverAudio = new Audio(gameOverSound);

const questionsData = [
  {
    image: trumpImage,
    sentence:
      'Donald Trump said he would be "very <span id="blank">__</span>" in negotiations with China.',
    correctAnswer: "tough",
    options: ["friendly", "tough", "soft", "diplomatic"],
    info: "Donald Trump stated he plans to approach trade negotiations with China in a more cooperative manner. He emphasized being very nice during future talks to ease tensions.",
    readMore:
      "https://www.cnbctv18.com/world/trump-says-he-will-be-very-nice-to-china-in-trade-talks-ws-l-19592769.htm",
    attempted: false,
    correct: false,
  },
  {
    image: berkshireImage,
    sentence:
      'Warren Buffett announced he will step down as CEO of <span id="blank">__</span> by year-end.',
    correctAnswer: "Berkshire Hathaway",
    options: ["Berkshire Hathaway", "Apple", "Amazon", "Tesla"],
    info: "Warren Buffett announced that he would step down from Berkshire Hathaway, the company he led for decades.",
    readMore:
      "https://www.bbc.com/news/articles/cqj4nev7p70o",
    attempted: false,
    correct: false,
  },
];

function App() {
  const [questions, setQuestions] = useState(questionsData);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [gameOver, setGameOver] = useState(false);

  const current = questions[currentQ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (submitted || gameOver || !started || current.attempted) return;
    if (timeLeft === 0) {
      handleSubmit(true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, submitted, gameOver, started, current.attempted]);

  const handleStart = () => {
    startAudio.play();
    setStarted(true);
  };

  const handleSubmit = (isTimeout = false) => {
    const isCorrect = selected === current.correctAnswer;

    const updatedQuestions = [...questions];
    const updatedQ = { ...updatedQuestions[currentQ] };

    if (!updatedQ.attempted) {
      updatedQ.attempted = true;
      updatedQ.correct = isCorrect;

      if (isCorrect) {
        correctAudio.play();
        setScore((score) => score + 1);
      } else {
        wrongAudio.play();
      }

      updatedQuestions[currentQ] = updatedQ;
      setQuestions(updatedQuestions);
    }

    setSubmitted(true);
  };

  const nextQuestion = () => {
    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1);
      resetState();
    } else {
      setGameOver(true);
      gameOverAudio.play();
    }
  };

  const previousQuestion = () => {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
      resetState();
    }
  };

  const resetState = () => {
    setSubmitted(false);
    setSelected("");
    setTimeLeft(20);
  };

  const filledSentence = current.sentence.replace(
    /<span id="blank">.*?<\/span>/,
    `<span id="blank" class="correct">${current.correctAnswer}</span>`
  );

  const speakHeadline = () => {
    let sentenceText;

    if (submitted || current.attempted) {
      sentenceText = current.sentence
        .replace(/<[^>]+>/g, "")
        .replace("_____", current.correctAnswer);
    } else {
      sentenceText = current.sentence.replace(/<[^>]+>/g, "").replace("_____", "blank");
    }

    const utterance = new SpeechSynthesisUtterance(sentenceText);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };

  const handleRestart = () => {
    setQuestions(questionsData);
    setScore(0);
    setGameOver(false);
    setCurrentQ(0);
    setStarted(false);
    setSubmitted(false);
    setSelected("");
    setTimeLeft(20);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="start-screen">
        <h1>The Headlines Game</h1>
        <div className="instructions">
          <h2>How to Play</h2>
          <ul>
            <li>🔊 Listen to the headline.</li>
            <li>🤔 Choose the correct word to complete it.</li>
            <li>⏳ You have 20 seconds per question.</li>
            <li>✅ Get instant feedback.</li>
            <li>🏁 See your score at the end.</li>
          </ul>
        </div>
        <p>Test your knowledge with breaking news headlines!</p>
        <button className="button-85" onClick={handleStart}>
          ▶️ Start Game
        </button>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="game-over-screen">
        <h1 className="game-over-text">🎉 Game Over 🎉</h1>
        <p className="final-score">
          You scored: {score} / {questions.length}
        </p>
        <button className="button-85" onClick={handleRestart}>
          🔁 Restart Game
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="content-box">
        <h1 className="headline-title">The Headlines</h1>
        <div className="headline-header">
          <div>Business</div>
          <div>May 2025</div>
        </div>

        <div className="info-bar">
          <span>Score: {score}</span>
          <span>Time Left: {timeLeft}s</span>
        </div>

        <div className="content">
          <div className="image-frame">
            <img src={current.image} alt="News" className="news-image" />
          </div>
          <div className="headline-box">
            <p
              className="headline-text"
              dangerouslySetInnerHTML={{
                __html: submitted || current.attempted ? filledSentence : current.sentence,
              }}
            />
            {/* <button className="speak-btn" onClick={speakHeadline}>
              🔊 Speak Headline
            </button> */}

            <div className="options">
              {current.options.map((option) => {
                const isSelected = selected === option;
                const isCorrect = submitted && option === current.correctAnswer;
                const isWrong = submitted && isSelected && option !== current.correctAnswer;

                let className = "option-btn";
                if (submitted || current.attempted) {
                  if (isCorrect) className += " correct";
                  else if (isWrong) className += " wrong";
                } else if (isSelected) {
                  className += " selected";
                }

                return (
                  <button
                    key={option}
                    className={className}
                    onClick={() => !submitted && setSelected(option)}
                    disabled={submitted || current.attempted}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            <div className="submit-container">
              <button
                className="submit-btn"
                onClick={() => handleSubmit(false)}
                disabled={!selected || submitted || current.attempted}
              >
                Submit
              </button>
            </div>

            {(submitted || current.attempted) && (
              <>
                <div className="info-text">
                  <p>{current.info}</p>
                  <a href={current.readMore} target="_blank" rel="noopener noreferrer">
                    Read More
                  </a>
                </div>

                <div className="nav-buttons">
                  <button onClick={previousQuestion} disabled={currentQ === 0}>
                    ◀️ Previous
                  </button>
                  <button onClick={nextQuestion}>
                    {currentQ + 1 === questions.length ? "Finish ▶️" : "Next ▶️"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
