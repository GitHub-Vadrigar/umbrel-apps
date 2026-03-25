FROM ubuntu:22.04

RUN apt update && apt install -y \
    curl \
    wget \
    bzip2 \
    ca-certificates \
    python3 \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /nerva

RUN wget https://github.com/nerva-project/nerva/releases/download/v0.2.0.0/nerva-linux-x86_64-v0.2.0.0.tar.bz2 \
 && tar -xjf nerva-linux-x86_64-v0.2.0.0.tar.bz2 \
 && mv nerva-*/* . \
 && rm -rf nerva-*

WORKDIR /app
COPY app/ /app

COPY start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"]
