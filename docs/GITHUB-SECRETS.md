# Hướng dẫn cấu hình GitHub Secrets

## Tại sao cần GitHub Secrets?

GitHub Secrets cho phép bạn lưu trữ thông tin nhạy cảm (SSH keys, passwords, API tokens) một cách an toàn để sử dụng trong GitHub Actions mà không phải commit vào code.

## Bước 1: Tạo SSH Key cho Deployment

### Trên máy local (Windows PowerShell):

```powershell
# Tạo SSH key mới
ssh-keygen -t ed25519 -C "github-actions-deploy" -f github-deploy-key

# Hoặc nếu hệ thống không hỗ trợ ed25519:
ssh-keygen -t rsa -b 4096 -C "github-actions-deploy" -f github-deploy-key
```

Khi được hỏi passphrase, **bấm Enter** để bỏ qua (không đặt password).

Sẽ tạo ra 2 files:
- `github-deploy-key` (private key)
- `github-deploy-key.pub` (public key)

## Bước 2: Copy Public Key lên Server

```powershell
# Xem nội dung public key
Get-Content github-deploy-key.pub

# Copy và paste vào server
```

Trên server DigitalOcean:
```bash
# SSH vào server
ssh root@YOUR_DROPLET_IP

# Thêm public key vào authorized_keys
mkdir -p ~/.ssh
chmod 700 ~/.ssh
nano ~/.ssh/authorized_keys

# Paste nội dung public key vào file này
# Ctrl+X, Y, Enter để lưu

# Set permissions
chmod 600 ~/.ssh/authorized_keys
```

## Bước 3: Thêm Secrets vào GitHub Repository

### 3.1. Truy cập GitHub Repository
1. Vào repository: `https://github.com/huy1235588/SimpleQuiz`
2. Click **Settings** (tab cuối cùng)
3. Sidebar bên trái: Click **Secrets and variables** > **Actions**

### 3.2. Thêm các Secrets

Click **New repository secret** và thêm từng secret:

#### Secret 1: SSH_PRIVATE_KEY
```
Name: SSH_PRIVATE_KEY

Value: 
# Copy toàn bộ nội dung file github-deploy-key (private key)
# Trên Windows PowerShell:
Get-Content github-deploy-key -Raw | Set-Clipboard

# Paste vào phần Value
```

**Lưu ý:** Phải copy **toàn bộ** nội dung bao gồm:
```
-----BEGIN OPENSSH PRIVATE KEY-----
...content...
-----END OPENSSH PRIVATE KEY-----
```

#### Secret 2: REMOTE_HOST
```
Name: REMOTE_HOST
Value: YOUR_DROPLET_IP

Ví dụ: 142.93.123.45
```

#### Secret 3: REMOTE_USER
```
Name: REMOTE_USER
Value: root

# Hoặc nếu bạn tạo user khác thì điền tên user đó
```

### 3.3. Xác nhận Secrets đã được thêm

Sau khi thêm, bạn sẽ thấy 3 secrets:
- `SSH_PRIVATE_KEY`
- `REMOTE_HOST`
- `REMOTE_USER`

**Lưu ý:** GitHub **không cho phép** xem lại nội dung secrets sau khi lưu (vì lý do bảo mật).

## Bước 4: Test GitHub Actions

### 4.1. Commit và Push code

```bash
git add .
git commit -m "Setup GitHub Actions deployment"
git push origin main
```

### 4.2. Kiểm tra Workflow

1. Vào repository trên GitHub
2. Click tab **Actions**
3. Xem workflow "Deploy to DigitalOcean" đang chạy
4. Click vào workflow để xem chi tiết logs

### 4.3. Nếu có lỗi

**Lỗi: "Permission denied (publickey)"**
- Kiểm tra lại public key đã được thêm vào `~/.ssh/authorized_keys` trên server
- Kiểm tra permissions: `chmod 600 ~/.ssh/authorized_keys`

**Lỗi: "Host key verification failed"**
- Thêm dòng này vào workflow file (đã có sẵn trong deploy.yml):
```yaml
StrictHostKeyChecking: no
```

## Bước 5: Xóa Private Key trên máy local (Quan trọng!)

Sau khi đã thêm vào GitHub Secrets, **XÓA** file private key khỏi máy local:

```powershell
# Xóa các file key
Remove-Item github-deploy-key -Force
Remove-Item github-deploy-key.pub -Force
```

**TUYỆT ĐỐI KHÔNG** commit file private key vào Git!

## Bước 6: Auto Deploy

Từ giờ, mỗi khi bạn push code lên branch `main`:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

GitHub Actions sẽ **tự động**:
1. ✅ Checkout code
2. ✅ Install dependencies
3. ✅ Build application
4. ✅ Deploy to DigitalOcean
5. ✅ Reload Nginx
6. ✅ Verify deployment

## Troubleshooting

### Kiểm tra logs trong GitHub Actions

1. Vào tab **Actions**
2. Click vào workflow run
3. Click vào job "deploy"
4. Xem từng step để tìm lỗi

### Test SSH connection thủ công

Để test private key có hoạt động không:

```powershell
# Trên local (trước khi xóa key)
ssh -i github-deploy-key root@YOUR_DROPLET_IP

# Nếu kết nối thành công, key đã hoạt động
```

### Re-generate SSH Key

Nếu cần tạo lại:

1. Tạo key mới (Bước 1)
2. Update public key trên server (Bước 2)
3. Update secret `SSH_PRIVATE_KEY` trên GitHub (Bước 3)

## Best Practices

✅ **Nên làm:**
- Sử dụng SSH key riêng cho CI/CD (không dùng chung với personal key)
- Xóa private key sau khi upload lên GitHub Secrets
- Set permissions đúng cho SSH files trên server
- Test workflow trên branch khác trước khi merge vào main

❌ **Không nên:**
- Commit private key vào Git
- Dùng chung SSH key giữa nhiều services
- Set passphrase cho key dùng trong CI/CD
- Share secrets với người khác

## Security Tips

1. **Rotate keys định kỳ:** Thay đổi SSH keys mỗi 3-6 tháng
2. **Giới hạn quyền:** Nếu có thể, tạo user riêng chỉ có quyền deploy
3. **Monitor:** Kiểm tra logs thường xuyên
4. **Backup:** Lưu public key ở nơi an toàn để restore nếu cần

## Thêm Secrets khác (Nếu cần)

### Database credentials:
```
Name: DATABASE_URL
Value: postgresql://user:password@localhost:5432/dbname
```

### API Keys:
```
Name: API_KEY
Value: your_api_key_here
```

Sau đó sử dụng trong code:
```javascript
const apiKey = process.env.API_KEY;
```

Hoặc trong GitHub Actions:
```yaml
- name: Deploy
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
    API_KEY: ${{ secrets.API_KEY }}
```
