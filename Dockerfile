FROM node:22

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# Set environment
ENV NODE_ENV=production
ENV PORT=8080

# Start directly
EXPOSE 8080
CMD ["node", "server.js"]
