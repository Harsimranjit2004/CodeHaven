FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build || tsc -b
EXPOSE 3500
CMD ["node", "dist/index.js"]