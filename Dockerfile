FROM debian:jessie

WORKDIR /openlmis-referencedata-ui

COPY package.json .
COPY bower.json .
COPY config.json .
COPY src/ ./src/
