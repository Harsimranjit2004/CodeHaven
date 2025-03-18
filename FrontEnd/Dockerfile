FROM node:18 AS build
WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install dependencies, including polyfill
RUN npm install

# Copy the rest of the application code
COPY . .

# Install crypto polyfill to fix getRandomValues issue
RUN npm install crypto --save-dev

# Build the application
RUN npm run build

# Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]