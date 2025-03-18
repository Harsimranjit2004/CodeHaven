FROM node:20
WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript project
RUN npm run build || tsc -b

# Expose the port
EXPOSE 3500

# Command to run the compiled JavaScript file
CMD ["node", "dist/index.js"]