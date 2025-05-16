FROM node:22-slim
LABEL com.centurylinklabs.watchtower.enable="true"

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    ffmpeg \
    libsndfile1 \
    build-essential \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

RUN python3 -m venv voice-embedding/.venv && \
    . voice-embedding/.venv/bin/activate && \
    pip install --no-cache-dir -r voice-embedding/requirements.txt

RUN yarn build

EXPOSE 3000

CMD ["node", "dist/main"]
