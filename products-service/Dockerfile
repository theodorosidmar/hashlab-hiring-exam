FROM node:9.5.0-alpine
WORKDIR /products-service
COPY . .
RUN apk add --no-cache --virtual .gyp python make g++
RUN npm install --production --no-cache
RUN apk del .gyp
CMD ["npm", "start"]
EXPOSE 3000