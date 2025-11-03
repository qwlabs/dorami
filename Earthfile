VERSION 0.8

ARG --global NODE_VERSION=24.11.0
ARG --global ALPINE_VERSION=3.22

ARG --global BASE_IMAGE=earthly/dind:alpine-3.20-docker-26.1.5-r0
ARG --global BUILD_IMAGE=node:${NODE_VERSION}-alpine${ALPINE_VERSION}

ARG --global PIPELINE_ID
ARG --global NPM_ACCESS_TOKEN

ARG --global NODE_REGISTRY=https://registry.npmmirror.com

FROM ${BASE_IMAGE}
DO +SETUP_WORKDIR
COPY .version .
ARG --global APP_BASE_VERSION=$(cat .version | head -1)
ARG --global APP_VERSION=${APP_BASE_VERSION}.${PIPELINE_ID}

build-base:
  FROM ${BUILD_IMAGE}
  DO +SETUP_WORKDIR
  DO +SETUP_ALPINE
  DO +SETUP_PNPM
  COPY  pnpm-lock.yaml \
        pnpm-workspace.yaml \
        package.json \
        .npmrc \
        .
  RUN pnpm fetch --frozen-lockfile

check:
  FROM +build-base
  COPY . .
  RUN pnpm install -r --prefer-offline
  RUN pnpm run build:check

release:
  FROM +build-base
  COPY . .
  RUN echo "//registry.npmjs.org/:_authToken=${NPM_ACCESS_TOKEN}" > .npmrc
  RUN pnpm install -r --prefer-offline
  RUN pnpm version ${APP_VERSION} --no-commit-hooks --no-git-tag-version --allow-same-version
  RUN pnpm run release

ci-check:
  BUILD +check

ci-release:
  BUILD +release

SETUP_ALPINE:
  FUNCTION
  COPY ./.earthly/repositories /etc/apk/repositories
  RUN apk update

SETUP_PNPM:
  FUNCTION
  RUN npm config set registry ${NODE_REGISTRY} --global
  RUN npm install --global corepack@latest
  RUN corepack enable pnpm
  RUN corepack use pnpm@latest-10
  RUN pnpm config set registry ${NODE_REGISTRY} --global
  CACHE --sharing shared node_modules

SETUP_WORKDIR:
  FUNCTION
  WORKDIR /app
