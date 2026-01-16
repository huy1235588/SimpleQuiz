import { useState } from "react";
import "./ImportQuestions.css";

function ImportQuestions({ onImport }) {
    const [error, setError] = useState("");
    const [isDragging, setIsDragging] = useState(false);

    const processFile = (file) => {
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const content = e.target.result;
                let questions = [];

                if (file.name.endsWith(".json")) {
                    questions = JSON.parse(content);
                } else if (file.name.endsWith(".csv")) {
                    questions = parseCSV(content);
                } else {
                    setError("Chỉ hỗ trợ file JSON hoặc CSV");
                    return;
                }

                // Validate questions
                if (!Array.isArray(questions) || questions.length === 0) {
                    setError("File không chứa câu hỏi hợp lệ");
                    return;
                }

                const validated = validateQuestions(questions);
                if (validated.error) {
                    setError(validated.error);
                    return;
                }

                setError("");
                onImport(validated.questions);
            } catch (err) {
                setError("Lỗi khi đọc file: " + err.message);
            }
        };

        reader.readAsText(file);
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        processFile(file);
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const file = files[0];
            if (file.name.endsWith(".json") || file.name.endsWith(".csv")) {
                processFile(file);
            } else {
                setError("Chỉ hỗ trợ file JSON hoặc CSV");
            }
        }
    };

    const parseCSV = (csv) => {
        const lines = csv.split("\n").filter((line) => line.trim());
        const questions = [];

        // Skip header if exists
        const startIndex = lines[0].toLowerCase().includes("question") ? 1 : 0;

        for (let i = startIndex; i < lines.length; i++) {
            const parts = lines[i].split(",").map((part) => part.trim());

            if (parts.length < 6) continue;

            questions.push({
                question: parts[0].replace(/^"|"$/g, ""),
                options: [
                    parts[1].replace(/^"|"$/g, ""),
                    parts[2].replace(/^"|"$/g, ""),
                    parts[3].replace(/^"|"$/g, ""),
                    parts[4].replace(/^"|"$/g, ""),
                ],
                correctAnswer: parseInt(parts[5]) || 0,
            });
        }

        return questions;
    };

    const validateQuestions = (questions) => {
        const validated = [];

        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];

            if (!q.question || typeof q.question !== "string") {
                return {
                    error: `Câu ${i + 1}: Thiếu hoặc sai định dạng câu hỏi`,
                };
            }

            if (!Array.isArray(q.options) || q.options.length < 2) {
                return { error: `Câu ${i + 1}: Cần ít nhất 2 đáp án` };
            }

            if (
                typeof q.correctAnswer !== "number" ||
                q.correctAnswer < 0 ||
                q.correctAnswer >= q.options.length
            ) {
                return { error: `Câu ${i + 1}: Đáp án đúng không hợp lệ` };
            }

            validated.push(q);
        }

        return { questions: validated };
    };

    const downloadSampleJSON = () => {
        const sample = [
            {
                question: "Thủ đô của Việt Nam là gì?",
                options: ["Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Huế"],
                correctAnswer: 0,
            },
            {
                question: "2 + 2 = ?",
                options: ["3", "4", "5", "6"],
                correctAnswer: 1,
            },
            {
                question: "Ngôn ngữ lập trình web phổ biến nhất là gì?",
                options: ["Python", "Java", "JavaScript", "C++"],
                correctAnswer: 2,
            },
        ];

        const blob = new Blob([JSON.stringify(sample, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "questions-sample.json";
        a.click();
        URL.revokeObjectURL(url);
    };

    const downloadSampleCSV = () => {
        const csv = `Question,Option1,Option2,Option3,Option4,CorrectAnswer
"Thủ đô của Việt Nam là gì?","Hà Nội","TP. Hồ Chí Minh","Đà Nẵng","Huế",0
"2 + 2 = ?","3","4","5","6",1
"Ngôn ngữ lập trình web phổ biến nhất là gì?","Python","Java","JavaScript","C++",2`;

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "questions-sample.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="import-questions">
            <h2>📥 Import Câu Hỏi</h2>

            <div className="import-area">
                <input
                    type="file"
                    id="file-input"
                    accept=".json,.csv"
                    onChange={handleFileUpload}
                    className="file-input"
                />
                <label
                    htmlFor="file-input"
                    className={`file-label ${isDragging ? "dragging" : ""}`}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    <span className="upload-icon">📁</span>
                    <span>
                        {isDragging
                            ? "Thả file vào đây"
                            : "Kéo thả file hoặc click để chọn"}
                    </span>
                    <span className="file-hint">Hỗ trợ JSON & CSV</span>
                </label>

                {error && <div className="error-message">⚠️ {error}</div>}
            </div>

            <div className="sample-section">
                <h3>📄 Tải file mẫu:</h3>
                <div className="sample-buttons">
                    <button
                        className="btn btn-secondary"
                        onClick={downloadSampleJSON}
                    >
                        Tải JSON mẫu
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={downloadSampleCSV}
                    >
                        Tải CSV mẫu
                    </button>
                </div>
            </div>

            <div className="format-info">
                <h3>ℹ️ Định dạng file:</h3>
                <div className="format-example">
                    <strong>JSON:</strong>
                    <pre>{`[
  {
    "question": "Câu hỏi của bạn?",
    "options": ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
    "correctAnswer": 0
  }
]`}</pre>
                </div>
                <div className="format-example">
                    <strong>CSV:</strong>
                    <pre>{`Question,Option1,Option2,Option3,Option4,CorrectAnswer
"Câu hỏi?","Đáp án A","Đáp án B","Đáp án C","Đáp án D",0`}</pre>
                </div>
            </div>
        </div>
    );
}

export default ImportQuestions;
