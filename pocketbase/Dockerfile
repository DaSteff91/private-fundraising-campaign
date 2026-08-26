# SPDX-License-Identifier: MIT
# Downloads pinned PocketBase at build time (no host pocketbase/bin required).
FROM alpine:3.21

ARG PB_VERSION=0.40.1
ARG PB_TARGET=linux_amd64

RUN apk add --no-cache ca-certificates wget unzip \
  && wget -q -O /tmp/pb.zip \
    "https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_${PB_TARGET}.zip" \
  && unzip -o /tmp/pb.zip pocketbase -d /pb \
  && chmod +x /pb/pocketbase \
  && rm /tmp/pb.zip \
  && apk del unzip

WORKDIR /pb
EXPOSE 8090

# Apply checked-in migrations, then serve (automigrate stays off so admin UI
# edits do not write new files into the read-only migrations mount).
CMD ["sh", "-c", "/pb/pocketbase migrate up --dir=/pb/pb_data --migrationsDir=/pb/pb_migrations && exec /pb/pocketbase serve --http=0.0.0.0:8090 --dir=/pb/pb_data --migrationsDir=/pb/pb_migrations --automigrate=false"]
