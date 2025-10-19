FROM node:20-alpine
WORKDIR /app

# Install only production dependencies for the API workspace
COPY package.json ./
RUN npm install --omit=dev

# Copy source
COPY . .

EXPOSE 3000
CMD ["node", "server.js"]
