# GitHub Copilot Instructions - SimpleQuiz

## 📖 Mô tả project

SimpleQuiz là một ứng dụng web React được thiết kế để tạo và làm bài thi trắc nghiệm, đồng thời hỗ trợ ôn luyện kỹ năng viết. Ứng dụng cho phép:

- **Import câu hỏi** từ file JSON hoặc CSV
- **Quản lý bài trắc nghiệm** với khả năng lưu trữ và tải lại các bài thi
- **Chỉnh sửa câu hỏi** trực tiếp trên giao diện
- **Làm bài trắc nghiệm** với tính năng ngẫu nhiên câu hỏi và đáp án
- **Xem kết quả chi tiết** với phân tích từng câu trả lời
- **Ôn thi viết** với tính năng so sánh từng từ và hiển thị độ chính xác

## 🛠️ Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: CSS thuần (không sử dụng CSS frameworks)
- **Language**: JavaScript (ES6+)
- **Package Manager**: npm

## 📁 Cấu trúc thư mục

```
SimpleQuiz/
├── .github/
│   ├── workflows/          # GitHub Actions workflows
│   └── copilot-instructions.md
├── src/
│   ├── components/         # Các React components
│   │   ├── ImportQuestions.jsx
│   │   ├── ImportQuestions.css
│   │   ├── Quiz.jsx
│   │   ├── Quiz.css
│   │   ├── Results.jsx
│   │   ├── Results.css
│   │   ├── QuestionEditor.jsx
│   │   ├── QuestionEditor.css
│   │   ├── QuizManager.jsx
│   │   ├── QuizManager.css
│   │   ├── WritingPractice.jsx
│   │   └── WritingPractice.css
│   ├── App.jsx             # Component chính
│   ├── App.css
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── data/                   # Dữ liệu câu hỏi mẫu
├── public/                 # Static assets
├── package.json
└── vite.config.js
```

## 🎨 Coding Conventions

### 1. Component Structure

- **Sử dụng Functional Components với Hooks**: Tất cả components đều là functional components, sử dụng hooks như `useState`, `useMemo`, `useEffect`.
- **Mỗi component có file CSS riêng**: Component `XyzComponent.jsx` đi kèm với `XyzComponent.css`.
- **Import thứ tự**:
  1. React hooks
  2. External libraries
  3. Internal components
  4. CSS files

Ví dụ:
```jsx
import { useState, useMemo } from "react";
import "./MyComponent.css";

function MyComponent({ propName }) {
    const [state, setState] = useState(initialValue);
    // Component logic here
    return (
        <div className="my-component">
            {/* JSX here */}
        </div>
    );
}

export default MyComponent;
```

### 2. State Management

- Sử dụng `useState` cho local state
- Sử dụng `useMemo` cho computed values
- Props được truyền từ parent component (App.jsx) xuống child components
- Callback functions được đặt tên theo pattern `handle*` (ví dụ: `handleSubmit`, `handleChange`)

### 3. Naming Conventions

- **Components**: PascalCase (ví dụ: `ImportQuestions`, `QuizManager`)
- **Files**: PascalCase cho component files (ví dụ: `ImportQuestions.jsx`)
- **Functions**: camelCase (ví dụ: `handleSubmit`, `calculateScore`)
- **CSS Classes**: kebab-case (ví dụ: `quiz-container`, `btn-primary`)
- **Constants**: UPPER_SNAKE_CASE nếu cần

### 4. CSS Guidelines

- **Class naming**: Sử dụng kebab-case và BEM-inspired naming
- **Reusable classes**: Các class như `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-success`, `.btn-large` được định nghĩa trong `App.css` và có thể tái sử dụng
- **Responsive design**: Luôn bao gồm media queries cho mobile (max-width: 768px) và small mobile (max-width: 480px)
- **Animations**: Sử dụng CSS animations cho transitions mượt mà
- **Colors**: Sử dụng color palette nhất quán:
  - Primary: `#667eea`, `#764ba2` (gradient)
  - Secondary: `#6c757d`
  - Success: `#28a745` hoặc `#4caf50`
  - Warning: `#ffc107`
  - Danger: `#f44336`
  - Background: `#f8f9ff`, `white`

### 5. Giao diện

- **Ngôn ngữ**: Toàn bộ UI sử dụng tiếng Việt
- **Emoji**: Sử dụng emoji để làm giao diện sinh động hơn (ví dụ: 📚, ✏️, 📝, 🎓)
- **Layout**: Sử dụng flexbox và grid cho responsive design
- **Buttons**: Luôn có emoji và text rõ ràng
- **Form elements**: Sử dụng placeholder tiếng Việt, có validation và error messages

### 6. File Structure trong Component

Mỗi component nên có cấu trúc như sau:

```jsx
// 1. Imports
import { useState } from "react";
import "./Component.css";

// 2. Component definition
function Component({ props }) {
    // 3. State declarations
    const [state, setState] = useState(initialValue);
    
    // 4. Helper functions
    const helperFunction = () => {
        // logic
    };
    
    // 5. Event handlers
    const handleEvent = () => {
        // logic
    };
    
    // 6. Computed values (useMemo)
    const computedValue = useMemo(() => {
        // computation
    }, [dependencies]);
    
    // 7. Render
    return (
        <div className="component">
            {/* JSX */}
        </div>
    );
}

// 8. Export
export default Component;
```

## 📝 Hướng dẫn thêm tính năng mới

### Bước 1: Tạo Component

1. Tạo file `.jsx` trong thư mục `src/components/`
2. Tạo file `.css` tương ứng
3. Follow coding conventions như trên

### Bước 2: Tích hợp vào App

1. Import component trong `App.jsx`
2. Thêm state và logic cần thiết
3. Thêm route/view logic nếu cần (sử dụng `currentView` state)
4. Thêm button hoặc navigation để access tính năng mới

### Bước 3: Styling

1. Đảm bảo UI nhất quán với các component hiện có
2. Sử dụng lại các class CSS có sẵn (`.btn`, `.btn-*`)
3. Implement responsive design cho mobile
4. Test trên nhiều kích thước màn hình

### Bước 4: Testing

1. Test trên desktop và mobile
2. Kiểm tra tất cả interactions
3. Validate form inputs nếu có
4. Đảm bảo không có console errors

## 🚀 Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📋 Current Views/Routes

App sử dụng state `currentView` để điều hướng:

- `home`: Trang chủ với options import/start quiz
- `manager`: Quản lý các bài trắc nghiệm đã lưu
- `editor`: Chỉnh sửa câu hỏi
- `quiz`: Làm bài thi
- `results`: Xem kết quả
- `writing`: Ôn thi viết (Writing Practice)

## 🎯 Best Practices

1. **Keep it simple**: Code đơn giản, dễ đọc hơn là phức tạp
2. **Reuse components**: Tận dụng lại components và styles có sẵn
3. **Mobile-first**: Luôn nghĩ đến mobile users
4. **Vietnamese UI**: Tất cả text user-facing phải là tiếng Việt
5. **Consistent styling**: Follow color scheme và spacing guidelines
6. **Error handling**: Luôn validate input và show error messages rõ ràng
7. **Performance**: Sử dụng `useMemo` cho expensive computations

## 🐛 Common Pitfalls

- ❌ Không quên import CSS file cho component mới
- ❌ Không hardcode styles trong JSX, sử dụng CSS classes
- ❌ Không quên add responsive styles cho mobile
- ❌ Không sử dụng English trong UI
- ❌ Không quên validate user inputs
- ❌ Không commit node_modules hoặc build files

## 📚 Resources

- React Documentation: https://react.dev
- Vite Documentation: https://vitejs.dev
- Project Repository: https://github.com/huy1235588/SimpleQuiz
