import "./Results.css";

function Results({ questions, userAnswers, score, onRestart }) {
    const percentage = ((score / questions.length) * 100).toFixed(1);

    const getGrade = () => {
        if (percentage >= 90)
            return { grade: "Xuất sắc", emoji: "🏆", color: "gold" };
        if (percentage >= 80)
            return { grade: "Giỏi", emoji: "🌟", color: "green" };
        if (percentage >= 70)
            return { grade: "Khá", emoji: "👍", color: "blue" };
        if (percentage >= 50)
            return { grade: "Trung bình", emoji: "📝", color: "orange" };
        return { grade: "Cần cố gắng", emoji: "💪", color: "red" };
    };

    const result = getGrade();

    return (
        <div className="results">
            <div className="results-header">
                <h2>🎉 Kết Quả Bài Thi</h2>
                <div className={`score-card ${result.color}`}>
                    <div className="score-emoji">{result.emoji}</div>
                    <div className="score-number">
                        {score}/{questions.length}
                    </div>
                    <div className="score-percentage">{percentage}%</div>
                    <div className="score-grade">{result.grade}</div>
                </div>
            </div>

            <div className="results-details">
                <h3>📋 Chi tiết đáp án</h3>
                {questions.map((question, index) => {
                    const userAnswer = userAnswers[index];
                    const isCorrect = userAnswer === question.correctAnswer;

                    return (
                        <div
                            key={index}
                            className={`result-item ${
                                isCorrect ? "correct" : "incorrect"
                            }`}
                        >
                            <div className="result-header">
                                <span className="result-number">
                                    Câu {index + 1}
                                </span>
                                <span
                                    className={`result-status ${
                                        isCorrect ? "correct" : "incorrect"
                                    }`}
                                >
                                    {isCorrect ? "✓ Đúng" : "✗ Sai"}
                                </span>
                            </div>

                            <div className="result-question">
                                {question.question}
                            </div>

                            <div className="result-answers">
                                {userAnswer !== undefined && (
                                    <div
                                        className={`answer ${
                                            isCorrect ? "correct" : "incorrect"
                                        }`}
                                    >
                                        <strong>Bạn chọn:</strong>{" "}
                                        {String.fromCharCode(65 + userAnswer)}.{" "}
                                        {question.options[userAnswer]}
                                    </div>
                                )}
                                {!isCorrect && (
                                    <div className="answer correct">
                                        <strong>Đáp án đúng:</strong>{" "}
                                        {String.fromCharCode(
                                            65 + question.correctAnswer
                                        )}
                                        .{" "}
                                        {
                                            question.options[
                                                question.correctAnswer
                                            ]
                                        }
                                    </div>
                                )}
                                {userAnswer === undefined && (
                                    <div className="answer skipped">
                                        <strong>Chưa trả lời</strong>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="results-actions">
                <button className="btn btn-primary" onClick={onRestart}>
                    🔄 Làm lại
                </button>
            </div>
        </div>
    );
}

export default Results;
