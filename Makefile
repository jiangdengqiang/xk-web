



WS:
	ln -s $(pwd)/dest  /srv/www/questbank-web
	sudo ln -s $(pwd)/nginx-site.conf /etc/nginx/sites-enabled/questbank-web
	sudo systemctl restart nginx

watch:
	gulp watch &
chrome:
	echo "启动本地（工作站）环境下的站点服务"
	google-chrome http://localhost:8701/login/login.html &

prepare:

	sudo npm install -g gulp

git-subtree-add-burn:
	git subtree add --prefix burn --squash ssh://git@gitlab.rawstonedu.net:10022/sculptor/burn-xk-web.git develop
