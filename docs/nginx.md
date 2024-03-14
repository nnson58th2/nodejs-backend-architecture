## install nginx

```bash
sudo apt-get install -y nginx
cd /etc/nginx/sites-available

sudo vim default

location /api {
    rewrite ^\/api\/(.*)$ /api/$1 break;
    proxy_pass http://localhost:3000;
    proxy_set_headers Host $host;
    proxy_set_headers X-Real-IP $remote_addr;
    proxy_set_headers X-Forwarded-For $proxy_add_x_forwarded_for;
}

sudo systemctl restart nginx
```
