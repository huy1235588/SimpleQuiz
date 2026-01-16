import { useState } from "react";
import ImportQuestions from "./components/ImportQuestions";
import Quiz from "./components/Quiz";
import Results from "./components/Results";
import QuestionEditor from "./components/QuestionEditor";
import "./App.css";

function App() {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [quizStarted, setQuizStarted] = useState(false);
    const [currentView, setCurrentView] = useState("home"); // 'home', 'editor', 'quiz', 'results'

    const handleImport = (importedQuestions) => {
        setQuestions(importedQuestions);
        setCurrentQuestionIndex(0);
        setUserAnswers([]);
        setShowResults(false);
        setQuizStarted(false);
        setCurrentView("home");
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
    };

    const goToEditor = () => {
        setCurrentView("editor");
    };

    const goToHome = () => {
        setCurrentView("home");
        setQuizStarted(false);
        setShowResults(false);
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
                        {questions.length === 0 ? (
                            <ImportQuestions onImport={handleImport} />
                        ) : (
                            <div className="quiz-info">
                                <h2>📚 Đã có {questions.length} câu hỏi</h2>
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
                                onClick={goToEditor}
                            >
                                ✏️ Chỉnh sửa câu hỏi
                            </button>
                        </div>
                    </div>
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
