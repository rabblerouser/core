FROM node:6.10-alpine

WORKDIR /app
COPY . /app

RUN adduser -D rabblerouser
RUN chown -R rabblerouser /app
USER rabblerouser

RUN npm install

ENV NODE_ENV production
EXPOSE 3000
CMD npm start
