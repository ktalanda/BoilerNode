FROM node

WORKDIR /home/app

RUN npm install -g gulp-cli

ADD package.json /home/app/packaje.json
RUN npm install

ADD . /home/app

ENV NODE_ENV development

EXPOSE 3000
CMD ["gulp"]