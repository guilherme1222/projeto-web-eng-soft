#!/bin/sh
docker stop diskpelada-postgres-1
docker-compose down || docker compose down
docker volume rm diskpelada_postgres_data
docker-compose up -d || docker compose up -d
