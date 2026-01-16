import { useState } from "react";
import "./QuestionEditor.css";

function QuestionEditor({ initialQuestions = [], onQuestionsChange }) {
    const [questions, setQuestions] = useState(initialQuestions);
    const [editingIndex, setEditingIndex] = useState(null);

    const addNewQuestion = () => {
        const newQuestion = {
            question: "",
            options: ["", "", "", ""],
            correctAnswer: 0,
        };
        setQuestions([...questions, newQuestion]);
        setEditingIndex(questions.length);
    };

    const deleteQuestion = (index) => {
        if (window.confirm("Bạn có chắc muốn xóa câu hỏi này?")) {
            const newQuestions = questions.filter((_, i) => i !== index);
            setQuestions(newQuestions);
            if (onQuestionsChange) onQuestionsChange(newQuestions);
            if (editingIndex === index) setEditingIndex(null);
        }
    };

    const updateQuestion = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        setQuestions(newQuestions);
        if (onQuestionsChange) onQuestionsChange(newQuestions);
    };

    const updateOption = (questionIndex, optionIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].options[optionIndex] = value;
        setQuestions(newQuestions);
        if (onQuestionsChange) onQuestionsChange(newQuestions);
    };

    const addOption = (questionIndex) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].options.push("");
        setQuestions(newQuestions);
        if (onQuestionsChange) onQuestionsChange(newQuestions);
    };

    const deleteOption = (questionIndex, optionIndex) => {
        const newQuestions = [...questions];
        if (newQuestions[questionIndex].options.length <= 2) {
            alert("Phải có ít nhất 2 đáp án");
            return;
        }
        newQuestions[questionIndex].options.splice(optionIndex, 1);
        // Adjust correctAnswer if needed
        if (
            newQuestions[questionIndex].correctAnswer >=
            newQuestions[questionIndex].options.length
        ) {
            newQuestions[questionIndex].correctAnswer =
                newQuestions[questionIndex].options.length - 1;
        }
        setQuestions(newQuestions);
        if (onQuestionsChange) onQuestionsChange(newQuestions);
    };

    const moveQuestion = (index, direction) => {
        if (
            (direction === "up" && index === 0) ||
            (direction === "down" && index === questions.length - 1)
        ) {
            return;
        }

        const newQuestions = [...questions];
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        [newQuestions[index], newQuestions[targetIndex]] = [
            newQuestions[targetIndex],
            newQuestions[index],
        ];
        setQuestions(newQuestions);
        if (onQuestionsChange) onQuestionsChange(newQuestions);

        if (editingIndex === index) {
            setEditingIndex(targetIndex);
        } else if (editingIndex === targetIndex) {
            setEditingIndex(index);
        }
    };

    const exportToJSON = () => {
        const dataStr = JSON.stringify(questions, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `questions-${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const exportToCSV = () => {
        let csv = "Question,Option1,Option2,Option3,Option4,CorrectAnswer\n";

        questions.forEach((q) => {
            const row = [
                `"${q.question.replace(/"/g, '""')}"`,
                `"${q.options[0]?.replace(/"/g, '""') || ""}"`,
                `"${q.options[1]?.replace(/"/g, '""') || ""}"`,
                `"${q.options[2]?.replace(/"/g, '""') || ""}"`,
                `"${q.options[3]?.replace(/"/g, '""') || ""}"`,
                q.correctAnswer,
            ];
            csv += row.join(",") + "\n";
        });

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `questions-${Date.now()}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const duplicateQuestion = (index) => {
        const newQuestion = {
            ...questions[index],
            options: [...questions[index].options],
        };
        const newQuestions = [...questions];
        newQuestions.splice(index + 1, 0, newQuestion);
        setQuestions(newQuestions);
        if (onQuestionsChange) onQuestionsChange(newQuestions);
    };

    return (
        <div className="question-editor">
            <div className="editor-header">
                <h2>✏️ Chỉnh Sửa Câu Hỏi</h2>
                <div className="editor-actions">
                    <button
                        className="btn btn-success"
                        onClick={addNewQuestion}
                    >
                        ➕ Thêm câu hỏi
                    </button>
                    {questions.length > 0 && (
                        <>
                            <button
                                className="btn btn-secondary"
                                onClick={exportToJSON}
                            >
                                📥 Export JSON
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={exportToCSV}
                            >
                                📥 Export CSV
                            </button>
                        </>
                    )}
                </div>
            </div>

            {questions.length === 0 ? (
                <div className="empty-state">
                    <p>
                        📝 Chưa có câu hỏi nào. Hãy thêm câu hỏi mới hoặc import
                        từ file!
                    </p>
                </div>
            ) : (
                <div className="questions-list">
                    {questions.map((q, index) => (
                        <div
                            key={index}
                            className={`question-card ${
                                editingIndex === index ? "editing" : ""
                            }`}
                        >
                            <div className="question-card-header">
                                <span className="question-number">
                                    Câu {index + 1}
                                </span>
                                <div className="question-card-actions">
                                    <button
                                        className="icon-btn"
                                        onClick={() =>
                                            moveQuestion(index, "up")
                                        }
                                        disabled={index === 0}
                                        title="Di chuyển lên"
                                    >
                                        ⬆️
                                    </button>
                                    <button
                                        className="icon-btn"
                                        onClick={() =>
                                            moveQuestion(index, "down")
                                        }
                                        disabled={
                                            index === questions.length - 1
                                        }
                                        title="Di chuyển xuống"
                                    >
                                        ⬇️
                                    </button>
                                    <button
                                        className="icon-btn"
                                        onClick={() => duplicateQuestion(index)}
                                        title="Nhân bản"
                                    >
                                        📋
                                    </button>
                                    <button
                                        className="icon-btn edit-btn"
                                        onClick={() =>
                                            setEditingIndex(
                                                editingIndex === index
                                                    ? null
                                                    : index
                                            )
                                        }
                                        title={
                                            editingIndex === index
                                                ? "Thu gọn"
                                                : "Chỉnh sửa"
                                        }
                                    >
                                        {editingIndex === index ? "▲" : "▼"}
                                    </button>
                                    <button
                                        className="icon-btn delete-btn"
                                        onClick={() => deleteQuestion(index)}
                                        title="Xóa"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>

                            <div className="question-preview">
                                <strong>
                                    {q.question || "(Chưa có câu hỏi)"}
                                </strong>
                                <span className="answer-count">
                                    {q.options.length} đáp án • Đúng:{" "}
                                    {String.fromCharCode(65 + q.correctAnswer)}
                                </span>
                            </div>

                            {editingIndex === index && (
                                <div className="question-edit-form">
                                    <div className="form-group">
                                        <label>Câu hỏi:</label>
                                        <textarea
                                            value={q.question}
                                            onChange={(e) =>
                                                updateQuestion(
                                                    index,
                                                    "question",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Nhập câu hỏi..."
                                            rows="3"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Các đáp án:</label>
                                        {q.options.map((option, optIndex) => (
                                            <div
                                                key={optIndex}
                                                className="option-input-group"
                                            >
                                                <span className="option-label">
                                                    {String.fromCharCode(
                                                        65 + optIndex
                                                    )}
                                                    .
                                                </span>
                                                <input
                                                    type="text"
                                                    value={option}
                                                    onChange={(e) =>
                                                        updateOption(
                                                            index,
                                                            optIndex,
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder={`Đáp án ${String.fromCharCode(
                                                        65 + optIndex
                                                    )}`}
                                                />
                                                <label className="radio-label">
                                                    <input
                                                        type="radio"
                                                        name={`correct-${index}`}
                                                        checked={
                                                            q.correctAnswer ===
                                                            optIndex
                                                        }
                                                        onChange={() =>
                                                            updateQuestion(
                                                                index,
                                                                "correctAnswer",
                                                                optIndex
                                                            )
                                                        }
                                                    />
                                                    <span className="radio-text">
                                                        Đúng
                                                    </span>
                                                </label>
                                                <button
                                                    className="icon-btn delete-option-btn"
                                                    onClick={() =>
                                                        deleteOption(
                                                            index,
                                                            optIndex
                                                        )
                                                    }
                                                    disabled={
                                                        q.options.length <= 2
                                                    }
                                                    title="Xóa đáp án"
                                                >
                                                    ❌
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            className="btn btn-small"
                                            onClick={() => addOption(index)}
                                        >
                                            ➕ Thêm đáp án
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {questions.length > 0 && (
                <div className="editor-summary">
                    <p>
                        📊 Tổng số: <strong>{questions.length}</strong> câu hỏi
                    </p>
                </div>
            )}
        </div>
    );
}

export default QuestionEditor;
