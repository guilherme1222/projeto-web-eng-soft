#!/bin/bash
./resetVolume.sh
sleep 2
docker exec -i diskpelada-postgres-1 psql -U dev diskapi <api/src/main/resources/bd/create.sql
sleep 1
docker exec -i diskpelada-postgres-1 psql -U dev diskapi <api/src/main/resources/bd/populate.sql