# 🎓 Ứng Dụng Thi Trắc Nghiệm

Ứng dụng thi trắc nghiệm hiện đại được xây dựng bằng React + Vite, hỗ trợ quản lý và import hàng loạt câu hỏi từ file JSON hoặc CSV.

## ✨ Tính năng

-   📚 **Quản lý bài trắc nghiệm**: Xem và quản lý các bài test từ file JSON
-   📥 **Import hàng loạt**: Tải câu hỏi từ file JSON hoặc CSV
-   ✏️ **Chỉnh sửa câu hỏi**: Thêm, sửa, xóa câu hỏi trực tiếp
-   🔀 **Ngẫu nhiên hóa**: Xáo trộn câu hỏi và đáp án
-   ✅ **Validation**: Kiểm tra tính hợp lệ của dữ liệu import
-   📝 **Làm bài trực quan**: Giao diện đẹp mắt, dễ sử dụng
-   📊 **Kết quả chi tiết**: Xem điểm số và đáp án chi tiết
-   📱 **Responsive**: Hoạt động tốt trên mọi thiết bị
-   🎨 **UI hiện đại**: Thiết kế gradient đẹp mắt với animation

## 🚀 Cài đặt

```bash
# Clone repository
git clone https://github.com/huy1235588/SimpleQuiz.git
cd SimpleQuiz

# Cài đặt dependencies
npm install

# Chạy ứng dụng ở chế độ development
npm run dev

# Build ứng dụng
npm run build
```

## 📁 Cấu trúc thư mục

```
SimpleQuiz/
├── src/
│   ├── components/
│   │   ├── ImportQuestions.jsx  # Import câu hỏi
│   │   ├── QuizManager.jsx      # Quản lý bài test
│   │   ├── QuestionEditor.jsx   # Chỉnh sửa câu hỏi
│   │   ├── Quiz.jsx             # Làm bài
│   │   └── Results.jsx          # Kết quả
│   ├── App.jsx                  # Component chính
│   └── main.jsx                 # Entry point
├── data/
│   ├── listening/               # Bài Listening
│   └── reading/                 # Bài Reading
├── docs/                        # Tài liệu deployment
│   ├── QUICKSTART.md           # Hướng dẫn nhanh
│   ├── DEPLOYMENT.md           # Deploy chi tiết
│   ├── GITHUB-SECRETS.md       # GitHub Actions
│   ├── CLOUDFLARE.md           # Tích hợp Cloudflare
│   ├── deploy.sh               # Script deploy
│   ├── server-setup.sh         # Script setup server
│   └── nginx.conf              # Nginx config
└── public/
    ├── questions-sample.json    # File mẫu JSON
    └── questions-sample.csv     # File mẫu CSV
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

1. **Quản lý bài trắc nghiệm**:
    - Click "📚 Quản lý bài trắc nghiệm"
    - Xem danh sách các bài Listening và Reading
    - Click "Tải và làm bài" để chọn bài test

2. **Import câu hỏi**:
    - Click "Chọn file JSON hoặc CSV"
    - Chọn file câu hỏi từ máy tính
    - Hoặc tải file mẫu để test

3. **Chỉnh sửa câu hỏi**:
    - Click "✏️ Chỉnh sửa câu hỏi"
    - Thêm mới, sửa đổi hoặc xóa câu hỏi
    - Export ra file JSON

4. **Làm bài**:
    - Click "Bắt đầu làm bài"
    - Chọn đáp án cho mỗi câu hỏi
    - Dùng nút "Câu tiếp" / "Câu trước" để điều hướng
    - Click "Nộp bài" khi hoàn thành

5. **Xem kết quả**:
    - Xem điểm số và xếp loại
    - Xem lại đáp án chi tiết
    - Click "Làm lại" để thử lại

## 📖 Deployment

Để deploy ứng dụng lên production, xem hướng dẫn chi tiết trong thư mục [docs/](./docs/):

- **[Quick Start](./docs/QUICKSTART.md)** - Bắt đầu nhanh với DigitalOcean
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Hướng dẫn deployment đầy đủ
- **[GitHub Actions](./docs/GITHUB-SECRETS.md)** - Auto deploy với GitHub
- **[Cloudflare Setup](./docs/CLOUDFLARE.md)** - Tích hợp CDN và SSL miễn phí

## 🎨 Xếp loại

-   🏆 **Xuất sắc**: 90% - 100%
-   🌟 **Giỏi**: 80% - 89%
-   👍 **Khá**: 70% - 79%
-   📝 **Trung bình**: 50% - 69%
-   💪 **Cần cố gắng**: < 50%

## 🛠️ Công nghệ sử dụng

-   **Frontend**: React 18, Vite
-   **Styling**: CSS3 với animations và gradients
-   **Deployment**: DigitalOcean Droplet, Nginx
-   **CDN**: Cloudflare (optional)
-   **CI/CD**: GitHub Actions

## 👤 Author

**huy1235588**

-   GitHub: [@huy1235588](https://github.com/huy1235588)
-   Repository: [SimpleQuiz](https://github.com/huy1235588/SimpleQuiz)

## ⭐ Show your support

Nếu project này hữu ích, hãy cho một ⭐️!

## 📄 License

MIT License - Tự do sử dụng cho mục đích cá nhân và thương mại.
