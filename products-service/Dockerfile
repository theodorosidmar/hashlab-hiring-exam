FROM node:9.5.0-alpine

ENV WORKDIR /products-service

WORKDIR ${WORKDIR}

COPY package.json ${WORKDIR}
COPY package-lock.json ${WORKDIR}

RUN apk add --no-cache --virtual .gyp python make g++
RUN npm install --production --no-cache
RUN apk del .gyp

COPY . ${WORKDIR}

CMD ["npm", "start"]

EXPOSE 4600
