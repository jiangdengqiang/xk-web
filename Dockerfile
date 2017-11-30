From nginx

MAINTAINER chenshangtao@rawstone.com

RUN mkdir -p /srv/www/xk-web

COPY dest /srv/www/xk-web/

COPY dockerfile.d/xk-web.conf /etc/nginx/conf.d/xk-web.conf

COPY dockerfile.d/Rconfig.sh /Rconfig.sh

WORKDIR /srv/www/

ENV XK_MS_SCHEME http 
ENV XK_MS_HOST 172.17.12.3
ENV XK_MS_PORT 5000
ENV XK_MS_API_PREFIX api
ENV XK_MS_API_VERSION v1
ENV XK_CKEDITOR_URI http://172.17.12.3:8801/4.7.3/full/ckeditor.js

EXPOSE 8000 80

ENTRYPOINT ["bash","-c","/Rconfig.sh"]
