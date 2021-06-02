FROM node:14-alpine

RUN mkdir -p /var/portainer-backup && \
	mkdir -m 0644 -p /var/log/cron && \
	touch /var/log/cron/cron.log

COPY cron-pbk /etc/crontabs/root
COPY supervisord.conf /etc/supervisord.conf
COPY bash-profile.txt /root/.bashrc

WORKDIR /var/portainer-backup
VOLUME "/data"

# Desabilita a verificação SSL do git
ENV GIT_SSL_NO_VERIFY=true

RUN apk update && apk add --no-cache make gcc g++ python dcron git bash bash-doc bash-completion supervisor vim && \
	mkdir -p /run/supervisord/ /backup && \
	git clone https://github.com/lucasdiedrich/portainer-backup-restore . && \
	npm install --silent && \
	rm -rf backup/ config/*; ln -s /data/backup $(pwd)/backup; ln -s /data/config.json $(pwd)/config/default.json && \
	apk del make gcc g++ python && rm -rf /var/cache/apk/* 

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
