FROM node:6.10-alpine

WORKDIR /app
COPY . /app

RUN adduser -D rabblerouser
RUN chown -R rabblerouser /app
USER rabblerouser

ENV NODE_ENV production
RUN npm install

EXPOSE 3000
CMD npm start
