FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy source
COPY . .

# Build
RUN npm run build

# Expose port
EXPOSE 9000

# Start
CMD ["npm", "run", "start"]
