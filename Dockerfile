# SPDX-License-Identifier: MIT
# Copies prebuilt dist/ only. Build on the laptop: npm run build && docker compose up --build
FROM node:20-alpine

RUN addgroup -S pfc && adduser -S pfc -G pfc
WORKDIR /app

COPY server.mjs ./
COPY dist ./dist

USER pfc
ENV NODE_ENV=production
ENV PORT=7890
ENV LIVE_DIR=/live
EXPOSE 7890

CMD ["node", "server.mjs"]
