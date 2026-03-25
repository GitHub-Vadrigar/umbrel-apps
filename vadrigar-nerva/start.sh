#!/bin/bash

echo "Starting Nerva daemon..."

/nerva/nervad \
  --data-dir=/data/nerva \
  --p2p-bind-ip=0.0.0.0 \
  --p2p-bind-port=17565 \
  --rpc-bind-ip=0.0.0.0 \
  --rpc-bind-port=17566 \
  --confirm-external-bind &

echo "Waiting for nervad..."

until curl -s http://localhost:17566/json_rpc \
  -d '{"jsonrpc":"2.0","id":"0","method":"get_info"}' \
  -H 'Content-Type: application/json' > /dev/null; do

  sleep 2
done

echo "nervad ready"

cd /app
exec python3 server.py
