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
      'Trump says Putin has "gone absolutely"<span id="blank">__</span>"',
    correctAnswer: "Crazy",
    options: ["Insane", "Crazy", "Viral", "Sane"],
    info: "Trump's reaction came after Russia's largest aerial attack on Ukraine.",
    readMore:
      "https://www.hindustantimes.com/world-news/us-news/trump-says-putin-has-gone-absolutely-crazy-considering-more-sanctions-on-russia-101748243693554.html",
    attempted: false,
    correct: false,
  },
  {
    image: trumpImage,
    sentence:
      'White House says Trump was <span id="blank">__</span> with the progress in resolving the Ukraine conflict.',
    correctAnswer: "frustrated",
    options: ["happy", "frustrated", "unbothered", "pleased"],
    info: "Trump has been pushing for direct talks between Russia and Ukraine.",
    readMore:
      "https://www.hindustantimes.com/world-news/trump-pushes-for-direct-talks-with-putin-amid-russia-ukraine-peace-efforts-101747389991792.html",
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
useEffect(() => {
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=G-W8RVWT5WEP`; // GA4 Measurement ID
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "G-XXXXXXXXXX"); // Replace with your GA4 Measurement ID
}, []);

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
        <h1>Instructions for Headlines</h1>
        <div className="instructions">
           <div className="start-box">
          <ul>
            <li>Complete the Headline with the right word based on recent news.</li>
            <li>You have 20 seconds for each question.</li>
          </ul>
        </div>
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
      <div class="game-over-box">
        <h1 className="game-over-text">🎉 Game Over 🎉</h1>
        <p className="final-score">
          You scored: {score} / {questions.length}
        </p>
        </div>
        <button className="button-85" onClick={handleRestart}>
          🔁 Restart Game
        </button>
      </div>
    
    );
  }

  return (
    <div className="container">
      <div className="content-box">
        <h3 className="headline-title">The Headlines</h3>
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
