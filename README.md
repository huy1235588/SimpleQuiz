# 🎓 Ứng Dụng Thi Trắc Nghiệm

Ứng dụng thi trắc nghiệm hiện đại được xây dựng bằng React + Vite, hỗ trợ import hàng loạt câu hỏi từ file JSON hoặc CSV.

## ✨ Tính năng

-   📥 **Import hàng loạt**: Tải câu hỏi từ file JSON hoặc CSV
-   ✅ **Validation**: Kiểm tra tính hợp lệ của dữ liệu import
-   📝 **Làm bài trực quan**: Giao diện đẹp mắt, dễ sử dụng
-   📊 **Kết quả chi tiết**: Xem điểm số và đáp án chi tiết
-   📱 **Responsive**: Hoạt động tốt trên mọi thiết bị
-   🎨 **UI hiện đại**: Thiết kế gradient đẹp mắt với animation

## 🚀 Cài đặt

```bash
# Cài đặt dependencies
npm install

# Chạy ứng dụng ở chế độ development
npm run dev

# Build ứng dụng
npm run build
```

## 📋 Định dạng file import

### JSON Format

```json
[
    {
        "question": "Câu hỏi của bạn?",
        "options": ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
        "correctAnswer": 0
    }
]
```

-   `question`: Nội dung câu hỏi (string)
-   `options`: Mảng các đáp án (array of strings)
-   `correctAnswer`: Chỉ số đáp án đúng (number, bắt đầu từ 0)

### CSV Format

```csv
Question,Option1,Option2,Option3,Option4,CorrectAnswer
"Câu hỏi?","Đáp án A","Đáp án B","Đáp án C","Đáp án D",0
```

-   Dòng đầu tiên là header
-   Các trường phải được bao bởi dấu ngoặc kép nếu chứa dấu phẩy
-   `CorrectAnswer` là chỉ số từ 0-3

## 📁 Cấu trúc thư mục

```
SimpleQuiz/
├── public/
│   ├── questions-sample.json    # File mẫu JSON
│   └── questions-sample.csv     # File mẫu CSV
├── src/
│   ├── components/
│   │   ├── ImportQuestions.jsx  # Component import câu hỏi
│   │   ├── ImportQuestions.css
│   │   ├── Quiz.jsx             # Component làm bài
│   │   ├── Quiz.css
│   │   ├── Results.jsx          # Component hiển thị kết quả
│   │   └── Results.css
│   ├── App.jsx                  # Component chính
│   ├── App.css
│   ├── main.jsx                 # Entry point
│   └── index.css
├── index.html
├── package.json
└── vite.config.js
```

## 🎯 Cách sử dụng

1. **Import câu hỏi**:

    - Click "Chọn file JSON hoặc CSV"
    - Chọn file câu hỏi từ máy tính
    - Hoặc tải file mẫu để test

2. **Làm bài**:

    - Click "Bắt đầu làm bài"
    - Chọn đáp án cho mỗi câu hỏi
    - Dùng nút "Câu tiếp" / "Câu trước" để điều hướng
    - Click "Nộp bài" khi hoàn thành

3. **Xem kết quả**:
    - Xem điểm số và xếp loại
    - Xem lại đáp án chi tiết
    - Click "Làm lại" để thử lại

## 🎨 Xếp loại

-   🏆 **Xuất sắc**: 90% - 100%
-   🌟 **Giỏi**: 80% - 89%
-   👍 **Khá**: 70% - 79%
-   📝 **Trung bình**: 50% - 69%
-   💪 **Cần cố gắng**: < 50%

## 🛠️ Công nghệ sử dụng

-   **React 18**: UI library
-   **Vite**: Build tool và dev server
-   **CSS3**: Styling với animations và gradients

## 📝 Lưu ý

-   File JSON/CSV phải tuân thủ đúng định dạng
-   Mỗi câu hỏi cần ít nhất 2 đáp án
-   Chỉ số đáp án đúng phải nằm trong khoảng hợp lệ
-   File CSV nên sử dụng encoding UTF-8 để hiển thị tiếng Việt đúng

## 📄 License

MIT License - Tự do sử dụng cho mục đích cá nhân và thương mại.
