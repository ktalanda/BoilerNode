FROM node

WORKDIR /home/app

ADD package.json /home/app/packaje.json
RUN npm install

ADD . /home/app

EXPOSE 3000
CMD ["./node_modules/.bin/forever -m 5 server.js production"]
