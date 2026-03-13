FROM node:20-alpine

WORKDIR /app

# star means copy package-lock.json ALSO
COPY package*.json ./

RUN npm install

COPY . .

ARG VITE_BACKEND_API_URL
ENV VITE_BACKEND_API_URL=$VITE_BACKEND_API_URL

# builds static files like index.html, assets, JS bundles
RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "preview"]