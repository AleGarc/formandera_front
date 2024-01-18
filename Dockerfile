FROM node:18-alpine

WORKDIR /formandera_front_react

COPY  package.json package-lock.json /formandera_front_react/
RUN npm ci && npm install http-server-spa -g

COPY . /formandera_front_react/

ARG REACT_APP_HOST 
ENV REACT_APP_HOST $REACT_APP_HOST
ARG REACT_APP_PORT
ENV REACT_APP_PORT $REACT_APP_PORT
ARG REACT_APP_API_HOST
ENV REACT_APP_API_HOST $REACT_APP_API_HOST
ARG REACT_APP_API_PORT
ENV REACT_APP_API_PORT $REACT_APP_API_PORT

RUN npm run build
RUN npm prune --production



