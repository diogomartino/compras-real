#!/usr/bin/env bash
tmux new-session 'docker compose up' \
  \; split-window -h 'sleep 3 && cd ./apps/server && bun dev' \
  \; split-window -v 'sleep 3 && cd ./apps/client && bun dev' \
  \; select-pane -t 0
