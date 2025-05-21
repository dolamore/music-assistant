FROM mcr.microsoft.com/playwright:v1.52.0-noble

WORKDIR /metronome-app
COPY package*.json ./
RUN npm ci

COPY . .