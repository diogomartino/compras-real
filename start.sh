#!/usr/bin/env bash
tmux new-session 'docker compose up' \
  \; split-window -h 'sleep 1 && cd ./apps/server && bun dev' \
  \; split-window -v 'sleep 1 && cd ./apps/client && bun dev' \
  \; select-pane -t 0
