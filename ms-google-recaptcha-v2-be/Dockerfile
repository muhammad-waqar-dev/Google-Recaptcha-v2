FROM node:12.18-alpine

RUN mkdir email
COPY . /email
WORKDIR /email

RUN npm install

RUN npm install nodemon -g

Expose 8099
CMD ["nodemon"]