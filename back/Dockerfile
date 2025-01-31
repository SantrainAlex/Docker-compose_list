FROM node:18-alpine

WORKDIR /app
COPY package*.json ./

RUN apk add --no-cache wget && \
    npm install
COPY . .
EXPOSE 3000

CMD ["npm", "start"]
