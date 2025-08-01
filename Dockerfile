FROM node:20-alpine

ENV NODE_ENV=production
WORKDIR /app

COPY package.json package-lock.json* ./
COPY scripts ./scripts  # scripts turi būti prieš npm install
RUN npm install --omit=dev

RUN node scripts/fetch.js

EXPOSE 8080
CMD node hub/server.cjs -p $PORT -l 0.0.0.0


