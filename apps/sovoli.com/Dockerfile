ARG APP_DIRNAME=sovoli.com
ARG APP_PKG_NAME=@sovoli/sovoli.com


# RUN apt-get update && apt-get install -y fuse3 openssl sqlite3 ca-certificates

# Prune monorepo
FROM node:20-bookworm-slim as pruner
ARG APP_PKG_NAME

RUN apt-get update && apt-get install -y openssl
WORKDIR /app
RUN npm install turbo --global
COPY . .
RUN turbo prune --scope=${APP_PKG_NAME} --docker
RUN find . -name "node_modules" -type d -prune -exec rm -rf '{}' +


FROM  node:20-bookworm-slim AS base
# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl
RUN corepack enable
WORKDIR /app
COPY .gitignore .gitignore
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/package-lock.json ./package-lock.json

# Install all node_modules, including dev dependencies
FROM base AS dev-deps
WORKDIR /app
# First install the dependencies (as they change less often)
RUN npm install --include=dev

# Setup production node_modules
FROM base as production-deps
WORKDIR /app
ENV NODE_ENV production
RUN npm install --omit=dev
COPY --from=pruner /app/out/full/apps/sovoli.com/prisma/schema.prisma /app/apps/sovoli.com/prisma/schema.prisma
RUN npx prisma generate --schema /app/apps/sovoli.com/prisma/schema.prisma

FROM base AS builder
ARG APP_PKG_NAME
ARG COMMIT_SHA
ENV COMMIT_SHA=$COMMIT_SHA
WORKDIR /app
RUN corepack enable
ENV NODE_ENV production
COPY --from=pruner /app/out/full/ .
COPY --from=dev-deps /app/ .
COPY turbo.json turbo.json
RUN npm run generate
RUN npm run build -- --filter=$APP_PKG_NAME...


FROM base as runner
ARG APP_DIRNAME
ENV NODE_ENV production

COPY --from=pruner /app/out/full/ .
COPY --from=production-deps /app .
# COPY --from=builder /app/apps/$APP_DIRNAME/server.mjs ./apps/$APP_DIRNAME/server.mjs
COPY --from=builder /app/apps/$APP_DIRNAME/build ./apps/$APP_DIRNAME/build
COPY --from=builder /app/apps/$APP_DIRNAME/public ./apps/$APP_DIRNAME/public

CMD ["npm", "run", "start-sovoli.com-production"]