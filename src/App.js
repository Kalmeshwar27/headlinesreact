import React, { useState, useEffect } from "react";
import "./App.css";
import startSound from "./assets/sounds/start.mp3";
import correctSound from "./assets/sounds/correct.mp3";
import wrongSound from "./assets/sounds/wrong.mp3";
import gameOverSound from "./assets/sounds/game-over-sound.mp3";



const startAudio = new Audio(startSound);
const correctAudio = new Audio(correctSound);
const wrongAudio = new Audio(wrongSound);
const gameOverAudio = new Audio(gameOverSound);

function App() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [gameOver, setGameOver] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
 
   useEffect(() => {
    fetch('/questions.json')
      .then((res) => res.json())
      .then((data) => {
        const processed = data.data.map((q) => ({
          ...q,
          attempted: false,
          correct: false,
        }));
        setQuestions(processed);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading questions:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (submitted || gameOver || !started || questions.length === 0) return;
    if (timeLeft === 0) {
      handleAutoSubmit();
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, submitted, gameOver, started, questions, currentQ]);

  const handleStart = () => {
    startAudio.play();
    setStarted(true);
  };

  const handleAutoSubmit = () => {
    const updatedQuestions = [...questions];
    const updatedQ = { ...updatedQuestions[currentQ] };

    updatedQ.attempted = true;
    updatedQ.correct = false;

    updatedQuestions[currentQ] = updatedQ;
    wrongAudio.play();
    setQuestions(updatedQuestions);
    setSubmitted(true);
  };

  const handleSubmit = (selectedOption) => {
    if (submitted || questions[currentQ].attempted) return;

    const isCorrect = selectedOption === questions[currentQ].correctAnswer;
    const updatedQuestions = [...questions];
    const updatedQ = { ...updatedQuestions[currentQ] };

    updatedQ.attempted = true;
    updatedQ.correct = isCorrect;

    if (isCorrect) {
      correctAudio.play();
      setScore((s) => s + 1);
    } else {
      wrongAudio.play();
    }

    updatedQuestions[currentQ] = updatedQ;
    setQuestions(updatedQuestions);
    setSelected(selectedOption);
    setSubmitted(true);
  };

  const nextQuestion = () => {
    if (currentQ + 1 < questions.length) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentQ((q) => q + 1);
        resetState();
        setIsFlipping(false);
      }, 600);
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

  const handleRestart = () => {
    setQuestions((prev) =>
      prev.map((q) => ({ ...q, attempted: false, correct: false }))
    );
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
        <h1>The Headlines</h1>
        <div className="start-box">
          <h3>Instructions</h3>
          <div className="instructions">
            <ul>
              <li>Complete the Headline with the 
                   right word based on recent news.</li>
              <li>You have 20 seconds for each question.</li>
            </ul>
          </div>
        </div>
        <button className="button-85" onClick={handleStart}>
           Start
        </button>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="game-over-screen">
        <div className="game-over-box">
          <h1 className="game-over-text"> 🎉 Game Over </h1>
          <p className="final-score">
            You scored: {score} / {questions.length}
          </p>
        </div>
        <button className="button-85" onClick={handleRestart}>
           Restart
        </button>
      </div>
    );
  }
const current = questions[currentQ];

let displaySentence;

if (submitted || current.attempted) {
  // After submit: show correct answer in the blank
  displaySentence = current.sentence.replace(
    /_{2,}/g,
    `<span id="blank" class="correct">${current.correctAnswer}</span>`
  );
} else if (selected) {
  // Before submit: show selected answer in the blank
  displaySentence = current.sentence.replace(
    /_{2,}/g,
    `<span id="blank" class="user-selected">${selected}</span>`
  );
} else {
  // Default: keep blank
  displaySentence = current.sentence;
}



  return (
    <div className="container">
      <div className="content-box">
        <h3 className="headline-title">The Headlines</h3>
        <div className="headline-header">
          <div>Business</div>
          <div>
  {new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'numeric',
    year: 'numeric',
  }).replace(/ /g, '-')}
</div>

        </div>
        <div className="info-bar">
          <span>Score: {score}</span>
          <span>Time: {timeLeft}s</span>
        </div>
        <div key={currentQ} className={`flipper ${isFlipping ? "flip" : ""}`}>
          <div className="content">
      <img 
    src={current.image} 
    alt={`question-${currentQ}`} 
    style={{ width: '125%', height: 'auto', marginBottom: '1rem' }} 
  />
            <div className="headline-box">
              <p
                className="headline-text"
                dangerouslySetInnerHTML={{ __html: displaySentence }}

              />

              <div className="options">
                {current.options.map((option) => {
                  const isSelected = selected === option;
                  const isCorrect =
                    submitted && option === current.correctAnswer;
                  const isWrong = submitted && isSelected && !isCorrect;

                  let className = "option-btn";
                  if (submitted || current.attempted) {
                    if (isCorrect) className += " correct";
                    else if (isWrong) className += " wrong";
                  }

                  return (
                    <button
                      key={option}
                      className={className}
                      onClick={() => handleSubmit(option)}
                      disabled={submitted || current.attempted}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {(submitted || current.attempted) && (
                <>
                  <div className="info-text">
                    <p>{current.info}</p>
                    <a
                      href={current.readMore}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Read More
                    </a>
                  </div>
                  <div className="nav-buttons">
                    <button onClick={nextQuestion}>
                      {currentQ === questions.length - 1 ? "Finish" : "Next"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;
