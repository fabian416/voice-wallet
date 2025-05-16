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

RUN python3 -m venv /app/voice-embedding/.venv && \
    /app/voice-embedding/.venv/bin/pip install --no-cache-dir -r /app/voice-embedding/requirements.txt

RUN yarn build

EXPOSE 5001

COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]
