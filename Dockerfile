FROM node:20 as build

WORKDIR /app

COPY package*.json ./

RUN npm install

EXPOSE 8080

COPY . .

ARG TOVUTI_API_KEY
ENV TOVUTI_API_KEY="$TOVUTI_API_KEY"

RUN npm run build

