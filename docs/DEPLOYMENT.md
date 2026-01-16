# Deploy SimpleQuiz lên DigitalOcean Droplet

## Yêu cầu
- DigitalOcean Droplet (Ubuntu 20.04 hoặc 22.04)
- Domain name (tùy chọn)
- SSH access đến droplet

## Bước 1: Chuẩn bị Droplet

### 1.1. Kết nối SSH vào Droplet
```bash
ssh root@your_droplet_ip
```

### 1.2. Cập nhật hệ thống
```bash
apt update && apt upgrade -y
```

### 1.3. Cài đặt Nginx
```bash
apt install nginx -y
systemctl start nginx
systemctl enable nginx
```

### 1.4. Cài đặt Node.js (nếu cần build trên server)
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs
node --version
npm --version
```

### 1.5. Cài đặt Git (nếu deploy từ GitHub)
```bash
apt install git -y
```

## Bước 2: Cấu hình Firewall
```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
ufw status
```

## Bước 3: Build ứng dụng

### Tùy chọn A: Build trên máy local rồi upload
1. Trên máy local, chạy:
```bash
npm run build
```

2. Upload folder `dist` lên server bằng SCP:
```bash
scp -r dist root@your_droplet_ip:/var/www/simplequiz
```

### Tùy chọn B: Build trực tiếp trên server
1. Clone repository:
```bash
cd /var/www
git clone https://github.com/your_username/SimpleQuiz.git simplequiz
cd simplequiz
```

2. Cài đặt dependencies và build:
```bash
npm install
npm run build
```

3. Di chuyển build files:
```bash
rm -rf /var/www/simplequiz_build
mv dist /var/www/simplequiz_build
```

## Bước 4: Cấu hình Nginx

1. Tạo file cấu hình Nginx:
```bash
nano /etc/nginx/sites-available/simplequiz
```

2. Dán nội dung từ file `nginx.conf` (xem file kèm theo)

3. Kích hoạt site:
```bash
ln -s /etc/nginx/sites-available/simplequiz /etc/nginx/sites-enabled/
```

4. Test cấu hình:
```bash
nginx -t
```

5. Reload Nginx:
```bash
systemctl reload nginx
```

## Bước 5: Cài đặt SSL (Tùy chọn - nếu có domain)

1. Cài đặt Certbot:
```bash
apt install certbot python3-certbot-nginx -y
```

2. Lấy SSL certificate:
```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

3. Certbot sẽ tự động cấu hình Nginx và SSL

## Bước 6: Deploy Script tự động

Sử dụng script `deploy.sh` để tự động hóa quá trình deploy:

```bash
chmod +x deploy.sh
./deploy.sh
```

## Cấu trúc thư mục trên server

```
/var/www/
├── simplequiz/              # Source code (nếu build trên server)
└── simplequiz_build/        # Built files
    ├── index.html
    ├── assets/
    └── data/
```

## Troubleshooting

### Lỗi 502 Bad Gateway
- Kiểm tra Nginx đang chạy: `systemctl status nginx`
- Kiểm tra log: `tail -f /var/log/nginx/error.log`

### Lỗi 404 Not Found khi truy cập routes
- Đảm bảo Nginx đã cấu hình `try_files` đúng (xem file nginx.conf)

### Không tải được files trong thư mục data
- Kiểm tra quyền: `chmod -R 755 /var/www/simplequiz_build`
- Đảm bảo folder data được copy vào dist khi build

## Cập nhật ứng dụng

### Từ máy local:
```bash
npm run build
scp -r dist/* root@your_droplet_ip:/var/www/simplequiz_build/
```

### Từ GitHub:
```bash
ssh root@your_droplet_ip
cd /var/www/simplequiz
git pull
npm install
npm run build
rm -rf /var/www/simplequiz_build/*
cp -r dist/* /var/www/simplequiz_build/
systemctl reload nginx
```

### Auto deploy với GitHub Actions:
Xem hướng dẫn chi tiết trong file [GITHUB-SECRETS.md](./GITHUB-SECRETS.md)

## Tích hợp Cloudflare (Khuyên dùng)

Để tăng hiệu suất và bảo mật, nên tích hợp Cloudflare:
- Free CDN global
- SSL/HTTPS miễn phí
- DDoS protection
- Caching thông minh

👉 Xem hướng dẫn đầy đủ: [CLOUDFLARE.md](./CLOUDFLARE.md)

## Monitoring

### Kiểm tra trạng thái Nginx:
```bash
systemctl status nginx
```

### Xem logs:
```bash
# Access logs
tail -f /var/log/nginx/access.log

# Error logs
tail -f /var/log/nginx/error.log
```

## Backup

### Backup ứng dụng:
```bash
tar -czf simplequiz-backup-$(date +%Y%m%d).tar.gz /var/www/simplequiz_build
```

### Restore từ backup:
```bash
tar -xzf simplequiz-backup-YYYYMMDD.tar.gz -C /
systemctl reload nginx
```

## Liên hệ
Nếu gặp vấn đề, kiểm tra logs hoặc liên hệ support.
