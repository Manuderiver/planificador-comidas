FROM dpage/pgadmin4:8.9

ARG DB_USER
ARG DB_PASSWORD

USER root

RUN mkdir -p /var/lib/pgadmin && \
    echo "database:5432:*:${DB_USER}:${DB_PASSWORD}" > /var/lib/pgadmin/pgpass && \
    chmod 600 /var/lib/pgadmin/pgpass

COPY servers.json /pgadmin4/servers.json

USER pgadmin