FROM node:20
WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install dependencies, including dev dependencies for TypeScript
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript project
RUN npm run build

# Expose the port
EXPOSE 3001

# Command to run the compiled JavaScript file
CMD ["node", "dist/app.js"]