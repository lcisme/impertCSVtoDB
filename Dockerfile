FROM node:20-buster-slim

WORKDIR /

COPY package*.json ./

RUN npm install

COPY . .


EXPOSE 3000

CMD ["node", "app.js"]
