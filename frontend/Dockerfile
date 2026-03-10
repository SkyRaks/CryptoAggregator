FROM node:20-alpine

WORKDIR /app

# star means copy package-lock.json ALSO
COPY package*.json ./

RUN npm install

COPY . .

# builds static files like index.html, assets, JS bundles
RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "preview"]