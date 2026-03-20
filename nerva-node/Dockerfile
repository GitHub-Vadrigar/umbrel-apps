FROM ubuntu:22.04

RUN apt update && apt install -y \
    git build-essential cmake libboost-all-dev \
    libssl-dev libzmq3-dev curl

# Build nerva
RUN git clone https://github.com/nerva-project/nerva.git
WORKDIR /nerva
RUN make

# Copy start script
COPY scripts/start.sh /start.sh
RUN chmod +x /start.sh

# Web UI
COPY app /app

WORKDIR /

CMD ["/start.sh"]
