FROM mhart/alpine-node:14.16

ENV APP_NAME='js-utils'
ENV APP_PATH='/opt/js-utils'

WORKDIR /opt/js-utils

COPY ./api/package.json ./
COPY ./api/yarn.lock ./

RUN npm config set unsafe-perm true && \
    apk add --no-cache --virtual .build-deps make gcc g++ python \
    && yarn install --frozen-lockfile \
    && apk del .build-deps

COPY ./ ./

ENTRYPOINT ["/opt/js-utils/entrypoint.sh"]
