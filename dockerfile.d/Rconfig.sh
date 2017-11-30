sed -i "s/\"XK_MS_HOST\":\(.*\)/\"XK_MS_HOST\":\"$LDB_HOST\",/;
        s/\"XK_MS_SCHEME\":\(.*\)/\"XK_MS_SCHEME\":\"$SCHEME\",/;
        s/\"XK_MS_PORT\":\(.*\)/\"XK_MS_PORT\":\"$XK_MS_PORT\",/;
        s;\"CKEDITOR_HOST\":\(.*\);\"CKEDITOR_HOST\":\"$CKEDITOR_HOST\",;
        s;\"UPLOAD\":\(.*\);\"UPLOAD\":\"$UPLOAD\";
" /srv/www/xk-web/js/config.js

nginx -g "daemon off;"
