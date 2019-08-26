FROM node:latest

WORKDIR /usr/app

COPY package.json /usr/app
COPY yarn.lock /usr/app

RUN yarn

COPY . /usr/app

ARG REACT_APP_ENV=prod
ENV REACT_APP_ENV=${REACT_APP_ENV}

COPY src/config_sample.js src/config.js
RUN yarn build

FROM nginx

COPY --from=0 /usr/app/build /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/
