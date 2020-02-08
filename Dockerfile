FROM node:12
EXPOSE 7070

WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .

ADD crontab /etc/cron.d/exec
RUN chmod 0644 /etc/cron.d/exec

CMD npm start