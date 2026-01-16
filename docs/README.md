# 📚 Tài liệu Deployment - SimpleQuiz

## Mục lục

1. **[QUICKSTART.md](./QUICKSTART.md)** ⚡ 
   - Hướng dẫn bắt đầu nhanh nhất
   - 3 bước để deploy lần đầu
   - Dành cho người mới bắt đầu

2. **[DEPLOYMENT.md](./DEPLOYMENT.md)** 📖
   - Hướng dẫn deployment đầy đủ và chi tiết
   - Các cách deploy khác nhau
   - Troubleshooting và best practices

3. **[GITHUB-SECRETS.md](./GITHUB-SECRETS.md)** 🔐
   - Cấu hình GitHub Actions để auto deploy
   - Tạo và quản lý SSH keys
   - Thêm secrets vào GitHub repository
   - Security best practices

4. **[CLOUDFLARE.md](./CLOUDFLARE.md)** ☁️
   - Tích hợp Cloudflare CDN
   - Setup SSL/HTTPS miễn phí
   - Tối ưu hóa performance
   - DDoS protection

## Quy trình Deploy khuyến nghị

### Lần đầu tiên:

```
1. Đọc QUICKSTART.md
   ↓
2. Setup server với server-setup.sh
   ↓
3. Deploy thủ công để test
   ↓
4. Setup GitHub Actions (GITHUB-SECRETS.md)
   ↓
5. Tích hợp Cloudflare (CLOUDFLARE.md)
```

### Các lần sau:

```
git add .
git commit -m "Update"
git push origin main
↓
GitHub Actions tự động deploy
↓
Purge Cloudflare cache (tự động)
```

## Scripts có sẵn

- **`server-setup.sh`** - Setup server lần đầu (chạy trên server)
- **`deploy.sh`** - Deploy thủ công từ local (chạy trên local)
- **`nginx.conf`** - Config Nginx template

## Files cấu hình

- **`.github/workflows/deploy.yml`** - GitHub Actions workflow
- **`vite.config.js`** - Vite build configuration
- **`.gitignore`** - Git ignore rules

## Hỗ trợ

Nếu gặp vấn đề:
1. Check logs: `tail -f /var/log/nginx/error.log`
2. Verify files: `ls -la /var/www/simplequiz_build`
3. Test Nginx: `nginx -t`
4. Restart services: `systemctl restart nginx`

## Chi phí ước tính

| Service | Chi phí |
|---------|---------|
| DigitalOcean Droplet | $6/month |
| Domain (tùy chọn) | $10-15/year |
| Cloudflare | **FREE** |
| SSL Certificate | **FREE** |
| **Tổng** | **~$6/month** |

## Quick Links

- [DigitalOcean](https://cloud.digitalocean.com/)
- [Cloudflare](https://www.cloudflare.com/)
- [GitHub Actions](https://github.com/features/actions)
- [Let's Encrypt](https://letsencrypt.org/)

---

**Chúc bạn deploy thành công! 🚀**
