FROM node:21.6-alpine3.18

WORKDIR /app

COPY package.json ./

RUN npm install --force

COPY . .

RUN npm run build

EXPOSE 4000
CMD npm start
