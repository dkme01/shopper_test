# Base image
FROM node:22-alpine AS BUILDER

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm ci --only=production

# Bundle app source
COPY . .
RUN npm run build

# Create non-root user
FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodeapp -u 1001
RUN chown -R nodeapp:nodejs /app
USER nodeapp

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD [ "node", "dist/index.js" ]
