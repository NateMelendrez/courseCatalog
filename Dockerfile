FROM node:20 as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG TOVUTI_API_KEY
ENV TOVUTI_API_KEY="$TOVUTI_API_KEY"

RUN npm run build

FROM nginx:1.19

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

COPY --from=build /app/dist /usr/share/nginx/html