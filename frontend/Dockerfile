FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx expo export --platform web

RUN npm i -D express compression morgan

EXPOSE 80

CMD ["node", "server.js"]
