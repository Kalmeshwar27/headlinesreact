// ... your imports (unchanged)
import React, { useState, useEffect } from "react";
import "./App.css";
import trumpImage from "./assets/images/trump-speech1.jpg";
import berkshireImage from "./assets/images/berkshire.jpg";
import startSound from "./assets/sounds/start.mp3";
import correctSound from "./assets/sounds/correct.mp3";
import wrongSound from "./assets/sounds/wrong.mp3";
import gameOverSound from "./assets/sounds/game-over-sound.mp3";

// ... audio setup (unchanged)
const startAudio = new Audio(startSound);
const correctAudio = new Audio(correctSound);
const wrongAudio = new Audio(wrongSound);
const gameOverAudio = new Audio(gameOverSound);

// ... questionsData (unchanged)
const questionsData = [
  {
    image: trumpImage,
    sentence:
      'Trump says Putin has "gone absolutely <span id="blank">__</span>".',
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

// ... App component start (unchanged)
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
  const [isFlipping, setIsFlipping] = useState(false); // ✅ ADDED

  const current = questions[currentQ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (submitted || gameOver || !started || current.attempted) return;
    if (timeLeft === 0) {
      handleAutoSubmit();
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, submitted, gameOver, started, current.attempted]);

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
    if (submitted || current.attempted) return;

    const isCorrect = selectedOption === current.correctAnswer;
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
      setIsFlipping(true); // ✅ TRIGGER FLIP
      setTimeout(() => {
        setCurrentQ((q) => q + 1);
        resetState();
        setIsFlipping(false); // ✅ END FLIP
      }, 600); // ✅ match CSS animation duration
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

  const handleRestart = () => {
    setQuestions(questionsData.map((q) => ({ ...q, attempted: false, correct: false })));
    setScore(0);
    setGameOver(false);
    setCurrentQ(0);
    setStarted(false);
    setSubmitted(false);
    setSelected("");
    setTimeLeft(20);
  };

  // ... your render code (loading, start screen, game over screen)


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
        <div className="start-box">
          <h1>The Headlines</h1>
          <h2>Instructions</h2>
          <div className="instructions">
            <ul>
              <li>Complete the Headline with the right word based on recent news.</li>
              <li>You have 20 seconds for each question.</li>
            </ul>
          </div>
          <button className="button-85" onClick={handleStart}>
            Start Game
          </button>
        </div>
      </div>
    );
  }
  if (gameOver) return (<div className="game-over-screen"><div className="game-over-box"><h1 className="game-over-text">🎉 Game Over 🎉</h1><p className="final-score">You scored: {score} / {questions.length}</p></div><button className="button-85" onClick={handleRestart}>🔁 Restart Game</button></div>);

 return (
    <div className="main-wrapper">
      {/* The 'container' will now be the flipping element */}
      <div key={currentQ} className={`container ${isFlipping ? "flip" : ""}`}>
        {/* Your previous 'background-flip' div is now redundant if container itself flips */}
        {/* <div className="background-flip" /> */}

        <div className="content-box"> {/* This content box will now be inside the flipping container */}
          <h3 className="headline-title">The Headlines</h3>
          <div className="headline-header"><div>Business</div><div>May 2025</div></div>
          <div className="info-bar"><span>Score: {score}</span><span>Time: {timeLeft}s</span></div>

          {/* The content that appears on the page */}
          <div className="content"> {/* This 'content' div will contain the actual question and options */}
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
              <div className="options">
                {current.options.map((option) => {
                  const isSelected = selected === option;
                  const isCorrect = submitted && option === current.correctAnswer;
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
                    <a href={current.readMore} target="_blank" rel="noopener noreferrer">
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
          </div> {/* End .content */}
        </div> {/* End .content-box */}
      </div> {/* End .container.flip */}
    </div>
  );
}

export default App;