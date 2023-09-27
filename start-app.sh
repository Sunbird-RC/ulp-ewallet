#/bin/sh
echo "starting Copying config.json"
mv /usr/share/nginx/html/config/config.prod.js /usr/share/nginx/html/config/config.js
nginx -g "daemon off;"
