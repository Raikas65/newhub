FROM node:20-alpine

WORKDIR /app

# Įkeliame package.json ir scripts
COPY package.json package-lock.json* ./
COPY scripts ./scripts

# Įdiegiame tik reikalingas priklausomybes
RUN npm install --omit=dev

# Parsisiunčiame TogetherJS hub failus
RUN node scripts/fetch.js

# (Pasirenkama) jei nori nurodyti konkretų portą
# ENV PORT=10000
# EXPOSE 10000

# Paleidžiame hub serverį
CMD ["node", "hub/server.cjs"]
