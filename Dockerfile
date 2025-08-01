FROM node:20-alpine

ENV NODE_ENV=production
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --omit=dev

COPY scripts ./scripts
RUN node scripts/fetch.js

EXPOSE 8080
CMD node hub/server.cjs -p $PORT -l 0.0.0.0
