FROM node:19

WORKDIR /



COPY package.json .

COPY package-lock.json .

RUN npm install




ENTRYPOINT ["node"]

CMD ["main.js"]
