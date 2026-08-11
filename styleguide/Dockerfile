FROM node:24-bookworm-slim

RUN apt-get update \
    && apt-get install --no-install-recommends -y make \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV npm_config_legacy_peer_deps=true

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 8888

CMD ["make", "run"]
