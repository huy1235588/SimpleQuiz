# Hướng dẫn sử dụng Cloudflare với SimpleQuiz

## Tại sao dùng Cloudflare?

Cloudflare cung cấp:
- ✅ **CDN miễn phí** - Tăng tốc độ load trang trên toàn cầu
- ✅ **SSL/HTTPS miễn phí** - Bảo mật cho website
- ✅ **DDoS protection** - Bảo vệ khỏi tấn công
- ✅ **DNS quản lý** - Dễ dàng quản lý domain
- ✅ **Caching** - Giảm tải cho server
- ✅ **Analytics** - Thống kê truy cập

## Phần 1: Cấu hình Domain với Cloudflare

### Bước 1: Tạo tài khoản Cloudflare

1. Truy cập: [https://www.cloudflare.com/](https://www.cloudflare.com/)
2. Click **Sign Up** (miễn phí)
3. Xác nhận email

### Bước 2: Thêm Domain vào Cloudflare

1. Đăng nhập Cloudflare
2. Click **Add a Site**
3. Nhập domain của bạn (ví dụ: `simplequiz.com`)
4. Click **Add Site**

### Bước 3: Chọn Plan

1. Chọn **Free Plan** ($0/month)
2. Click **Continue**

### Bước 4: Scan DNS Records

Cloudflare sẽ tự động scan các DNS records hiện có.

Click **Continue**

### Bước 5: Thay đổi Nameservers

Cloudflare sẽ cung cấp 2 nameservers, ví dụ:
```
aron.ns.cloudflare.com
roxy.ns.cloudflare.com
```

#### Cập nhật Nameservers tại Domain Provider:

**Nếu mua domain từ Namecheap:**
1. Đăng nhập [Namecheap](https://www.namecheap.com/)
2. Domain List > Manage
3. Nameservers > Custom DNS
4. Thêm 2 nameservers từ Cloudflare
5. Save

**Nếu mua domain từ GoDaddy:**
1. Đăng nhập [GoDaddy](https://www.godaddy.com/)
2. My Products > Domains
3. DNS > Nameservers
4. Change > Custom
5. Thêm 2 nameservers từ Cloudflare
6. Save

**Nếu mua domain từ nhà cung cấp Việt Nam (PA, Mat Bao, etc.):**
- Tìm phần quản lý Nameservers
- Chuyển sang Custom Nameservers
- Thêm 2 nameservers từ Cloudflare

**Lưu ý:** Có thể mất 2-24 giờ để nameservers propagate.

### Bước 6: Xác nhận trên Cloudflare

1. Quay lại Cloudflare
2. Click **Done, check nameservers**
3. Đợi Cloudflare xác nhận (sẽ gửi email khi xong)

## Phần 2: Cấu hình DNS Records

### Bước 1: Truy cập DNS Settings

1. Vào Cloudflare Dashboard
2. Chọn domain của bạn
3. Click **DNS** ở menu bên trái

### Bước 2: Thêm DNS Records

#### Record 1: Root domain
```
Type: A
Name: @
IPv4 address: YOUR_DROPLET_IP
Proxy status: Proxied (☁️ màu cam)
TTL: Auto
```

#### Record 2: WWW subdomain
```
Type: A
Name: www
IPv4 address: YOUR_DROPLET_IP
Proxy status: Proxied (☁️ màu cam)
TTL: Auto
```

**Lưu ý về Proxy Status:**
- **Proxied (☁️)**: Traffic đi qua Cloudflare (khuyên dùng)
- **DNS only (☁️ xám)**: Traffic đi thẳng tới server

Click **Save** sau mỗi record.

## Phần 3: Cấu hình SSL/HTTPS

### Bước 1: Chọn SSL Mode

1. Vào **SSL/TLS** trong menu
2. Chọn **Overview**
3. Chọn mode: **Flexible** (cho lần đầu)

#### Các SSL Modes:

**Flexible** (Dễ nhất - dùng cho bắt đầu)
```
Browser --[HTTPS]--> Cloudflare --[HTTP]--> Server
```
- User thấy HTTPS
- Server chạy HTTP
- ✅ Dễ setup
- ⚠️ Kém bảo mật giữa Cloudflare và Server

**Full** (Khuyên dùng)
```
Browser --[HTTPS]--> Cloudflare --[HTTPS]--> Server
```
- Cần SSL cert trên server
- ✅ Bảo mật hơn

**Full (Strict)** (Tốt nhất)
```
Browser --[HTTPS]--> Cloudflare --[HTTPS (verified)]--> Server
```
- Cần SSL cert hợp lệ trên server
- ✅ Bảo mật cao nhất

### Bước 2: Bật Always Use HTTPS

1. Vào **SSL/TLS** > **Edge Certificates**
2. Scroll xuống tìm **Always Use HTTPS**
3. Bật **ON**

Điều này tự động chuyển HTTP sang HTTPS.

### Bước 3: Bật Automatic HTTPS Rewrites

1. Vẫn trong **Edge Certificates**
2. Tìm **Automatic HTTPS Rewrites**
3. Bật **ON**

### Bước 4: Upgrade lên Full SSL (Khuyên dùng)

Sau khi đã setup Flexible, nên upgrade lên Full:

#### Trên DigitalOcean Server:

```bash
ssh root@YOUR_DROPLET_IP

# Cài đặt Certbot
apt install certbot python3-certbot-nginx -y

# Lấy SSL certificate
certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Chọn option 2: Redirect HTTP to HTTPS
```

#### Sau đó quay lại Cloudflare:

1. **SSL/TLS** > **Overview**
2. Chọn mode: **Full**
3. Save

## Phần 4: Tối ưu hóa Performance

### 1. Bật Auto Minify

**Speed** > **Optimization**

Bật:
- ✅ JavaScript
- ✅ CSS
- ✅ HTML

### 2. Cấu hình Caching

**Caching** > **Configuration**

#### Caching Level: Standard

#### Browser Cache TTL: 4 hours (hoặc lâu hơn)

### 3. Tạo Page Rules

**Rules** > **Page Rules** > **Create Page Rule**

#### Rule 1: Cache tất cả static files
```
URL: *simplequiz.com/*.{js,css,jpg,jpeg,png,gif,ico,svg,woff,woff2}

Settings:
- Cache Level: Cache Everything
- Edge Cache TTL: 1 month

Save and Deploy
```

#### Rule 2: Cache JSON data (tùy chọn)
```
URL: *simplequiz.com/data/*.json

Settings:
- Cache Level: Cache Everything
- Edge Cache TTL: 1 day

Save and Deploy
```

### 4. Bật Brotli Compression

**Speed** > **Optimization**

Bật: **Brotli**

## Phần 5: Security Settings

### 1. Cấu hình Security Level

**Security** > **Settings**

Security Level: **Medium**

### 2. Bật Browser Integrity Check

Bật: **ON**

### 3. Challenge Passage

Challenge Passage: **30 minutes**

### 4. Bật Bot Fight Mode (Free plan)

**Security** > **Bots**

Bật: **Bot Fight Mode**

## Phần 6: Cập nhật Nginx Config

Sau khi dùng Cloudflare, cập nhật Nginx để nhận real IP:

```bash
ssh root@YOUR_DROPLET_IP
nano /etc/nginx/sites-available/simplequiz
```

Thêm vào đầu block `server`:

```nginx
server {
    listen 80;
    listen [::]:80;
    
    server_name yourdomain.com www.yourdomain.com;
    
    # Cloudflare Real IP
    set_real_ip_from 173.245.48.0/20;
    set_real_ip_from 103.21.244.0/22;
    set_real_ip_from 103.22.200.0/22;
    set_real_ip_from 103.31.4.0/22;
    set_real_ip_from 141.101.64.0/18;
    set_real_ip_from 108.162.192.0/18;
    set_real_ip_from 190.93.240.0/20;
    set_real_ip_from 188.114.96.0/20;
    set_real_ip_from 197.234.240.0/22;
    set_real_ip_from 198.41.128.0/17;
    set_real_ip_from 162.158.0.0/15;
    set_real_ip_from 104.16.0.0/13;
    set_real_ip_from 104.24.0.0/14;
    set_real_ip_from 172.64.0.0/13;
    set_real_ip_from 131.0.72.0/22;
    set_real_ip_from 2400:cb00::/32;
    set_real_ip_from 2606:4700::/32;
    set_real_ip_from 2803:f800::/32;
    set_real_ip_from 2405:b500::/32;
    set_real_ip_from 2405:8100::/32;
    set_real_ip_from 2a06:98c0::/29;
    set_real_ip_from 2c0f:f248::/32;
    real_ip_header CF-Connecting-IP;
    
    root /var/www/simplequiz_build;
    # ... rest of config
}
```

Test và reload:
```bash
nginx -t
systemctl reload nginx
```

## Phần 7: Kiểm tra và Test

### 1. Test SSL

Truy cập: [https://www.ssllabs.com/ssltest/](https://www.ssllabs.com/ssltest/)

Nhập domain và kiểm tra rating.

### 2. Test Performance

Truy cập: [https://www.webpagetest.org/](https://www.webpagetest.org/)

Nhập domain và chạy test.

### 3. Test từ nhiều locations

Truy cập: [https://www.dotcom-tools.com/website-speed-test](https://www.dotcom-tools.com/website-speed-test)

### 4. Check DNS Propagation

Truy cập: [https://www.whatsmydns.net/](https://www.whatsmydns.net/)

Nhập domain để check DNS đã propagate chưa.

## Phần 8: Purge Cache khi cập nhật

Mỗi khi deploy code mới:

### Cách 1: Từ Cloudflare Dashboard

1. **Caching** > **Configuration**
2. Click **Purge Everything**
3. Confirm

### Cách 2: Tự động với GitHub Actions

Cập nhật file `.github/workflows/deploy.yml`:

```yaml
- name: Purge Cloudflare Cache
  run: |
    curl -X POST "https://api.cloudflare.com/client/v4/zones/${{ secrets.CLOUDFLARE_ZONE_ID }}/purge_cache" \
      -H "Authorization: Bearer ${{ secrets.CLOUDFLARE_API_TOKEN }}" \
      -H "Content-Type: application/json" \
      --data '{"purge_everything":true}'
```

#### Thêm secrets:

**CLOUDFLARE_ZONE_ID:**
- Vào Cloudflare Dashboard > Overview
- Scroll xuống, copy "Zone ID"

**CLOUDFLARE_API_TOKEN:**
- My Profile > API Tokens
- Create Token
- Template: "Edit zone DNS"
- Zone Resources: Include > Specific zone > yourdomain.com
- Continue to summary > Create Token
- Copy token

Thêm vào GitHub Secrets (xem GITHUB-SECRETS.md).

## Troubleshooting

### Website không load sau khi setup Cloudflare

1. Kiểm tra DNS đã đúng chưa
2. Đợi DNS propagate (2-24 giờ)
3. Clear browser cache: Ctrl + Shift + R

### Lỗi SSL: "Too many redirects"

1. Đổi SSL mode từ Flexible sang Full
2. Hoặc tắt "Always Use HTTPS" trong Nginx

### Website chậm sau khi dùng Cloudflare

1. Check caching rules
2. Purge cache
3. Kiểm tra "Development Mode" đã tắt chưa

### Không nhận diện real IP

- Kiểm tra đã thêm Cloudflare IP ranges vào Nginx
- Reload Nginx

## Best Practices

✅ **Nên:**
- Dùng SSL mode "Full" hoặc "Full (Strict)"
- Bật Always Use HTTPS
- Cấu hình Page Rules cho static files
- Purge cache sau mỗi deployment
- Monitor analytics thường xuyên

❌ **Không nên:**
- Dùng "Flexible" SSL lâu dài (kém bảo mật)
- Cache các API endpoints động
- Quên purge cache sau update
- Set TTL quá cao cho content hay thay đổi

## Chi phí

Cloudflare Free Plan bao gồm:
- ✅ Unlimited bandwidth
- ✅ Global CDN
- ✅ Free SSL certificate
- ✅ DDoS protection
- ✅ 3 Page Rules
- ✅ Basic analytics

**Tổng: $0/month** 🎉

## Kết luận

Với Cloudflare, website của bạn sẽ:
- 🚀 Nhanh hơn (CDN global)
- 🔒 Bảo mật hơn (HTTPS + DDoS protection)
- 💰 Tiết kiệm bandwidth
- 📊 Có analytics chi tiết

Tất cả **MIỄN PHÍ**!
