import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLeaf, FaCheckCircle, FaTimesCircle, FaTrophy } from "react-icons/fa";

function Quiz() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const questions = [
    {
      question: "Quel format d'image est le plus écologique pour le web ?",
      answers: [
        { text: "PNG non compressé", correct: false },
        { text: "WebP ou AVIF", correct: true },
        { text: "JPEG haute qualité", correct: false },
        { text: "GIF animé", correct: false },
      ],
    },
    {
      question: "Quelle est la meilleure pratique pour réduire l'impact écologique d'un site ?",
      answers: [
        { text: "Utiliser beaucoup d'animations", correct: false },
        { text: "Minifier et compresser les fichiers CSS/JS", correct: true },
        { text: "Charger toutes les ressources en même temps", correct: false },
        { text: "Utiliser des polices personnalisées multiples", correct: false },
      ],
    },
    {
      question: "Qu'est-ce que le lazy loading ?",
      answers: [
        { text: "Charger toutes les images immédiatement", correct: false },
        { text: "Charger les images uniquement quand elles sont visibles", correct: true },
        { text: "Désactiver toutes les images", correct: false },
        { text: "Utiliser des images très lourdes", correct: false },
      ],
    },
    {
      question: "Quel impact a un site lourd sur l'environnement ?",
      answers: [
        { text: "Aucun impact", correct: false },
        { text: "Consomme plus d'énergie serveur et client", correct: true },
        { text: "Améliore la performance", correct: false },
        { text: "Réduit les émissions de CO2", correct: false },
      ],
    },
    {
      question: "Quelle technique permet de réduire le nombre de requêtes HTTP ?",
      answers: [
        { text: "Créer plus de fichiers séparés", correct: false },
        { text: "Combiner et minifier les fichiers CSS/JS", correct: true },
        { text: "Charger toutes les bibliothèques", correct: false },
        { text: "Utiliser beaucoup de CDN différents", correct: false },
      ],
    },
  ];

  const handleAnswer = (answerIndex) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answerIndex);
    const isCorrect = questions[currentQuestion].answers[answerIndex].correct;

    if (isCorrect) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const getScoreLevel = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return { level: "A", message: "Excellent ! Vous maîtrisez le Green Coding", color: "text-green-400" };
    if (percentage >= 60) return { level: "B", message: "Très bien ! Quelques notions à approfondir", color: "text-blue-400" };
    if (percentage >= 40) return { level: "C", message: "Pas mal ! Continuez à apprendre", color: "text-yellow-400" };
    return { level: "D", message: "À améliorer ! Relisez les conseils", color: "text-orange-400" };
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  if (showResult) {
    const scoreInfo = getScoreLevel();
    return (
      <>
        <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-base-200 via-base-300 to-base-200">
          <div className="w-full max-w-lg bg-base-300/90 backdrop-blur-sm p-8 sm:p-10 rounded-3xl shadow-2xl border border-base-content/10 flex flex-col items-center gap-6 animate-fade-in">
            <div className="p-4 bg-primary/20 rounded-full">
              <FaTrophy className="text-5xl text-primary" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-center text-white">
              Quiz terminé !
            </h2>

            <div className="text-center space-y-2">
              <p className="text-4xl font-bold text-white">
                {score} / {questions.length}
              </p>
              <p className={`text-xl font-semibold ${scoreInfo.color}`}>
                Niveau {scoreInfo.level}
              </p>
              <p className="text-base text-base-content/70 max-w-md">
                {scoreInfo.message}
              </p>
            </div>

            <div className="w-full space-y-3 mt-4">
              <button
                className="btn btn-primary w-full hover:scale-105 transition-all duration-200 shadow-lg"
                onClick={resetQuiz}
              >
                Refaire le quiz
              </button>
              <button
                className="btn btn-ghost w-full text-base-content/60 hover:text-base-content"
                onClick={() => navigate("/")}
              >
                Retour à l'accueil
              </button>
            </div>
          </div>
        </main>

        <footer className="bg-neutral-950 text-center font-extralight p-4 sm:p-6 text-white">
          <p>Copyright &copy; 2025 SMOOD Tech</p>
        </footer>
      </>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <>
      <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-base-200 via-base-300 to-base-200">
        <div className="w-full max-w-2xl bg-base-300/90 backdrop-blur-sm p-8 sm:p-10 rounded-3xl shadow-2xl border border-base-content/10 flex flex-col gap-6 animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <FaLeaf className="text-primary text-2xl" />
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Quiz Green Coding
              </h2>
            </div>
            <span className="text-base-content/60 text-sm">
              {currentQuestion + 1} / {questions.length}
            </span>
          </div>

          <div className="w-full bg-base-200 rounded-full h-2 mb-4">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl sm:text-2xl font-semibold text-white">
              {question.question}
            </h3>

            <div className="space-y-3">
              {question.answers.map((answer, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = answer.correct;
                const showFeedback = selectedAnswer !== null;

                let buttonClass = "btn w-full text-left justify-start hover:scale-[1.02] transition-all duration-200";
                let bgClass = "";
                
                if (showFeedback) {
                  if (isCorrect) {
                    buttonClass += " border-2 border-green-500";
                    bgClass = "bg-green-500/20 text-green-100";
                  } else if (isSelected && !isCorrect) {
                    buttonClass += " border-2 border-red-500";
                    bgClass = "bg-red-500/20 text-red-100";
                  } else {
                    buttonClass += " border border-base-content/20";
                    bgClass = "bg-base-100/30 text-base-content/40";
                  }
                } else {
                  if (isSelected) {
                    buttonClass += " border-2 border-primary";
                    bgClass = "bg-primary/20 text-primary-content";
                  } else {
                    buttonClass += " border border-base-content/30";
                    bgClass = "bg-base-100/50 text-white hover:bg-base-100/70";
                  }
                }

                return (
                  <button
                    key={index}
                    className={`${buttonClass} ${bgClass}`}
                    onClick={() => handleAnswer(index)}
                    disabled={selectedAnswer !== null}
                  >
                    <div className="flex items-center gap-3 w-full">
                      {showFeedback && isCorrect && (
                        <FaCheckCircle className="text-xl flex-shrink-0 text-green-400" />
                      )}
                      {showFeedback && isSelected && !isCorrect && (
                        <FaTimesCircle className="text-xl flex-shrink-0 text-red-400" />
                      )}
                      <span className="flex-1 font-medium">{answer.text}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            className="btn btn-ghost btn-sm text-base-content/60 hover:text-base-content mt-4"
            onClick={() => navigate("/")}
          >
            Quitter le quiz
          </button>
        </div>
      </main>

      <footer className="bg-neutral-950 text-center font-extralight p-4 sm:p-6 text-white">
        <p>Copyright &copy; 2025 SMOOD Tech</p>
      </footer>
    </>
  );
}

export default Quiz;

