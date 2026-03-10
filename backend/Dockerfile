FROM node:20-alpine

WORKDIR /app

# star means copy package-lock.json ALSO
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD [ "npm", "start" ]
