import { useState, useMemo } from "react";
import "./WritingPractice.css";

function WritingPractice({ onBack }) {
    const [sampleText, setSampleText] = useState("");
    const [userText, setUserText] = useState("");
    const [showSample, setShowSample] = useState(true);
    const [isChecked, setIsChecked] = useState(false);
    const [error, setError] = useState("");

    // Normalize text by converting to lowercase and splitting into words
    const normalizeText = (text) => {
        return text
            .toLowerCase()
            .trim()
            .split(/\s+/)
            .filter((word) => word.length > 0);
    };

    // Calculate word count
    const sampleWordCount = useMemo(() => {
        return normalizeText(sampleText).length;
    }, [sampleText]);

    const userWordCount = useMemo(() => {
        return normalizeText(userText).length;
    }, [userText]);

    // Compare user text with sample text
    const comparisonResult = useMemo(() => {
        if (!isChecked) return null;

        const sampleWords = normalizeText(sampleText);
        const userWords = normalizeText(userText);

        const result = {
            sampleWords,
            userWords,
            wordResults: [],
            totalSampleWords: sampleWords.length,
            correctWords: 0,
            wrongWords: 0,
            missingWords: 0,
            extraWords: 0,
            accuracy: 0,
        };

        const maxLength = Math.max(sampleWords.length, userWords.length);

        // Compare word by word
        for (let i = 0; i < maxLength; i++) {
            const sampleWord = sampleWords[i];
            const userWord = userWords[i];

            if (i < sampleWords.length && i < userWords.length) {
                if (sampleWord === userWord) {
                    result.wordResults.push({
                        type: "correct",
                        word: userWord,
                        index: i,
                    });
                    result.correctWords++;
                } else {
                    result.wordResults.push({
                        type: "wrong",
                        word: userWord,
                        expectedWord: sampleWord,
                        index: i,
                    });
                    result.wrongWords++;
                }
            } else if (i >= userWords.length) {
                // Missing words
                result.wordResults.push({
                    type: "missing",
                    word: sampleWord,
                    index: i,
                });
                result.missingWords++;
            } else {
                // Extra words
                result.wordResults.push({
                    type: "extra",
                    word: userWord,
                    index: i,
                });
                result.extraWords++;
            }
        }

        // Calculate accuracy
        if (result.totalSampleWords > 0) {
            result.accuracy = (
                (result.correctWords / result.totalSampleWords) *
                100
            ).toFixed(1);
        }

        return result;
    }, [sampleText, userText, isChecked]);

    const handleCheck = () => {
        if (!sampleText.trim()) {
            setError("Vui lòng nhập bài mẫu trước!");
            return;
        }
        if (!userText.trim()) {
            setError("Vui lòng viết bài của bạn trước!");
            return;
        }
        setError("");
        setIsChecked(true);
    };

    const handleClearUserText = () => {
        setUserText("");
        setIsChecked(false);
        setError("");
    };

    const handleClearAll = () => {
        setSampleText("");
        setUserText("");
        setIsChecked(false);
        setError("");
    };

    const toggleShowSample = () => {
        setShowSample(!showSample);
    };

    return (
        <div className="writing-practice">
            <div className="writing-header">
                <h2>📝 Ôn thi viết</h2>
                <p className="writing-description">
                    Import bài viết mẫu, tự viết lại và kiểm tra độ chính xác
                </p>
            </div>

            <div className="writing-container">
                {/* Sample Text Section */}
                <div className="writing-section">
                    <div className="section-header">
                        <h3>📄 Bài mẫu</h3>
                        <span className="word-count">
                            {sampleWordCount} từ
                        </span>
                    </div>
                    {showSample && (
                        <textarea
                            className="writing-textarea"
                            placeholder="Dán hoặc nhập bài viết mẫu vào đây..."
                            value={sampleText}
                            onChange={(e) => {
                                setSampleText(e.target.value);
                                setIsChecked(false);
                            }}
                            rows={8}
                        />
                    )}
                    {!showSample && sampleText && (
                        <div className="hidden-sample-message">
                            Bài mẫu đã được ẩn để bạn có thể viết từ trí nhớ
                        </div>
                    )}
                </div>

                {/* User Text Section */}
                <div className="writing-section">
                    <div className="section-header">
                        <h3>✍️ Bài viết của bạn</h3>
                        <span className="word-count">{userWordCount} từ</span>
                    </div>
                    <textarea
                        className="writing-textarea"
                        placeholder="Viết lại bài mẫu vào đây..."
                        value={userText}
                        onChange={(e) => {
                            setUserText(e.target.value);
                            setIsChecked(false);
                        }}
                        rows={8}
                    />
                </div>

                {/* Action Buttons */}
                <div className="writing-actions">
                    <button className="btn btn-success" onClick={handleCheck}>
                        ✓ Kiểm tra
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={handleClearUserText}
                    >
                        🗑️ Xóa bài viết
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={handleClearAll}
                    >
                        🔄 Xóa tất cả
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={toggleShowSample}
                    >
                        {showSample ? "🙈 Ẩn bài mẫu" : "👁️ Hiện bài mẫu"}
                    </button>
                    <button className="btn btn-secondary" onClick={onBack}>
                        ← Quay lại
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="error-message">
                        ⚠️ {error}
                    </div>
                )}

                {/* Results Section */}
                {isChecked && comparisonResult && (
                    <div className="writing-results">
                        <h3>📊 Kết quả so sánh</h3>

                        {/* Accuracy Progress Bar */}
                        <div className="accuracy-section">
                            <div className="accuracy-label">
                                <span>Độ chính xác</span>
                                <span className="accuracy-value">
                                    {comparisonResult.accuracy}%
                                </span>
                            </div>
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{
                                        width: `${comparisonResult.accuracy}%`,
                                    }}
                                ></div>
                            </div>
                        </div>

                        {/* Statistics Grid */}
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-label">Tổng số từ</div>
                                <div className="stat-value">
                                    {comparisonResult.totalSampleWords}
                                </div>
                            </div>
                            <div className="stat-card correct">
                                <div className="stat-label">Từ đúng</div>
                                <div className="stat-value">
                                    {comparisonResult.correctWords}
                                </div>
                            </div>
                            <div className="stat-card wrong">
                                <div className="stat-label">Từ sai</div>
                                <div className="stat-value">
                                    {comparisonResult.wrongWords}
                                </div>
                            </div>
                            <div className="stat-card missing">
                                <div className="stat-label">Từ thiếu</div>
                                <div className="stat-value">
                                    {comparisonResult.missingWords}
                                </div>
                            </div>
                            <div className="stat-card extra">
                                <div className="stat-label">Từ thừa</div>
                                <div className="stat-value">
                                    {comparisonResult.extraWords}
                                </div>
                            </div>
                        </div>

                        {/* Word by Word Comparison */}
                        <div className="word-comparison">
                            <h4>So sánh từng từ</h4>
                            <div className="comparison-text">
                                {comparisonResult.wordResults.map(
                                    (result, index) => (
                                        <span
                                            key={index}
                                            className={`word word-${result.type}`}
                                            title={
                                                result.type === "wrong"
                                                    ? `Đúng: "${result.expectedWord}"`
                                                    : result.type === "missing"
                                                    ? `Thiếu: "${result.word}"`
                                                    : result.type === "extra"
                                                    ? `Thừa: "${result.word}"`
                                                    : "Đúng"
                                            }
                                        >
                                            {result.type === "missing"
                                                ? `[${result.word}]`
                                                : result.word}
                                        </span>
                                    )
                                )}
                            </div>
                            <div className="legend">
                                <span className="legend-item">
                                    <span className="legend-color correct"></span>
                                    Đúng
                                </span>
                                <span className="legend-item">
                                    <span className="legend-color wrong"></span>
                                    Sai
                                </span>
                                <span className="legend-item">
                                    <span className="legend-color missing"></span>
                                    Thiếu
                                </span>
                                <span className="legend-item">
                                    <span className="legend-color extra"></span>
                                    Thừa
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default WritingPractice;
