import { useState } from "react";
import ImportQuestions from "./components/ImportQuestions";
import Quiz from "./components/Quiz";
import Results from "./components/Results";
import QuestionEditor from "./components/QuestionEditor";
import QuizManager from "./components/QuizManager";
import "./App.css";

function App() {
    const [questions, setQuestions] = useState([]);
    const [originalQuestions, setOriginalQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [quizStarted, setQuizStarted] = useState(false);
    const [currentView, setCurrentView] = useState("home"); // 'home', 'editor', 'quiz', 'results', 'manager'
    const [isShuffled, setIsShuffled] = useState(false);
    const [currentQuizName, setCurrentQuizName] = useState("");

    const handleImport = (importedQuestions) => {
        setQuestions(importedQuestions);
        setOriginalQuestions(importedQuestions);
        setCurrentQuestionIndex(0);
        setUserAnswers([]);
        setShowResults(false);
        setQuizStarted(false);
        setCurrentView("home");
        setIsShuffled(false);
    };

    const handleStartQuiz = () => {
        if (questions.length === 0) {
            alert("Vui lòng import hoặc tạo câu hỏi trước!");
            return;
        }
        setQuizStarted(true);
        setCurrentQuestionIndex(0);
        setUserAnswers([]);
        setShowResults(false);
        setCurrentView("quiz");
    };

    const handleAnswer = (answer) => {
        const newAnswers = [...userAnswers];
        newAnswers[currentQuestionIndex] = answer;
        setUserAnswers(newAnswers);
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmit = () => {
        setShowResults(true);
        setCurrentView("results");
    };

    const handleRestart = () => {
        setCurrentQuestionIndex(0);
        setUserAnswers([]);
        setShowResults(false);
        setQuizStarted(false);
        setCurrentView("home");
    };

    const handleQuestionsChange = (updatedQuestions) => {
        setQuestions(updatedQuestions);
        setOriginalQuestions(updatedQuestions);
        setIsShuffled(false);
    };

    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const handleShuffleQuestions = () => {
        if (originalQuestions.length === 0) return;

        // Shuffle câu hỏi
        const shuffledQuestions = shuffleArray(originalQuestions)
            .map((q) => ({
                ...q,
                options: shuffleArray(
                    q.options.map((opt, idx) => ({ text: opt, index: idx }))
                ),
                originalCorrectAnswer: q.correctAnswer,
            }))
            .map((q) => {
                // Tìm vị trí mới của đáp án đúng
                const newCorrectIndex = q.options.findIndex(
                    (opt) => opt.index === q.originalCorrectAnswer
                );
                return {
                    question: q.question,
                    options: q.options.map((opt) => opt.text),
                    correctAnswer: newCorrectIndex,
                };
            });

        setQuestions(shuffledQuestions);
        setIsShuffled(true);
        setUserAnswers([]);
        setCurrentQuestionIndex(0);
    };

    const handleResetShuffle = () => {
        setQuestions(originalQuestions);
        setIsShuffled(false);
        setUserAnswers([]);
        setCurrentQuestionIndex(0);
    };

    const goToEditor = () => {
        setCurrentView("editor");
    };

    const goToHome = () => {
        setCurrentView("home");
        setQuizStarted(false);
        setShowResults(false);
    };

    const goToManager = () => {
        setCurrentView("manager");
    };

    const handleLoadQuizFromManager = (quizData, quizName) => {
        setQuestions(quizData);
        setOriginalQuestions(quizData);
        setCurrentQuizName(quizName);
        setCurrentQuestionIndex(0);
        setUserAnswers([]);
        setShowResults(false);
        setQuizStarted(false);
        setCurrentView("home");
        setIsShuffled(false);
    };

    const calculateScore = () => {
        let correct = 0;
        questions.forEach((question, index) => {
            if (userAnswers[index] === question.correctAnswer) {
                correct++;
            }
        });
        return correct;
    };

    return (
        <div className="app">
            <header className="app-header">
                <h1>🎓 Ứng Dụng Thi Trắc Nghiệm</h1>
                {currentView !== "home" && currentView !== "quiz" && (
                    <button
                        className="btn btn-secondary btn-home"
                        onClick={goToHome}
                    >
                        🏠 Trang chủ
                    </button>
                )}
            </header>

            <main className="app-main">
                {currentView === "home" && (
                    <div className="welcome-screen">
                        {questions.length > 0 && (
                            <div className="quiz-info">
                                <h2>📚 {currentQuizName || "Đã có"} - {questions.length} câu hỏi</h2>
                                <div className="quiz-options">
                                    {!isShuffled ? (
                                        <button
                                            className="btn btn-secondary"
                                            onClick={handleShuffleQuestions}
                                        >
                                            🔀 Ngẫu nhiên câu hỏi & đáp án
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-secondary"
                                            onClick={handleResetShuffle}
                                        >
                                            ↩️ Khôi phục thứ tự gốc
                                        </button>
                                    )}
                                </div>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleStartQuiz}
                                >
                                    Bắt đầu làm bài
                                </button>
                            </div>
                        )}

                        <div className="main-actions">
                            <button
                                className="btn btn-primary btn-large"
                                onClick={goToManager}
                            >
                                📚 Quản lý bài trắc nghiệm
                            </button>
                            <button
                                className="btn btn-primary btn-large"
                                onClick={goToEditor}
                            >
                                ✏️ Chỉnh sửa câu hỏi
                            </button>
                        </div>
                        <ImportQuestions onImport={handleImport} />
                    </div>
                )}

                {currentView === "manager" && (
                    <QuizManager
                        onLoadQuiz={handleLoadQuizFromManager}
                        onBackToHome={goToHome}
                    />
                )}

                {currentView === "editor" && (
                    <QuestionEditor
                        initialQuestions={questions}
                        onQuestionsChange={handleQuestionsChange}
                    />
                )}

                {currentView === "quiz" && (
                    <Quiz
                        question={questions[currentQuestionIndex]}
                        questionNumber={currentQuestionIndex + 1}
                        totalQuestions={questions.length}
                        selectedAnswer={userAnswers[currentQuestionIndex]}
                        onAnswer={handleAnswer}
                        onNext={handleNext}
                        onPrevious={handlePrevious}
                        onSubmit={handleSubmit}
                        isFirst={currentQuestionIndex === 0}
                        isLast={currentQuestionIndex === questions.length - 1}
                    />
                )}

                {currentView === "results" && (
                    <Results
                        questions={questions}
                        userAnswers={userAnswers}
                        score={calculateScore()}
                        onRestart={handleRestart}
                    />
                )}
            </main>
        </div>
    );
}

export default App;
