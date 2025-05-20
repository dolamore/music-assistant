FROM mcr.microsoft.com/playwright:v1.52.0-noble

WORKDIR /metronome-app
COPY package*.json ./
RUN npm ci

COPY playwright.config.ts ./
COPY . .

EXPOSE 3001

CMD ["sh", "-c", "npm run dev & npx wait-on http://localhost:3001 && npm run test"]