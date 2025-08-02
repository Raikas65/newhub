FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
COPY scripts ./scripts

RUN npm install --omit=dev
RUN node scripts/fetch.js

# Render duoda PORT per env; server.js jį pasiima pats
CMD ["node", "hub/server.cjs"]
