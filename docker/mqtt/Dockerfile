FROM eclipse-mosquitto:2.1.2-alpine

ENV MOSQUITTO_LOG_LEVEL=debug

COPY config/mosquitto.conf /mosquitto/config/mosquitto.conf
COPY config/passwords /mosquitto/config/passwords

COPY certs/server/server.crt /mosquitto/certs/server.crt
COPY certs/server/server.key /mosquitto/certs/server.key
COPY certs/ca/ca.crt /mosquitto/certs/ca.crt

USER root
RUN chmod 644 /mosquitto/certs/server.crt /mosquitto/certs/ca.crt && \
    chmod 600 /mosquitto/certs/server.key && \
    chown -R mosquitto:mosquitto /mosquitto/

EXPOSE 1883 8883 9001

VOLUME ["/mosquitto/data", "/mosquitto/log"]
