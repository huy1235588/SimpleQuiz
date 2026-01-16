# DigitalOcean Deployment - Quick Start

## Chuẩn bị

### 1. Tạo Droplet trên DigitalOcean
- Đăng nhập vào [DigitalOcean](https://cloud.digitalocean.com/)
- Tạo Droplet mới:
  - OS: Ubuntu 22.04 LTS
  - Plan: Basic ($6/month là đủ)
  - Datacenter: Chọn region gần bạn nhất
  - Authentication: SSH key hoặc Password
- Lưu lại IP address của Droplet

### 2. Cấu hình Server (Lần đầu tiên)

Kết nối SSH vào Droplet:
```bash
ssh root@YOUR_DROPLET_IP
```

Copy file `server-setup.sh` lên server và chạy:
```bash
# Trên local machine
scp server-setup.sh root@YOUR_DROPLET_IP:/root/

# SSH vào server
ssh root@YOUR_DROPLET_IP

# Chạy script setup
chmod +x /root/server-setup.sh
/root/server-setup.sh
```

Script sẽ tự động cài đặt: Nginx, Node.js, Git, và cấu hình firewall.

### 3. Deploy Ứng Dụng

#### Cách 1: Deploy thủ công từ máy local (Khuyên dùng cho lần đầu)

1. **Build ứng dụng trên local:**
```bash
npm install
npm run build
```

2. **Upload lên server:**
```bash
scp -r dist/* root@YOUR_DROPLET_IP:/var/www/simplequiz_build/
```

3. **Copy thư mục data:**
```bash
scp -r data root@YOUR_DROPLET_IP:/var/www/simplequiz_build/
```

4. **Set permissions trên server:**
```bash
ssh root@YOUR_DROPLET_IP "chmod -R 755 /var/www/simplequiz_build && chown -R www-data:www-data /var/www/simplequiz_build"
```

#### Cách 2: Sử dụng Deploy Script (Tự động)

1. **Cấu hình script:**
Mở file `deploy.sh` và thay đổi:
```bash
DROPLET_IP="YOUR_DROPLET_IP"  # Thay bằng IP droplet của bạn
```

2. **Chạy script:**
```bash
chmod +x deploy.sh
./deploy.sh
```

#### Cách 3: Auto deploy với GitHub Actions (Cao cấp)

1. **Thêm secrets vào GitHub repository:**
   - Vào Settings > Secrets and variables > Actions
   - Thêm các secrets:
     - `SSH_PRIVATE_KEY`: Private SSH key của bạn
     - `REMOTE_HOST`: IP address của droplet
     - `REMOTE_USER`: `root` (hoặc user bạn tạo)

2. **Push code lên GitHub:**
```bash
git add .
git commit -m "Setup deployment"
git push origin main
```

GitHub Actions sẽ tự động build và deploy khi bạn push code.

## Truy cập ứng dụng

Mở trình duyệt và truy cập:
```
http://YOUR_DROPLET_IP
```

## Cập nhật ứng dụng

### Cập nhật thủ công:
```bash
npm run build
scp -r dist/* root@YOUR_DROPLET_IP:/var/www/simplequiz_build/
```

### Cập nhật bằng script:
```bash
./deploy.sh
```

## Cài đặt Domain (Tùy chọn)

### 1. Trỏ domain về Droplet
- Vào DNS provider của domain
- Tạo A record trỏ về IP của Droplet:
  ```
  A    @    YOUR_DROPLET_IP
  A    www  YOUR_DROPLET_IP
  ```

### 2. Cập nhật Nginx config
```bash
ssh root@YOUR_DROPLET_IP
nano /etc/nginx/sites-available/simplequiz
```

Thay đổi dòng:
```nginx
server_name _;
```
Thành:
```nginx
server_name yourdomain.com www.yourdomain.com;
```

Reload Nginx:
```bash
nginx -t
systemctl reload nginx
```

### 3. Cài SSL với Let's Encrypt (HTTPS)
```bash
ssh root@YOUR_DROPLET_IP
apt install certbot python3-certbot-nginx -y
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Certbot sẽ tự động cấu hình HTTPS. Chọn option redirect HTTP to HTTPS.

## Kiểm tra và Debug

### Kiểm tra Nginx:
```bash
ssh root@YOUR_DROPLET_IP
systemctl status nginx
nginx -t
```

### Xem logs:
```bash
# Error logs
tail -f /var/log/nginx/simplequiz_error.log

# Access logs
tail -f /var/log/nginx/simplequiz_access.log
```

### Kiểm tra files:
```bash
ls -la /var/www/simplequiz_build
```

### Restart Nginx:
```bash
systemctl restart nginx
```

## Backup và Restore

### Tạo backup:
```bash
ssh root@YOUR_DROPLET_IP
tar -czf ~/simplequiz-backup-$(date +%Y%m%d).tar.gz /var/www/simplequiz_build
```

### Download backup về local:
```bash
scp root@YOUR_DROPLET_IP:~/simplequiz-backup-*.tar.gz ./
```

### Restore:
```bash
scp simplequiz-backup-*.tar.gz root@YOUR_DROPLET_IP:~/
ssh root@YOUR_DROPLET_IP
tar -xzf ~/simplequiz-backup-*.tar.gz -C /
systemctl reload nginx
```

## Troubleshooting

### Lỗi 404 Not Found
- Kiểm tra files đã được upload: `ls /var/www/simplequiz_build`
- Kiểm tra file index.html có tồn tại không

### Lỗi 502 Bad Gateway
- Kiểm tra Nginx: `systemctl status nginx`
- Xem logs: `tail -f /var/log/nginx/error.log`

### Không load được data files
- Kiểm tra folder data: `ls /var/www/simplequiz_build/data`
- Kiểm tra permissions: `chmod -R 755 /var/www/simplequiz_build`

### Ứng dụng không cập nhật
- Clear browser cache (Ctrl + Shift + R)
- Kiểm tra files đã upload mới nhất
- Reload Nginx: `systemctl reload nginx`

## Security Tips

1. **Đổi SSH port (Tùy chọn):**
```bash
nano /etc/ssh/sshd_config
# Thay Port 22 thành Port 2222
systemctl restart sshd
```

2. **Disable root login (Sau khi tạo user thường):**
```bash
adduser deploy
usermod -aG sudo deploy
# Sau đó disable root login trong sshd_config
```

3. **Cập nhật thường xuyên:**
```bash
apt update && apt upgrade -y
```

4. **Monitoring:**
- Cài đặt monitoring tools như `htop`, `netdata`
- Set up alerts qua DigitalOcean Monitoring

## Chi phí ước tính

- Droplet Basic: $6/month (1GB RAM, 25GB SSD)
- Bandwidth: 1TB/month (miễn phí)
- Domain (nếu mua): $10-15/year
- SSL Certificate: Miễn phí (Let's Encrypt)

**Tổng: ~$6/month**

## Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra logs Nginx
2. Kiểm tra file permissions
3. Verify build files đã upload đúng
4. Test trực tiếp trên server: `curl localhost`

Đọc thêm: [DEPLOYMENT.md](./DEPLOYMENT.md) để biết chi tiết đầy đủ.
