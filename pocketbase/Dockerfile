# SPDX-License-Identifier: MIT
# Build after: npm run pb:fetch
FROM alpine:3.21

RUN apk add --no-cache ca-certificates wget

COPY bin/pocketbase /pb/pocketbase
RUN chmod +x /pb/pocketbase

WORKDIR /pb
EXPOSE 8090

# Apply checked-in migrations, then serve (automigrate stays off so admin UI
# edits do not write new files into the read-only migrations mount).
CMD ["sh", "-c", "/pb/pocketbase migrate up --dir=/pb/pb_data --migrationsDir=/pb/pb_migrations && exec /pb/pocketbase serve --http=0.0.0.0:8090 --dir=/pb/pb_data --migrationsDir=/pb/pb_migrations --automigrate=false"]
