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
  COPY pnpm-lock.yaml \
       pnpm-workspace.yaml \
       package.json \
       .npmrc \
       .
  RUN npm install -g pnpm@latest-9 --registry=https://registry.npmmirror.com
  RUN pnpm fetch --dev
  SAVE ARTIFACT node_modules AS LOCAL node_modules

check:
  FROM +build-base
  COPY . .
  RUN pnpm install -r --prefer-offline --dev
  RUN pnpm run build:check

release:
  FROM +build-base
  COPY . .
  RUN pnpm install -r --prefer-offline --dev
  RUN pnpm version ${APP_VERSION} --no-commit-hooks --no-git-tag-version --allow-same-version
  RUN pnpm run release

ci-check:
  BUILD +check

ci-release:
  BUILD +release

