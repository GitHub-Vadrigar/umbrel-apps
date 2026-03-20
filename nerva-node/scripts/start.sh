#!/bin/bash

# Start nerva daemon
/nerva/build/release/bin/nervad \
  --rpc-bind-ip=0.0.0.0 \
  --rpc-bind-port=17566 \
  --confirm-external-bind &

# simpele webserver voor UI
cd /app
python3 -m http.server 3000
