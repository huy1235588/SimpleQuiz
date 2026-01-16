import { useState, useEffect } from "react";
import "./Quiz.css";

function Quiz({
    question,
    questionNumber,
    totalQuestions,
    selectedAnswer,
    onAnswer,
    onNext,
    onPrevious,
    onSubmit,
    isFirst,
    isLast,
}) {
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        // Trigger animation khi câu hỏi thay đổi
        setIsTransitioning(true);
        const timer = setTimeout(() => {
            setIsTransitioning(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [questionNumber]);

    const handleAnswerClick = (index) => {
        onAnswer(index);

        // Tự động chuyển câu sau 500ms
        setTimeout(() => {
            if (isLast) {
                // Nếu là câu cuối, không tự động chuyển
                return;
            } else {
                onNext();
            }
        }, 500);
    };

    return (
        <div className="quiz">
            <div className="quiz-header">
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{
                            width: `${
                                (questionNumber / totalQuestions) * 100
                            }%`,
                        }}
                    ></div>
                </div>
                <p className="question-counter">
                    Câu {questionNumber} / {totalQuestions}
                </p>
            </div>

            <div
                className={`question-section ${
                    isTransitioning ? "slide-in" : ""
                }`}
            >
                <h2 className="question-text">{question.question}</h2>

                <div className="options-list">
                    {question.options.map((option, index) => (
                        <button
                            key={index}
                            className={`option-button ${
                                selectedAnswer === index ? "selected" : ""
                            }`}
                            onClick={() => handleAnswerClick(index)}
                        >
                            <span className="option-letter">
                                {String.fromCharCode(65 + index)}
                            </span>
                            <span className="option-text">{option}</span>
                            {selectedAnswer === index && (
                                <span className="checkmark">✓</span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className="quiz-navigation">
                <button
                    className="btn btn-secondary"
                    onClick={onPrevious}
                    disabled={isFirst}
                >
                    ← Câu trước
                </button>

                {isLast ? (
                    <button className="btn btn-success" onClick={onSubmit}>
                        Nộp bài
                    </button>
                ) : (
                    <button className="btn btn-primary" onClick={onNext}>
                        Câu tiếp →
                    </button>
                )}
            </div>
        </div>
    );
}

export default Quiz;
