import { useState, useEffect } from "react";
import "./QuizManager.css";

// Định nghĩa danh sách các file quiz có sẵn
const QUIZ_FILES = [
    {
        id: "listening_part1",
        name: "Listening - Part 1",
        path: "/data/listening/listening_part1.json",
        category: "listening",
    },
    {
        id: "listening_part2",
        name: "Listening - Part 2",
        path: "/data/listening/listening_part2.json",
        category: "listening",
    },
    {
        id: "listening_part3",
        name: "Listening - Part 3",
        path: "/data/listening/listening_part3.json",
        category: "listening",
    },
    {
        id: "reading_passage1",
        name: "Reading - Passage 1",
        path: "/data/reading/reading_passsge1.json",
        category: "reading",
    },
    {
        id: "reading_passage2",
        name: "Reading - Passage 2",
        path: "/data/reading/reading_passsge2.json",
        category: "reading",
    },
    {
        id: "reading_passage3",
        name: "Reading - Passage 3",
        path: "/data/reading/reading_passsge3.json",
        category: "reading",
    },
    {
        id: "reading_passage4",
        name: "Reading - Passage 4",
        path: "/data/reading/reading_passsge4.json",
        category: "reading",
    },
    {
        id: "reading_passage5",
        name: "Reading - Passage 5",
        path: "/data/reading/reading_passsge5.json",
        category: "reading",
    },
    {
        id: "reading_passage6",
        name: "Reading - Passage 6",
        path: "/data/reading/reading_passsge6.json",
        category: "reading",
    },
];

function QuizManager({ onLoadQuiz, onBackToHome }) {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [quizDetails, setQuizDetails] = useState({});
    const [loadingDetails, setLoadingDetails] = useState({});
    const [expandedQuiz, setExpandedQuiz] = useState(null);

    // Load thông tin số lượng câu hỏi cho mỗi quiz
    useEffect(() => {
        QUIZ_FILES.forEach((quiz) => {
            if (!quizDetails[quiz.id]) {
                loadQuizDetails(quiz);
            }
        });
    }, []);

    const loadQuizDetails = async (quiz) => {
        setLoadingDetails((prev) => ({ ...prev, [quiz.id]: true }));
        try {
            const response = await fetch(quiz.path);
            if (response.ok) {
                const data = await response.json();
                setQuizDetails((prev) => ({
                    ...prev,
                    [quiz.id]: {
                        questionCount: data.length,
                        questions: data,
                    },
                }));
            }
        } catch (error) {
            console.error(`Lỗi khi tải ${quiz.name}:`, error);
        } finally {
            setLoadingDetails((prev) => ({ ...prev, [quiz.id]: false }));
        }
    };

    const handleLoadQuiz = async (quiz) => {
        if (quizDetails[quiz.id]?.questions) {
            onLoadQuiz(quizDetails[quiz.id].questions, quiz.name);
        } else {
            try {
                const response = await fetch(quiz.path);
                if (response.ok) {
                    const data = await response.json();
                    onLoadQuiz(data, quiz.name);
                } else {
                    alert(`Không thể tải file: ${quiz.name}`);
                }
            } catch (error) {
                alert(`Lỗi khi tải file: ${error.message}`);
            }
        }
    };

    const toggleExpanded = (quizId) => {
        setExpandedQuiz(expandedQuiz === quizId ? null : quizId);
    };

    const filteredQuizzes =
        selectedCategory === "all"
            ? QUIZ_FILES
            : QUIZ_FILES.filter((quiz) => quiz.category === selectedCategory);

    const getCategoryStats = () => {
        const stats = {
            all: QUIZ_FILES.length,
            listening: QUIZ_FILES.filter((q) => q.category === "listening")
                .length,
            reading: QUIZ_FILES.filter((q) => q.category === "reading").length,
        };
        return stats;
    };

    const stats = getCategoryStats();

    return (
        <div className="quiz-manager">
            <div className="quiz-manager-header">
                <h2>📚 Quản Lý Bài Trắc Nghiệm</h2>
                <button
                    className="btn btn-secondary btn-back"
                    onClick={onBackToHome}
                >
                    ← Quay lại
                </button>
            </div>

            <div className="category-filter">
                <button
                    className={`filter-btn ${
                        selectedCategory === "all" ? "active" : ""
                    }`}
                    onClick={() => setSelectedCategory("all")}
                >
                    Tất cả ({stats.all})
                </button>
                <button
                    className={`filter-btn ${
                        selectedCategory === "listening" ? "active" : ""
                    }`}
                    onClick={() => setSelectedCategory("listening")}
                >
                    🎧 Listening ({stats.listening})
                </button>
                <button
                    className={`filter-btn ${
                        selectedCategory === "reading" ? "active" : ""
                    }`}
                    onClick={() => setSelectedCategory("reading")}
                >
                    📖 Reading ({stats.reading})
                </button>
            </div>

            <div className="quiz-grid">
                {filteredQuizzes.map((quiz) => (
                    <div key={quiz.id} className="quiz-card">
                        <div className="quiz-card-header">
                            <h3>
                                {quiz.category === "listening" ? "🎧" : "📖"}{" "}
                                {quiz.name}
                            </h3>
                            <span className="quiz-category">
                                {quiz.category === "listening"
                                    ? "Nghe"
                                    : "Đọc"}
                            </span>
                        </div>

                        <div className="quiz-card-body">
                            {loadingDetails[quiz.id] ? (
                                <p className="quiz-info">Đang tải...</p>
                            ) : quizDetails[quiz.id] ? (
                                <p className="quiz-info">
                                    📝{" "}
                                    {quizDetails[quiz.id].questionCount} câu
                                    hỏi
                                </p>
                            ) : (
                                <p className="quiz-info">Chưa tải</p>
                            )}

                            <div className="quiz-card-actions">
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => handleLoadQuiz(quiz)}
                                >
                                    📥 Tải và làm bài
                                </button>
                                <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => toggleExpanded(quiz.id)}
                                >
                                    {expandedQuiz === quiz.id
                                        ? "Ẩn chi tiết"
                                        : "Xem chi tiết"}
                                </button>
                            </div>
                        </div>

                        {expandedQuiz === quiz.id &&
                            quizDetails[quiz.id]?.questions && (
                                <div className="quiz-details">
                                    <h4>Danh sách câu hỏi:</h4>
                                    <div className="question-list">
                                        {quizDetails[quiz.id].questions.map(
                                            (q, index) => (
                                                <div
                                                    key={index}
                                                    className="question-preview"
                                                >
                                                    <strong>
                                                        Câu {index + 1}:
                                                    </strong>{" "}
                                                    {q.question}
                                                    <div className="answer-count">
                                                        {q.options.length} đáp
                                                        án
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                    </div>
                ))}
            </div>

            {filteredQuizzes.length === 0 && (
                <div className="no-quizzes">
                    <p>Không có bài trắc nghiệm nào trong danh mục này.</p>
                </div>
            )}
        </div>
    );
}

export default QuizManager;
