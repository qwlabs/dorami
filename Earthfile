VERSION 0.8
ARG --global BASE_IMAGE=earthly/dind:alpine
ARG --global NODE_IMAGE=node:20.17.0

FROM ${BASE_IMAGE}
WORKDIR /app
COPY .version .
ARG --global PIPELINE_ID
ARG --global APP_BASE_VERSION=$(cat .version | head -1)
ARG --global APP_VERSION=${APP_BASE_VERSION}.${PIPELINE_ID}
ARG --global NPM_ACCESS_TOKEN

build-base:
  FROM ${NODE_IMAGE}
  WORKDIR /app
  COPY bun.lockb \
       package.json \
       .npmrc \
       .
  RUN npm install -g bun --registry=https://registry.npmmirror.com
  RUN bun install --frozen-lockfile
  SAVE ARTIFACT node_modules AS LOCAL node_modules

check:
  FROM +build-base
  COPY . .
  RUN bun run build:check

release:
  FROM +build-base
  COPY . .
  RUN npm config set //registry.npmjs.org/:_authToken=${NPM_ACCESS_TOKEN}
  RUN npm version ${APP_VERSION} --no-commit-hooks --no-git-tag-version --allow-same-version
  RUN bun run build
  RUN bun run release

ci-check:
  BUILD +check

ci-release:
  BUILD +release

